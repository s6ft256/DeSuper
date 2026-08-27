import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentStatusProps {
  status: 'pending' | 'processing' | 'success' | 'error' | 'cancelled';
  message?: string;
}

export function PaymentStatus({ status, message }: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Loader2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/40',
      text: 'Waiting for payment...',
    },
    processing: {
      icon: Loader2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/40',
      text: 'Processing payment...',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      text: 'Payment successful!',
    },
    error: {
      icon: XCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-500/40',
      text: 'Payment failed',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-500/40',
      text: 'Payment cancelled',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center gap-3`}>
      <Icon className={`w-5 h-5 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`} />
      <div>
        <p className={`text-sm font-mono font-bold ${config.color}`}>
          {config.text}
        </p>
        {message && (
          <p className="text-xs text-slate-400 font-mono mt-1">{message}</p>
        )}
      </div>
    </div>
  );
}
