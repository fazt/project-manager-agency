import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out ProjectManager',
    features: [
      '1 project',
      '2 clients',
      '100MB storage',
      'Basic features',
      'Email support',
    ],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    description: 'Great for small agencies',
    features: [
      '5 projects',
      '10 clients',
      '1GB storage',
      'Basic reports',
      'Priority email support',
    ],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'Best for growing agencies',
    features: [
      '20 projects',
      '50 clients',
      '5GB storage',
      'Advanced reports',
      'API access',
      'Integrations',
      'Priority support',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large agencies',
    features: [
      'Unlimited projects',
      'Unlimited clients',
      '20GB storage',
      'Custom reports',
      'API access',
      'All integrations',
      'Dedicated support',
      'Custom onboarding',
    ],
    cta: 'Contact sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Choose the plan that&apos;s right for your agency. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 ${
                  plan.popular
                    ? 'border-blue-600 ring-2 ring-blue-600'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`mt-8 block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I change plans later?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Is there a free trial?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, all paid plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) through Stripe.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
