import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PayPalButton } from './PayPalButton';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  icon: 'sparkles' | 'zap' | 'crown';
}

const PLANS: PricingPlan[] = [
  {
    id: 'student',
    name: 'Student',
    price: '2.99',
    currency: 'USD',
    interval: 'month',
    icon: 'sparkles',
    features: [
      'Unlimited missions',
      'No advertisements',
      'Basic AI assistance',
      'Progress tracking',
      'Daily quests',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '7.99',
    currency: 'USD',
    interval: 'month',
    icon: 'zap',
    popular: true,
    features: [
      'Everything in Student',
      'Advanced AI companion',
      'Premium projects',
      'Certificates',
      'Boss battles',
      'Priority support',
    ],
  },
  {
    id: 'master',
    name: 'Master',
    price: '14.99',
    currency: 'USD',
    interval: 'month',
    icon: 'crown',
    features: [
      'Everything in Pro',
      '1-on-1 mentoring',
      'Custom learning paths',
      'Early access features',
      'Exclusive cosmetics',
      'Leaderboard priority',
    ],
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = (details: any) => {
    setPaymentSuccess(true);
    // Redirect or show success message
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black font-mono text-white">Payment Successful!</h2>
          <p className="text-slate-400 font-mono text-sm">
            Your subscription is now active. Start your coding adventure!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-emerald-300 font-mono font-bold cursor-pointer"
          >
            Continue to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white">
            Choose Your Plan
          </h1>
          <p className="text-slate-400 font-mono text-sm max-w-lg mx-auto">
            Unlock the full Python coding adventure. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-3xl border space-y-6 ${
                plan.popular
                  ? 'bg-slate-800 border-cyan-500/40 ring-2 ring-cyan-500/20'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 rounded-full text-xs font-mono font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {getIcon(plan.icon)}
                </div>
                <h3 className="text-xl font-black font-mono text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono text-white">${plan.price}</span>
                  <span className="text-slate-400 font-mono text-sm">/{plan.interval}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-mono text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action */}
              {selectedPlan === plan.id ? (
                <div className="space-y-4">
                  <PayPalButton
                    planId={plan.id}
                    amount={plan.price}
                    currency={plan.currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={handlePaymentCancel}
                  />
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full text-center text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-mono font-bold text-sm cursor-pointer transition-all ${
                    plan.popular
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
                  }`}
                >
                  Get {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-mono space-y-2">
          <p>Secure payments powered by PayPal</p>
          <p>Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  );
}
