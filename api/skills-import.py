from http.server import BaseHTTPRequestHandler
import json
import os
import re
import urllib.request
import urllib.error
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))

def get_user_id(token):
    try:
        # Ensure token is in Bearer format
        if token.startswith("Bearer "):
            auth_value = token
        else:
            auth_value = f"Bearer {token}"
        
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": auth_value
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            user_data = json.loads(resp.read().decode())
            return user_data.get("id")
    except Exception as e:
        print(f"Auth error: {e}")
        return None

def parse_skills_markdown(content):
    skills = []
    current_category = 'general'
    
    for line in content.split('\n'):
        line = line.strip()
        
        if line.startswith('## '):
            current_category = line[3:].strip().lower().replace(' ', '_')
            continue
        
        if line.startswith('- **') or line.startswith('* **'):
            match = re.match(
                r'[-*]\s*\*\*(.+?)\*\*\s*\((.+?)\):\s*(.*)',
                line
            )
            if match:
                skill_name = match.group(1).strip()
                level_text = match.group(2).strip().lower()
                description = match.group(3).strip()
                
                level_map = {
                    'beginner': 1, 'basic': 2, 'novice': 3,
                    'intermediate': 4, 'medium': 5, 'competent': 6,
                    'advanced': 7, 'expert': 8, 'master': 9, 'guru': 10
                }
                proficiency = level_map.get(level_text, 5)
                
                skills.append({
                    'skill_name': skill_name,
                    'skill_category': current_category,
                    'proficiency_level': proficiency,
                    'description': description,
                    'source': 'import'
                })
    
    return skills

def supabase_request(method, path, data=None, service_key=True):
    if service_key and SUPABASE_SERVICE_KEY:
        headers = {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    else:
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    url = f"{SUPABASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode()) if resp.status != 204 else None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        raise Exception(f"Supabase error {e.code}: {error_body}")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
            file_name = data.get("file_name", "")
            content = data.get("content", "")
            auth_token = data.get("Authorization", self.headers.get("Authorization", ""))
        except (json.JSONDecodeError, KeyError):
            self.send_json(400, {"success": False, "error": "Invalid request"})
            return
        
        if not file_name.endswith('.md'):
            self.send_json(400, {"success": False, "error": "Only .md files are supported"})
            return
        
        user_id = get_user_id(auth_token)
        if not user_id:
            self.send_json(401, {"success": False, "error": "Unauthorized"})
            return
        
        import_id = None
        try:
            import_record = supabase_request(
                "POST",
                "/rest/v1/ai_skill_imports",
                {
                    "user_id": user_id,
                    "file_name": file_name,
                    "file_size": len(content),
                    "parse_status": "processing",
                    "raw_content": content
                }
            )
            import_id = import_record[0]["id"] if import_record else None
            
            skills = parse_skills_markdown(content)
            
            imported = 0
            skipped = 0
            results = []
            
            for skill in skills:
                try:
                    existing = supabase_request(
                        "GET",
                        f"/rest/v1/ai_skills?user_id=eq.{user_id}&skill_name=eq.{skill['skill_name']}"
                    )
                    
                    if existing:
                        supabase_request(
                            "PATCH",
                            f"/rest/v1/ai_skills?user_id=eq.{user_id}&skill_name=eq.{skill['skill_name']}",
                            {
                                "proficiency_level": skill['proficiency_level'],
                                "description": skill['description'],
                                "skill_category": skill['skill_category'],
                                "source": "import",
                                "source_file": file_name,
                                "updated_at": datetime.utcnow().isoformat()
                            }
                        )
                        results.append({**skill, "status": "updated"})
                        imported += 1
                    else:
                        supabase_request(
                            "POST",
                            "/rest/v1/ai_skills",
                            {
                                "user_id": user_id,
                                "skill_name": skill['skill_name'],
                                "skill_category": skill['skill_category'],
                                "proficiency_level": skill['proficiency_level'],
                                "description": skill['description'],
                                "source": "import",
                                "source_file": file_name
                            }
                        )
                        results.append({**skill, "status": "new"})
                        imported += 1
                except Exception as e:
                    results.append({**skill, "status": "error", "error": str(e)})
                    skipped += 1
            
            if import_id:
                supabase_request(
                    "PATCH",
                    f"/rest/v1/ai_skill_imports?id=eq.{import_id}",
                    {
                        "parse_status": "completed",
                        "skills_imported": imported,
                        "skills_skipped": skipped,
                        "processed_at": datetime.utcnow().isoformat()
                    }
                )
            
            self.send_json(200, {
                "success": True,
                "result": {
                    "imported": imported,
                    "skipped": skipped,
                    "skills": results
                }
            })
            
        except Exception as e:
            if import_id:
                try:
                    supabase_request(
                        "PATCH",
                        f"/rest/v1/ai_skill_imports?id=eq.{import_id}",
                        {
                            "parse_status": "failed",
                            "error_message": str(e)
                        }
                    )
                except:
                    pass
            
            self.send_json(500, {"success": False, "error": str(e)})

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
