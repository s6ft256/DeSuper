from http.server import BaseHTTPRequestHandler
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from service import (
    verify_paypal_webhook,
    supabase_request,
    PAYPAL_WEBHOOK_ID,
)


def is_event_processed(event_id):
    """Check if webhook event has already been processed"""
    try:
        result = supabase_request(
            "GET",
            f"/rest/v1/webhook_events?event_id=eq.{event_id}"
        )
        return len(result) > 0 if result else False
    except Exception:
        return False


def mark_event_processed(event_id, event_type, data):
    """Mark webhook event as processed"""
    try:
        supabase_request(
            "POST",
            "/rest/v1/webhook_events",
            {
                "event_id": event_id,
                "event_type": event_type,
                "data": data,
            }
        )
    except Exception as e:
        print(f"Warning: Could not mark event as processed: {e}")


def handle_payment_capture_completed(resource):
    """Handle successful payment capture"""
    purchase_unit = resource.get("purchase_units", [{}])[0]
    custom_id = purchase_unit.get("custom_id", "{}")
    
    try:
        custom_data = json.loads(custom_id)
        user_id = custom_data.get("user_id")
        plan_id = custom_data.get("plan_id")
    except json.JSONDecodeError:
        user_id = None
        plan_id = None
    
    capture_id = resource.get("id")
    amount = resource.get("amount", {}).get("value")
    
    # Update transaction status
    try:
        order_id = purchase_unit.get("reference_id")
        if order_id:
            supabase_request(
                "PATCH",
                f"/rest/v1/transactions?payment_id=eq.{order_id}",
                {
                    "status": "completed",
                    "metadata": {
                        "plan_id": plan_id,
                        "capture_id": capture_id,
                        "webhook_confirmed": True,
                    }
                }
            )
    except Exception as e:
        print(f"Warning: Could not update transaction: {e}")
    
    print(f"Payment completed via webhook: {capture_id} for user {user_id}")


def handle_payment_capture_denied(resource):
    """Handle denied payment"""
    capture_id = resource.get("id")
    print(f"Payment denied via webhook: {capture_id}")


def handle_billing_subscription_activated(resource):
    """Handle subscription activation"""
    subscription_id = resource.get("id")
    custom_id = resource.get("custom_id")
    
    try:
        supabase_request(
            "PATCH",
            f"/rest/v1/subscriptions?payment_id=eq.{subscription_id}",
            {
                "status": "active",
                "payment_id": subscription_id,
            }
        )
    except Exception as e:
        print(f"Warning: Could not update subscription: {e}")
    
    print(f"Subscription activated via webhook: {subscription_id}")


def handle_billing_subscription_cancelled(resource):
    """Handle subscription cancellation"""
    subscription_id = resource.get("id")
    
    try:
        supabase_request(
            "PATCH",
            f"/rest/v1/subscriptions?payment_id=eq.{subscription_id}",
            {
                "status": "cancelled",
            }
        )
    except Exception as e:
        print(f"Warning: Could not update subscription: {e}")
    
    print(f"Subscription cancelled via webhook: {subscription_id}")


def handle_billing_subscription_payment_failed(resource):
    """Handle failed subscription payment"""
    subscription_id = resource.get("id")
    print(f"Subscription payment failed via webhook: {subscription_id}")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        # Get webhook verification headers
        auth_algo = self.headers.get('PAYPAL-AUTH-ALGO', '')
        cert_url = self.headers.get('PAYPAL-CERT-URL', '')
        transmission_id = self.headers.get('PAYPAL-TRANSMISSION-ID', '')
        transmission_sig = self.headers.get('PAYPAL-TRANSMISSION-SIG', '')
        transmission_time = self.headers.get('PAYPAL-TRANSMISSION-TIME', '')
        
        try:
            webhook_event = json.loads(body.decode())
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return
        
        event_id = webhook_event.get("id")
        event_type = webhook_event.get("event_type")
        resource = webhook_event.get("resource", {})
        
        # Check idempotency
        if is_event_processed(event_id):
            self.send_json(200, {"success": True, "message": "Event already processed"})
            return
        
        # Verify webhook signature
        is_valid = verify_paypal_webhook(
            auth_algo=auth_algo,
            cert_url=cert_url,
            transmission_id=transmission_id,
            transmission_sig=transmission_sig,
            transmission_time=transmission_time,
            webhook_id=PAYPAL_WEBHOOK_ID,
            webhook_event=webhook_event,
        )
        
        if not is_valid:
            self.send_json(401, {"error": "Invalid webhook signature"})
            return
        
        # Process webhook event
        try:
            if event_type == "PAYMENT.CAPTURE.COMPLETED":
                handle_payment_capture_completed(resource)
            elif event_type == "PAYMENT.CAPTURE.DENIED":
                handle_payment_capture_denied(resource)
            elif event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
                handle_billing_subscription_activated(resource)
            elif event_type == "BILLING.SUBSCRIPTION.CANCELLED":
                handle_billing_subscription_cancelled(resource)
            elif event_type == "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
                handle_billing_subscription_payment_failed(resource)
            else:
                print(f"Unhandled webhook event: {event_type}")
            
            # Mark event as processed
            mark_event_processed(event_id, event_type, webhook_event)
            
            self.send_json(200, {"success": True})
            
        except Exception as e:
            # Log error but return 200 to prevent PayPal retries
            print(f"Error processing webhook: {e}")
            self.send_json(200, {"success": False, "error": str(e)})
    
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
