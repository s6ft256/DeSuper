from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
from datetime import datetime

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", os.getenv("VITE_OPENROUTER_API_KEY", ""))
SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", ""))
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Check Supabase connection
        supabase_status = "unknown"
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/",
                headers={
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
                }
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                supabase_status = "connected" if resp.status == 200 else f"error_{resp.status}"
        except Exception as e:
            supabase_status = f"error: {str(e)[:50]}"
        
        response = {
            "status": "ok",
            "service": "desuper-hybrid",
            "timestamp": datetime.utcnow().isoformat(),
            "model_loaded": bool(OPENROUTER_API_KEY),
            "model_source": "openrouter" if OPENROUTER_API_KEY else "none",
            "supabase": {
                "url_configured": bool(SUPABASE_URL),
                "anon_key_configured": bool(SUPABASE_ANON_KEY),
                "service_key_configured": bool(SUPABASE_SERVICE_KEY),
                "status": supabase_status
            }
        }
        
        self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
