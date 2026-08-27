import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentStatus } from './PaymentStatus';

interface PayPalButtonProps {
  planId: string;
  amount: string;
  currency?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalButton({
  planId,
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) {
  const { user } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [orderID, setOrderID] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'processing' | 'success' | 'error' | 'cancelled'>('idle');
  const buttonsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

  // Load PayPal SDK
  useEffect(() => {
    if (window.paypal || !clientId) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load PayPal SDK');
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clientId, currency]);

  // Create order on server
  const createOrder = useCallback(async (): Promise<string> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan_id: planId,
          amount: amount,
          currency: currency,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      return data.order_id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [planId, amount, currency, user?.id]);

  // Capture payment on server
  const onApprove = useCallback(async (data: any, actions: any) => {
    setPaymentStatus('processing');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          order_id: data.orderID,
          plan_id: planId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to capture payment');
      }

      const result = await response.json();
      
      if (result.success) {
        setPaymentStatus('success');
        onSuccess?.(result.details);
      } else {
        throw new Error(result.error || 'Payment capture failed');
      }
    } catch (err: any) {
      setError(err.message);
      setPaymentStatus('error');
      onError?.(err);
    }
  }, [planId, onSuccess, onError]);

  const onCancel = useCallback((data: any) => {
    setPaymentStatus('cancelled');
    onCancel?.();
  }, [onCancel]);

  const onErrorHandler = useCallback((err: any) => {
    console.error('PayPal error:', err);
    setError('Payment processing error. Please try again.');
    setPaymentStatus('error');
    onError?.(err);
  }, [onError]);

  // Render PayPal buttons
  useEffect(() => {
    if (!scriptLoaded || !window.paypal || !containerRef.current) return;

    // Clear previous buttons
    containerRef.current.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 45,
      },
      createOrder,
      onApprove,
      onCancel,
      onError: onErrorHandler,
    }).render(containerRef.current)
      .catch((err: any) => {
        console.error('PayPal render error:', err);
        setError('Failed to render PayPal buttons');
      });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scriptLoaded, createOrder, onApprove, onCancel, onErrorHandler]);

  if (!clientId) {
    return (
      <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-sm font-mono">
        PayPal is not configured. Please contact support.
      </div>
    );
  }

  return (
    <div className="paypal-button-container space-y-4">
      {error && (
        <PaymentStatus 
          status="error" 
          message={error}
        />
      )}

      {paymentStatus === 'success' && (
        <PaymentStatus 
          status="success" 
          message="Payment successful! Your subscription is now active."
        />
      )}

      {paymentStatus === 'cancelled' && (
        <PaymentStatus 
          status="cancelled" 
          message="Payment was cancelled. You can try again when ready."
        />
      )}

      {paymentStatus === 'processing' && (
        <PaymentStatus 
          status="processing" 
          message="Processing your payment..."
        />
      )}

      {/* PayPal button container */}
      <div ref={containerRef} className="min-h-[50px]" />

      {!scriptLoaded && !error && (
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-mono">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          Loading PayPal...
        </div>
      )}
    </div>
  );
}

// Import supabase for session access
import { supabase } from '../../lib/supabase';
