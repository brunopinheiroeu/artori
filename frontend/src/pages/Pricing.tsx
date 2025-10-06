import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Brain,
  ArrowLeft,
  Check,
  X,
  Star,
  Zap,
  Users,
  Shield,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out artori",
      price: { monthly: 0, annual: 0 },
      badge: null,
      features: [
        "5 practice questions per day",
        "Basic AI explanations",
        "Progress tracking",
        "1 exam type",
        "Community support",
      ],
      limitations: [
        "Limited question bank",
        "No detailed analytics",
        "No study recommendations",
        "No offline access",
      ],
      cta: "Get started free",
      popular: false,
    },
    {
      name: "Student",
      description: "Everything you need to ace your exam",
      price: { monthly: 19, annual: 15 },
      badge: "Most Popular",
      features: [
        "Unlimited practice questions",
        "Advanced AI explanations with bias detection",
        "Personalized study recommendations",
        "All exam types",
        "Detailed progress analytics",
        "Study streak tracking",
        "Offline question downloads",
        "Priority support",
        "Mobile app access",
      ],
      limitations: [],
      cta: "Start free trial",
      popular: true,
    },
    {
      name: "Pro",
      description: "For serious students and tutors",
      price: { monthly: 39, annual: 31 },
      badge: "Best Value",
      features: [
        "Everything in Student",
        "AI-powered study schedule",
        "Custom practice tests",
        "Performance predictions",
        "Weakness identification",
        "Study group features",
        "Expert tutor matching",
        "Advanced analytics dashboard",
        "API access for integrations",
        "White-label options",
      ],
      limitations: [],
      cta: "Start free trial",
      popular: false,
    },
    {
      name: "School",
      description: "For educational institutions",
      price: { monthly: "Custom", annual: "Custom" },
      badge: "Enterprise",
      features: [
        "Everything in Pro",
        "Unlimited student accounts",
        "Teacher dashboard",
        "Class management tools",
        "Bulk student progress reports",
        "Custom branding",
        "SSO integration",
        "Advanced admin controls",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      limitations: [],
      cta: "Contact sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I switch plans at any time?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.",
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students can get an additional 20% off any plan with a valid student email address (.edu domains).",
    },
    {
      question: "What's included in the School plan?",
      answer: "The School plan includes unlimited student accounts, teacher dashboards, class management, custom branding, and dedicated support. Contact us for custom pricing based on your institution's size.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security with end-to-end encryption. Your data is stored securely and never shared with third parties.",
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (typeof plan.price.monthly === "string") return plan.price.monthly;
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (typeof plan.price.monthly === "string") return null;
    if (plan.price.monthly === 0) return null;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual * 12;
    const savings = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">artori</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/solutions" className="text-gray-600 hover:text-gray-900 transition-colors">
                For Schools
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link to="/pricing" className="text-gray-900 font-medium">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  Get started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-gray-100 text-gray-700 border-0 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Simple, transparent pricing
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Choose the perfect plan for your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              study journey
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core AI features 
            with transparent explanations and bias detection.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-gray-900' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                Save up to 25%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? 'border-2 border-gray-900 shadow-lg'
                    : 'border border-gray-200'
                } hover:shadow-md transition-all duration-200`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${
                      plan.popular 
                        ? 'bg-gray-900 text-white' 
                        : plan.name === 'Pro'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    } border-0 px-3 py-1`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    {typeof getPrice(plan) === 'string' ? (
                      <div className="text-3xl font-bold text-gray-900">
                        {getPrice(plan)}
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-gray-900">
                          ${getPrice(plan)}
                          <span className="text-lg font-normal text-gray-500">
                            /{isAnnual ? 'month' : 'month'}
                          </span>
                        </div>
                        {isAnnual && getSavings(plan) && (
                          <div className="text-sm text-green-600 font-medium">
                            Save {getSavings(plan)}% annually
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                    }`}
                    onClick={() => window.location.href = '/login'}
                  >
                    {plan.cta}
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 text-sm">What's included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-medium text-gray-900 text-sm mt-4">Not included:</h4>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start space-x-3">
                            <X className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why students choose artori
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides transparent, ethical learning support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Explainable AI</h3>
              <p className="text-gray-600">
                Every answer comes with step-by-step reasoning, sources, and bias detection
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                AI adapts to your learning style and identifies knowledge gaps
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ethical & Transparent</h3>
              <p className="text-gray-600">
                Built to enhance learning, not replace critical thinking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-gray-900 hover:text-gray-700">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to start studying smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using responsible AI to achieve their academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Start free trial
              </Button>
            </Link>
            <Link to="/solutions">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
                For schools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;