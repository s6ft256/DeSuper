from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://izggdjegvyqoddflqfxp.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        auth_header = self.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            self.send_error(401, 'Unauthorized')
            return
        
        token = auth_header[7:]
        
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": os.getenv("SUPABASE_ANON_KEY", ""),
                    "Authorization": f"Bearer {token}"
                }
            )
            with urllib.request.urlopen(req) as resp:
                user_data = json.loads(resp.read().decode())
                user_id = user_data["id"]
        except Exception:
            self.send_error(401, 'Invalid token')
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
            self.send_error(401, 'Unauthorized')
            return
        
        token = auth_header[7:]
        
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": os.getenv("SUPABASE_ANON_KEY", ""),
                    "Authorization": f"Bearer {token}"
                }
            )
            with urllib.request.urlopen(req) as resp:
                user_data = json.loads(resp.read().decode())
                user_id = user_data["id"]
        except Exception:
            self.send_error(401, 'Invalid token')
            return
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            state = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return
        
        state["id"] = user_id
        state["updated_at"] = datetime.utcnow().isoformat()
        
        try:
            data = json.dumps(state).encode()
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
            self.send_json(500, {"error": "Failed to save"})
        except Exception:
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
