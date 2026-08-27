from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import base64
import hashlib
import urllib.request
import urllib.error
from datetime import datetime

# PayPal configuration
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_WEBHOOK_ID = os.getenv("PAYPAL_WEBHOOK_ID", "")
PAYPAL_SANDBOX = os.getenv("PAYPAL_SANDBOX", "true").lower() == "true"

PAYPAL_BASE_URL = (
    "https://api-m.sandbox.paypal.com" if PAYPAL_SANDBOX 
    else "https://api-m.paypal.com"
)

SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("VITE_SUPABASE_URL", ""))
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", ""))
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))


def get_paypal_access_token():
    """Get OAuth2 access token from PayPal"""
    credentials = base64.b64encode(
        f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()
    ).decode()
    
    req = urllib.request.Request(
        f"{PAYPAL_BASE_URL}/v1/oauth2/token",
        data=b"grant_type=client_credentials",
        method="POST",
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data["access_token"]
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        raise Exception(f"PayPal auth error: {e.code} - {error_body}")


def paypal_api_call(method, path, data=None):
    """Make authenticated API call to PayPal"""
    token = get_paypal_access_token()
    
    url = f"{PAYPAL_BASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    
    req = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        raise Exception(f"PayPal API error: {e.code} - {error_body}")


def create_paypal_order(amount, currency="USD", description="DeSuper Subscription", custom_id=None):
    """Create a new PayPal order"""
    
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": currency,
                    "value": amount,
                },
                "description": description,
                "custom_id": custom_id or "",
            }
        ],
        "application_context": {
            "brand_name": "DeSuper",
            "landing_page": "LOGIN",
            "user_action": "PAY_NOW",
            "return_url": "https://de-super.vercel.app/payment/success",
            "cancel_url": "https://de-super.vercel.app/payment/cancel",
        }
    }
    
    return paypal_api_call("POST", "/v2/checkout/orders", order_data)


def capture_paypal_order(order_id):
    """Capture payment for an approved order"""
    return paypal_api_call("POST", f"/v2/checkout/orders/{order_id}/capture")


def get_paypal_order(order_id):
    """Get order details"""
    return paypal_api_call("GET", f"/v2/checkout/orders/{order_id}")


def verify_paypal_webhook(auth_algo, cert_url, transmission_id, transmission_sig, transmission_time, webhook_id, webhook_event):
    """Verify webhook signature from PayPal"""
    
    verification_data = {
        "auth_algo": auth_algo,
        "cert_url": cert_url,
        "transmission_id": transmission_id,
        "transmission_sig": transmission_sig,
        "transmission_time": transmission_time,
        "webhook_id": webhook_id,
        "webhook_event": webhook_event,
    }
    
    try:
        result = paypal_api_call("POST", "/v1/notifications/verify-webhook-signature", verification_data)
        return result.get("verification_status") == "SUCCESS"
    except Exception:
        return False


def supabase_request(method, path, data=None):
    """Make request to Supabase"""
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    url = f"{SUPABASE_URL}{path}"
    body = json.dumps(data).encode() if data else None
    
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode()) if resp.status != 204 else None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        raise Exception(f"Supabase error {e.code}: {error_body}")
