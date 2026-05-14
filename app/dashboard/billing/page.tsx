'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle2, Crown, Zap, Star, CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 'PKR 0',
    period: '/month',
    current: true,
    features: ['3 CV downloads/month', '2 AI tool uses/month', 'All templates', 'Job tracker (5 jobs)'],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Pro',
    price: 'PKR 799',
    period: '/month',
    current: false,
    popular: true,
    features: ['Unlimited CV downloads', 'Unlimited AI tools', 'No watermarks', 'Unlimited job tracking', 'Priority support', 'ATS score checker'],
    cta: 'Upgrade to Pro',
    disabled: false,
  },
  {
    name: 'Premium',
    price: 'PKR 1,499',
    period: '/month',
    current: false,
    features: ['Everything in Pro', 'LinkedIn optimization', 'Interview prep AI', 'Team access (3 users)', 'WhatsApp support'],
    cta: 'Upgrade to Premium',
    disabled: false,
  },
];

const paymentMethods = [
  { name: 'JazzCash', icon: Smartphone, color: 'text-red-600 bg-red-50' },
  { name: 'EasyPaisa', icon: Smartphone, color: 'text-green-600 bg-green-50' },
  { name: 'Bank Card', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
  { name: 'Stripe', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
];

export default function BillingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h1 className="text-2xl font-bold">Plans & Billing</h1>
        </div>
        <p className="text-muted-foreground">Upgrade your plan to unlock unlimited features.</p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-xl border-2 p-6 flex flex-col relative ${plan.popular ? 'border-blue-600 shadow-md shadow-blue-100' : 'border-border'}`}>
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4">Most Popular</Badge>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="secondary" className="px-4">Current Plan</Badge>
              </div>
            )}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                {plan.popular && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              disabled={plan.disabled}
              className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''} ${plan.current ? 'cursor-default' : ''}`}
              variant={plan.popular ? 'default' : 'outline'}
            >
              {plan.disabled ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {plan.cta}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {plan.cta}
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-1">Accepted Payment Methods</h2>
        <p className="text-sm text-muted-foreground mb-4">Pay securely with your preferred method.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentMethods.map((m) => (
            <div key={m.name} className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-border`}>
              <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
                <m.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{m.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          For payment assistance, contact us at <span className="text-blue-600">support@cvbuilderpk.com</span>
        </p>
      </div>
    </div>
  );
}
