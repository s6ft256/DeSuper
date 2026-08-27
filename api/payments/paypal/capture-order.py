from http.server import BaseHTTPRequestHandler
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from service import (
    capture_paypal_order,
    supabase_request,
)

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        order_id = data.get("order_id")
        plan_id = data.get("plan_id")
        
        if not order_id:
            self.send_json(400, {"error": "Missing order_id"})
            return
        
        try:
            # Capture the payment
            capture_result = capture_paypal_order(order_id)
            
            # Verify capture status
            status = capture_result.get("status")
            if status != "COMPLETED":
                self.send_json(400, {
                    "error": f"Payment not completed. Status: {status}",
                    "details": capture_result,
                })
                return
            
            # Extract payment details
            purchase_unit = capture_result.get("purchase_units", [{}])[0]
            capture = purchase_unit.get("payments", {}).get("captures", [{}])[0]
            
            # Extract custom data
            custom_id = purchase_unit.get("custom_id", "{}")
            try:
                custom_data = json.loads(custom_id)
                user_id = custom_data.get("user_id")
            except json.JSONDecodeError:
                user_id = None
            
            capture_id = capture.get("id")
            amount = capture.get("amount", {}).get("value")
            currency = capture.get("amount", {}).get("currency_code")
            
            # Update transaction status in database
            try:
                # Find and update the transaction
                existing = supabase_request(
                    "GET",
                    f"/rest/v1/transactions?payment_id=eq.{order_id}&select=id"
                )
                
                if existing:
                    supabase_request(
                        "PATCH",
                        f"/rest/v1/transactions?payment_id=eq.{order_id}",
                        {
                            "status": "completed",
                            "metadata": {
                                "plan_id": plan_id,
                                "capture_id": capture_id,
                                "capture_status": status,
                            }
                        }
                    )
                
                # Create or update subscription
                if user_id and plan_id:
                    supabase_request(
                        "POST",
                        "/rest/v1/subscriptions",
                        {
                            "user_id": user_id,
                            "plan_id": plan_id,
                            "payment_method": "paypal",
                            "payment_id": capture_id,
                            "status": "active",
                            "amount": float(amount) if amount else 0,
                            "currency": currency or "USD",
                        }
                    )
            except Exception as db_error:
                print(f"Warning: Could not update database: {db_error}")
            
            self.send_json(200, {
                "success": True,
                "order_id": order_id,
                "capture_id": capture_id,
                "status": status,
                "amount": amount,
                "currency": currency,
                "details": capture_result,
            })
            
        except Exception as e:
            self.send_json(500, {"error": f"Failed to capture payment: {str(e)}"})
    
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
