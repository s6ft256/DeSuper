from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

BASE_SYSTEM_PROMPT = """You are Eli-v0.1, an intelligent cyber companion and Python coding mentor in the game DeSuper by s6ft. You help players learn Python programming through interactive coding missions, debugging, and concept explanations. Be concise, encouraging, and educational. Use a futuristic cyber tone. Keep responses under 4 sentences unless asked for detail."""

def fetch_user_profile(auth_token):
    if not auth_token or not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return None
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": auth_token
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            user_data = json.loads(resp.read().decode())
            user_id = user_data.get("id")
            if not user_id or not SUPABASE_SERVICE_KEY:
                return None
        
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=*",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            return data[0] if data else None
    except Exception:
        return None

def build_system_prompt(user_profile, user_data):
    prompt = BASE_SYSTEM_PROMPT
    if user_profile or user_data:
        profile = user_profile or user_data or {}
        prompt += "\n\n--- PLAYER PROFILE ---\n"
        prompt += f"Name: {profile.get('display_name', profile.get('name', 'CyberOperative'))}\n"
        prompt += f"Level: {profile.get('level', 1)}\n"
        prompt += f"XP: {profile.get('xp', 0)}\n"
        prompt += f"Rank: {profile.get('rank', 'ZERO')}\n"
        prompt += f"Streak: {profile.get('streak', 1)} days\n"
        
        completed = profile.get('completed_missions', [])
        if completed:
            prompt += f"Completed Missions: {', '.join(completed[:10])}\n"
        
        skills = profile.get('unlocked_skills', [])
        if skills:
            prompt += f"Unlocked Skills: {', '.join(skills[:10])}\n"
        
        bosses = profile.get('defeated_bosses', [])
        if bosses:
            prompt += f"Defeated Bosses: {', '.join(bosses)}\n"
        
        projects = profile.get('completed_projects', [])
        if projects:
            prompt += f"Completed Projects: {', '.join(projects)}\n"
        
        stats = profile.get('stats', {})
        if stats:
            prompt += f"Stats: {json.dumps(stats)}\n"
        
        # Include imported skills
        imported_skills = profile.get('skills', [])
        if imported_skills:
            prompt += "\n--- USER SKILLS ---\n"
            for skill in imported_skills:
                name = skill.get('name', 'Unknown')
                level = skill.get('level', 5)
                category = skill.get('category', 'general')
                prompt += f"- {name} (Level {level}/10, {category})\n"
            prompt += "--- END SKILLS ---\n"
        
        prompt += "--- END PROFILE ---\n"
        prompt += "Use this player data to personalize your responses and give relevant advice."
    return prompt

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
            messages = data.get("messages", [])[-10:]
            model = data.get("model", OPENROUTER_MODEL)
            auth_token = data.get("auth", "")
            user_data = data.get("user_data", None)
        except (json.JSONDecodeError, KeyError):
            self.send_json(400, {"success": False, "error": "Invalid request"})
            return
        
        if not OPENROUTER_API_KEY:
            self.send_json(200, {
                "success": False,
                "error": "AI not configured",
                "message": "AI features are currently unavailable. Please try again later."
            })
            return
        
        user_profile = fetch_user_profile(auth_token)
        system_prompt = build_system_prompt(user_profile, user_data)
        all_messages = [{"role": "system", "content": system_prompt}] + messages
        
        try:
            payload = json.dumps({
                "model": model,
                "messages": all_messages,
                "max_tokens": 512,
                "temperature": 0.7,
                "top_p": 0.9
            }).encode()
            
            req = urllib.request.Request(
                f"{OPENROUTER_BASE}/chat/completions",
                data=payload,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://de-super.vercel.app",
                    "X-Title": "DeSuper"
                }
            )
            
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode())
                text = result["choices"][0]["message"]["content"].strip()
                self.send_json(200, {"success": True, "message": text})
                return
        except Exception as e:
            pass
        
        self.send_json(200, {
            "success": False,
            "error": "AI service error",
            "message": "The AI model is temporarily unavailable. Please try again."
        })

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
