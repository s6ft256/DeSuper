from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://izggdjegvyqoddflqfxp.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

def get_user_id(token):
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {token}"
            }
        )
        with urllib.request.urlopen(req) as resp:
            user_data = json.loads(resp.read().decode())
            return user_data["id"]
    except Exception:
        return None

def map_to_schema(data, user_id):
    return {
        "id": user_id,
        "display_name": data.get("display_name", data.get("name", "CyberOperative")),
        "avatar": data.get("avatar", "cyber_ninja"),
        "suit_color": data.get("suit_color", "#06b6d4"),
        "helmet_style": data.get("helmet_style", "visor_alpha"),
        "companion_skin": data.get("companion_skin", "aura_cyan"),
        "theme_accent": data.get("theme_accent", "cyan"),
        "badge_title": data.get("badge_title", "REBOOT OPERATIVE"),
        "level": data.get("level", 1),
        "xp": data.get("xp", 0),
        "coins": data.get("coins", 100),
        "rank": data.get("rank", "ZERO"),
        "streak": data.get("streak", 1),
        "completed_missions": data.get("completed_missions", data.get("completedMissions", [])),
        "unlocked_skills": data.get("unlocked_skills", data.get("unlockedSkills", ["py_print"])),
        "defeated_bosses": data.get("defeated_bosses", data.get("defeatedBosses", [])),
        "completed_projects": data.get("completed_projects", data.get("completedProjects", [])),
        "stats": data.get("stats", {
            "codeExecutions": 0,
            "errorsEncountered": 0,
            "bugsPatched": 0,
            "hintsUsed": 0,
            "totalLinesWritten": 0
        }),
        "sound_enabled": data.get("sound_enabled", data.get("soundEnabled", True)),
        "haptics_enabled": data.get("haptics_enabled", data.get("hapticsEnabled", True)),
        "last_played_date": data.get("last_played_date", data.get("lastPlayedDate", datetime.utcnow().isoformat().split("T")[0])),
        "updated_at": datetime.utcnow().isoformat()
    }

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
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
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=*",
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                if data:
                    self.send_json(200, data[0])
                else:
                    self.send_json(404, {"error": "Profile not found"})
        except Exception as e:
            self.send_json(503, {"error": "Database unavailable"})

    def do_POST(self):
        auth_header = self.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            self.send_json(401, {"error": "Unauthorized"})
            return
        
        token = auth_header[7:]
        user_id = get_user_id(token)
        
        if not user_id:
            self.send_json(401, {"error": "Invalid token"})
            return
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            state = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        payload = map_to_schema(state, user_id)
        
        try:
            data = json.dumps(payload).encode()
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}",
                data=data,
                method='POST',
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "resolution=merge-duplicates"
                }
            )
            with urllib.request.urlopen(req) as resp:
                self.send_json(200, {"success": True, "message": "Game state saved"})
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            self.send_json(500, {"error": "Failed to save", "details": error_body})
        except Exception as e:
            self.send_json(503, {"error": "Database unavailable"})

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
