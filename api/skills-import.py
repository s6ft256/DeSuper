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
    category_proficiency = 5
    seen_skills = set()  # Track duplicates
    
    for line in content.split('\n'):
        stripped = line.strip()
        indent = len(line) - len(line.lstrip())
        
        # Detect category headers (## Category Name)
        if stripped.startswith('## '):
            category_name = stripped[3:].strip().lower()
            current_category = category_name.replace(' ', '_')
            
            # Assign proficiency based on category depth/position
            if 'full_stack' in category_name or 'frontend' in category_name:
                category_proficiency = 7
            elif 'backend' in category_name or 'database' in category_name:
                category_proficiency = 6
            elif 'devops' in category_name or 'cloud' in category_name:
                category_proficiency = 5
            elif 'machine_learning' in category_name or 'ml' in category_name:
                category_proficiency = 6
            elif 'artificial_intelligence' in category_name or 'ai' in category_name:
                category_proficiency = 7
            elif 'software_engineering' in category_name:
                category_proficiency = 6
            else:
                category_proficiency = 5
            continue
        
        # Skip empty lines and headers
        if not stripped or stripped.startswith('#') or stripped.startswith('---'):
            continue
        
        # Skip YAML frontmatter
        if stripped.startswith('name:') or stripped.startswith('title:') or stripped.startswith('description:'):
            continue
        if stripped.startswith('keywords:') or stripped.startswith('tags:') or stripped.startswith('date:'):
            continue
        if stripped.startswith('- ') and ':' in stripped and stripped.index(':') < 20:
            # Could be a YAML list item, skip if it looks like metadata
            if any(stripped.lower().startswith(f'- {key}') for key in ['full stack', 'software engineering', 'machine learning', 'artificial intelligence', 'deep learning', 'llms', 'generative ai', 'devops', 'cloud computing', 'python', 'javascript', 'typescript', 'react', 'pytorch', 'tensorflow', 'system design', 'mlops']):
                continue
        
        # Skip lines that are just sub-category headers (ending with ":" and no other content)
        # These are like "- **Frameworks & Libraries**:"
        if stripped.startswith('- **') and stripped.endswith(':'):
            continue
        if stripped.startswith('- ') and stripped.endswith(':') and not ',' in stripped:
            continue
        
        # Parse skill entries - multiple formats supported
        skill_name = None
        level_text = None
        description = None
        
        # Sub-items (indented with 2+ spaces) are sub-skills
        is_subskill = indent >= 2
        
        # Try format: - **Skill Name** (Level): Description
        if stripped.startswith('- **') or stripped.startswith('* **'):
            match = re.match(r'[-*]\s*\*\*(.+?)\*\*\s*\((.+?)\):\s*(.*)', stripped)
            if match:
                skill_name = match.group(1).strip()
                level_text = match.group(2).strip().lower()
                description = match.group(3).strip()
            else:
                # Try format: - **Skill Name**: Description
                match = re.match(r'[-*]\s*\*\*(.+?)\*\*:\s*(.*)', stripped)
                if match:
                    skill_name = match.group(1).strip()
                    description = match.group(2).strip()
                    level_text = 'intermediate'
                else:
                    # Try format: - **Skill Name** (Level)
                    match = re.match(r'[-*]\s*\*\*(.+?)\*\*\s*\((.+?)\)', stripped)
                    if match:
                        skill_name = match.group(1).strip()
                        level_text = match.group(2).strip().lower()
                        description = ''
                    else:
                        # Try format: - **Skill Name**
                        match = re.match(r'[-*]\s*\*\*(.+?)\*\*', stripped)
                        if match:
                            skill_name = match.group(1).strip()
                            level_text = 'intermediate'
                            description = ''
        else:
            # Try format: - Skill Name: Description
            match = re.match(r'[-*]\s*(.+?):\s*(.*)', stripped)
            if match:
                skill_name = match.group(1).strip()
                description = match.group(2).strip()
                level_text = 'intermediate'
            else:
                # Try format: - Skill Name (Level) - but only if content looks like a level
                match = re.match(r'[-*]\s*(.+?)\s*\((.+?)\)\s*$', stripped)
                if match:
                    potential_name = match.group(1).strip()
                    potential_level = match.group(2).strip().lower()
                    # Check if the parenthetical is a level indicator or description
                    level_map = {
                        'beginner': 1, 'basic': 2, 'novice': 3,
                        'intermediate': 4, 'medium': 5, 'competent': 6,
                        'advanced': 7, 'expert': 8, 'master': 9, 'guru': 10
                    }
                    if potential_level in level_map:
                        skill_name = potential_name
                        level_text = potential_level
                        description = ''
                    elif ',' in potential_level and len(potential_level) > 20:
                        # It's a description like "SSR, SSG, RSC" - treat whole line as skill name
                        skill_name = stripped[2:].strip()
                        level_text = 'intermediate'
                        description = ''
                    else:
                        # It's a short description in parentheses
                        skill_name = potential_name
                        level_text = 'intermediate'
                        description = potential_level
                elif stripped.startswith('- ') or stripped.startswith('* '):
                    # Simple format: - Skill Name
                    skill_name = stripped[2:].strip()
                    level_text = 'intermediate'
                    description = ''
        
        if skill_name:
            level_map = {
                'beginner': 1, 'basic': 2, 'novice': 3,
                'intermediate': 4, 'medium': 5, 'competent': 6,
                'advanced': 7, 'expert': 8, 'master': 9, 'guru': 10
            }
            proficiency = level_map.get(level_text, category_proficiency)
            
            # Handle skill names with "/" separator (e.g., "React.js / Next.js")
            # Split into separate skills
            if ' / ' in skill_name:
                parts = [p.strip() for p in skill_name.split(' / ') if p.strip()]
                for part in parts:
                    # Clean up each part
                    name_clean_match = re.match(r'(.+?)\s*\((.+?)\)\s*$', part)
                    if name_clean_match:
                        potential_name = name_clean_match.group(1).strip()
                        potential_desc = name_clean_match.group(2).strip()
                        if potential_desc.lower() not in level_map:
                            part = potential_name
                            if not description:
                                description = potential_desc
                    
                    # Skip duplicates
                    skill_key = f"{part.lower()}_{current_category}"
                    if skill_key in seen_skills:
                        continue
                    seen_skills.add(skill_key)
                    
                    skills.append({
                        'skill_name': part,
                        'skill_category': current_category,
                        'proficiency_level': proficiency,
                        'description': description or '',
                        'source': 'import',
                        'is_subskill': is_subskill
                    })
                continue
            
            # Clean up skill name - remove trailing parentheses content if it's not a level
            # e.g., "JavaScript (ES6+)" -> "JavaScript", with "ES6+" as description
            name_clean_match = re.match(r'(.+?)\s*\((.+?)\)\s*$', skill_name)
            if name_clean_match:
                potential_name = name_clean_match.group(1).strip()
                potential_desc = name_clean_match.group(2).strip()
                # Only clean if the parenthetical is not a level indicator
                if potential_desc.lower() not in level_map:
                    skill_name = potential_name
                    if not description:
                        description = potential_desc
            
            # Handle comma-separated items in description (e.g., "HTML5, CSS3, JavaScript")
            # If description contains commas and items are short, split into sub-skills
            # Use heuristic: if average item length < 15 chars, it's likely a list
            # Skip if any item has unbalanced parentheses (likely a phrase, not a list)
            if description and ',' in description and len(description) < 100:
                items = [item.strip() for item in description.split(',') if item.strip()]
                avg_len = sum(len(item) for item in items) / len(items) if items else 0
                # Check if all items have balanced parentheses (like "JavaScript (ES6+)")
                all_balanced = all(item.count('(') == item.count(')') for item in items)
                if len(items) > 1 and avg_len < 15 and all_balanced:
                    # Add each item as a separate skill
                    for item in items:
                        # Clean up items like "React.js / Next.js (SSR, SSG, RSC)"
                        sub_items = re.split(r'\s*/\s*', item)
                        for sub_item in sub_items:
                            sub_item = sub_item.strip()
                            if not sub_item:
                                continue
                            # Extract level from parentheses if present
                            sub_level = level_text
                            sub_desc = ''
                            paren_match = re.match(r'(.+?)\s*\((.+?)\)\s*$', sub_item)
                            if paren_match:
                                potential_name = paren_match.group(1).strip()
                                potential_desc = paren_match.group(2).strip()
                                if potential_desc.lower() not in level_map:
                                    sub_item = potential_name
                                    sub_desc = potential_desc
                            
                            # Skip duplicates
                            skill_key = f"{sub_item.lower()}_{current_category}"
                            if skill_key in seen_skills:
                                continue
                            seen_skills.add(skill_key)
                            
                            skills.append({
                                'skill_name': sub_item,
                                'skill_category': current_category,
                                'proficiency_level': level_map.get(sub_level, category_proficiency),
                                'description': sub_desc,
                                'source': 'import',
                                'is_subskill': is_subskill
                            })
                    continue
            
            # Skip duplicates
            skill_key = f"{skill_name.lower()}_{current_category}"
            if skill_key in seen_skills:
                continue
            seen_skills.add(skill_key)
            
            skills.append({
                'skill_name': skill_name,
                'skill_category': current_category,
                'proficiency_level': proficiency,
                'description': description or '',
                'source': 'import',
                'is_subskill': is_subskill
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
    def do_GET(self):
        """Get user's skills"""
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            self.send_json(401, {"error": "Unauthorized"})
            return
        
        token = auth_header[7:]
        user_id = get_user_id(token)
        if not user_id:
            self.send_json(401, {"error": "Invalid token"})
            return
        
        try:
            skills = supabase_request(
                "GET",
                f"/rest/v1/ai_skills?user_id=eq.{user_id}&select=*&order=proficiency_level.desc",
                service_key=True
            )
            self.send_json(200, {"success": True, "skills": skills or []})
        except Exception as e:
            self.send_json(500, {"success": False, "error": str(e)})

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
                        result = supabase_request(
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
                        if result:
                            results.append({**skill, "status": "new"})
                            imported += 1
                        else:
                            results.append({**skill, "status": "error", "error": "Insert returned None"})
                            skipped += 1
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
