from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Import PayPal service functions
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from service import (
    create_paypal_order,
    supabase_request,
    PAYPAL_SANDBOX,
    PAYPAL_CLIENT_ID,
)

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))


def get_user_id_from_token(token):
    """Extract user ID from JWT token"""
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": token
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            user_data = json.loads(resp.read().decode())
            return user_data.get("id")
    except Exception as e:
        print(f"Auth error: {e}")
        return None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        # Validate required fields
        plan_id = data.get("plan_id")
        amount = data.get("amount")
        currency = data.get("currency", "USD")
        user_id = data.get("user_id")
        
        if not all([plan_id, amount, user_id]):
            self.send_json(400, {"error": "Missing required fields: plan_id, amount, user_id"})
            return
        
        try:
            # Create PayPal order
            custom_id = json.dumps({
                "user_id": user_id,
                "plan_id": plan_id,
            })
            
            order = create_paypal_order(
                amount=amount,
                currency=currency,
                description=f"DeSuper Plan: {plan_id}",
                custom_id=custom_id,
            )
            
            # Store pending transaction in database
            try:
                supabase_request(
                    "POST",
                    "/rest/v1/transactions",
                    {
                        "user_id": user_id,
                        "payment_method": "paypal",
                        "payment_id": order["id"],
                        "amount": float(amount),
                        "currency": currency,
                        "status": "pending",
                        "metadata": {
                            "plan_id": plan_id,
                            "order_status": order["status"],
                        }
                    }
                )
            except Exception as db_error:
                print(f"Warning: Could not store transaction: {db_error}")
            
            self.send_json(200, {
                "success": True,
                "order_id": order["id"],
                "status": order["status"],
                "links": order.get("links", []),
            })
            
        except Exception as e:
            self.send_json(500, {"error": f"Failed to create order: {str(e)}"})
    
    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
