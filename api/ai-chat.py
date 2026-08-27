from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
OPENROUTER_BASE = "https://openrouter.ai/api/v1"

SYSTEM_PROMPT = """You are Eli-v0.1, an intelligent cyber companion and Python coding mentor in the game DeSuper by s6ft. You help players learn Python programming through interactive coding missions, debugging, and concept explanations. Be concise, encouraging, and educational. Use a futuristic cyber tone. Keep responses under 4 sentences unless asked for detail."""

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
            messages = data.get("messages", [])[-10:]
            model = data.get("model", OPENROUTER_MODEL)
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
        
        all_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        
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
