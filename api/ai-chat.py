from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
            messages = data.get("messages", [])[-10:]
        except (json.JSONDecodeError, KeyError):
            self.send_json(400, {"success": False, "error": "Invalid request"})
            return
        
        system_prompt = {
            "role": "system",
            "content": "You are Eli-v0.1, an intelligent cyber companion and Python coding mentor in the game DeSuper by s6ft. You help players learn Python programming through interactive coding missions, debugging, and concept explanations. Be concise, encouraging, and educational. Use a futuristic cyber tone."
        }
        
        all_messages = [system_prompt] + messages
        
        try:
            llm = self._load_model()
            if llm:
                output = llm.create_chat_completion(
                    messages=all_messages,
                    max_tokens=512,
                    temperature=0.7,
                    top_p=0.9,
                )
                text = output["choices"][0]["message"]["content"].strip()
                self.send_json(200, {"success": True, "message": text})
                return
        except Exception as e:
            pass
        
        self.send_json(200, {
            "success": False,
            "error": "AI model not available",
            "message": "The AI model is not currently deployed. Please use the standalone eli_ai.py script for AI features."
        })

    def _load_model(self):
        try:
            from llama_cpp import Llama
            model_path = os.getenv("MODEL_PATH", "Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf")
            if os.path.exists(model_path):
                return Llama(model_path=model_path, n_ctx=2048, n_threads=4, verbose=False)
        except ImportError:
            pass
        return None

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
