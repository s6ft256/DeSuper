from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", "https://vhipieatnyexggqllfqe.supabase.co"))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))

def get_user_id(token):
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": token if token.startswith("Bearer ") else f"Bearer {token}"
            }
        )
        with urllib.request.urlopen(req) as resp:
            user_data = json.loads(resp.read().decode())
            return user_data.get("id")
    except Exception as e:
        print(f"Auth error: {e}")
        return None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Get user profile"""
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
                    self.send_json(200, {"success": True, "profile": data[0]})
                else:
                    self.send_json(404, {"error": "Profile not found"})
        except Exception as e:
            self.send_json(503, {"error": "Database unavailable"})

    def do_PUT(self):
        """Update user profile"""
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
            data = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        # Build update payload with only allowed fields
        allowed_fields = [
            "display_name", "avatar", "suit_color", "helmet_style",
            "companion_skin", "theme_accent", "badge_title"
        ]
        
        payload = {}
        for field in allowed_fields:
            if field in data:
                payload[field] = data[field]
        
        if not payload:
            self.send_json(400, {"error": "No valid fields to update"})
            return
        
        payload["updated_at"] = datetime.utcnow().isoformat()
        
        try:
            data_json = json.dumps(payload).encode()
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}",
                data=data_json,
                method='PATCH',
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
            )
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode())
                self.send_json(200, {"success": True, "profile": result[0] if result else None})
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            self.send_json(500, {"error": "Failed to update profile", "details": error_body})
        except Exception as e:
            self.send_json(503, {"error": "Database unavailable"})

    def do_POST(self):
        """Upload avatar image (base64)"""
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
            data = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        avatar_data = data.get("avatar")
        if not avatar_data:
            self.send_json(400, {"error": "No avatar data provided"})
            return
        
        # Validate base64 image data
        if not avatar_data.startswith("data:image/"):
            self.send_json(400, {"error": "Invalid image format. Must be base64 data URI"})
            return
        
        # Update profile with avatar
        payload = {
            "avatar": avatar_data,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        try:
            data_json = json.dumps(payload).encode()
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}",
                data=data_json,
                method='PATCH',
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
            )
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode())
                self.send_json(200, {"success": True, "profile": result[0] if result else None})
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            self.send_json(500, {"error": "Failed to upload avatar", "details": error_body})
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
        self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
