import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Check,
  X,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  Building2,
  HelpCircle,
  Clock,
  Target,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import GradientButton from "@/components/GradientButton";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import AppHeader from "@/components/AppHeader";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: "Free",
      description: "Perfect for trying out artori",
      price: { monthly: 0, annual: 0 },
      yearlyPrice: { monthly: 0, annual: 0 },
      features: [
        "5 practice questions per day",
        "Basic AI explanations",
        "Progress tracking",
        "1 exam type",
        "Community support",
        "Mobile app access",
      ],
      limits: {
        questions: "5/day",
        exams: "1 type",
        explanations: "Basic",
        support: "Community",
        analytics: "Basic",
        storage: "30 days",
      },
      cta: "Get started free",
      popular: false,
      gradient: "from-gray-400 to-gray-500",
      bgColor: "bg-gray-50",
    },
    {
      name: "Student",
      description: "Everything you need to ace your exam",
      price: { monthly: 19, annual: 15 },
      yearlyPrice: { monthly: 228, annual: 180 },
      features: [
        "Unlimited practice questions",
        "Advanced AI explanations with bias detection",
        "Personalized study recommendations",
        "All exam types (SAT, ENEM, A-levels, etc.)",
        "Detailed progress analytics",
        "Priority email support",
        "Study streak tracking",
        "Performance predictions",
        "Mobile app with offline mode",
        "Export progress reports",
      ],
      limits: {
        questions: "Unlimited",
        exams: "All types",
        explanations: "Advanced + Bias Detection",
        support: "Priority Email",
        analytics: "Detailed",
        storage: "Unlimited",
      },
      cta: "Start free trial",
      popular: true,
      gradient: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
    },
    {
      name: "Pro",
      description: "For serious students and tutors",
      price: { monthly: 39, annual: 31 },
      yearlyPrice: { monthly: 468, annual: 372 },
      features: [
        "Everything in Student",
        "AI-powered study schedule optimization",
        "Custom practice tests creation",
        "Performance predictions with confidence intervals",
        "Study group features and collaboration",
        "Expert tutor matching and booking",
        "Advanced analytics with insights",
        "Priority phone support",
        "Early access to new features",
        "API access for integrations",
        "White-label options",
        "Bulk question import",
      ],
      limits: {
        questions: "Unlimited",
        exams: "All types + Custom",
        explanations: "Advanced + Custom Context",
        support: "Priority Phone + Email",
        analytics: "Advanced + Predictions",
        storage: "Unlimited + Backup",
      },
      cta: "Start free trial",
      popular: false,
      gradient: "from-violet-500 to-pink-600",
      bgColor: "bg-violet-50",
    },
    {
      name: "Enterprise",
      description: "For schools and organizations",
      price: { monthly: "Custom", annual: "Custom" },
      yearlyPrice: { monthly: "Contact us", annual: "Contact us" },
      features: [
        "Everything in Pro",
        "Unlimited users and classes",
        "Advanced teacher dashboards",
        "Student progress monitoring",
        "Custom branding and white-labeling",
        "SSO and LDAP integration",
        "Advanced security and compliance",
        "Dedicated account manager",
        "Custom integrations and API",
        "On-premise deployment options",
        "24/7 priority support",
        "Training and onboarding",
        "Custom reporting and analytics",
        "Bulk user management",
      ],
      limits: {
        questions: "Unlimited",
        exams: "All + Custom Content",
        explanations: "Fully Customizable",
        support: "24/7 Dedicated",
        analytics: "Enterprise Dashboard",
        storage: "Unlimited + Compliance",
      },
      cta: "Contact sales",
      popular: false,
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const comparisonFeatures = [
    {
      category: "Core Features",
      features: [
        { name: "Practice Questions", free: "5/day", student: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "AI Explanations", free: "Basic", student: "Advanced", pro: "Advanced", enterprise: "Custom" },
        { name: "Bias Detection", free: false, student: true, pro: true, enterprise: true },
        { name: "Progress Tracking", free: true, student: true, pro: true, enterprise: true },
        { name: "Mobile App", free: true, student: true, pro: true, enterprise: true },
      ]
    },
    {
      category: "Learning Features",
      features: [
        { name: "Exam Types", free: "1", student: "All", pro: "All + Custom", enterprise: "Unlimited" },
        { name: "Study Recommendations", free: false, student: true, pro: true, enterprise: true },
        { name: "Performance Predictions", free: false, student: "Basic", pro: "Advanced", enterprise: "Custom" },
        { name: "Study Groups", free: false, student: false, pro: true, enterprise: true },
        { name: "Tutor Matching", free: false, student: false, pro: true, enterprise: true },
      ]
    },
    {
      category: "Analytics & Reporting",
      features: [
        { name: "Progress Analytics", free: "Basic", student: "Detailed", pro: "Advanced", enterprise: "Enterprise" },
        { name: "Export Reports", free: false, student: true, pro: true, enterprise: true },
        { name: "Teacher Dashboard", free: false, student: false, pro: false, enterprise: true },
        { name: "Class Management", free: false, student: false, pro: false, enterprise: true },
        { name: "Custom Reports", free: false, student: false, pro: false, enterprise: true },
      ]
    },
    {
      category: "Support & Integration",
      features: [
        { name: "Support", free: "Community", student: "Email", pro: "Phone + Email", enterprise: "24/7 Dedicated" },
        { name: "API Access", free: false, student: false, pro: true, enterprise: true },
        { name: "SSO Integration", free: false, student: false, pro: false, enterprise: true },
        { name: "Custom Branding", free: false, student: false, pro: "Limited", enterprise: "Full" },
        { name: "On-premise Deployment", free: false, student: false, pro: false, enterprise: true },
      ]
    }
  ];

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "All paid plans come with a 14-day free trial. No credit card required to start. You'll have full access to all features during the trial period."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "How does billing work for schools?",
      answer: "Schools can choose per-student pricing or unlimited access pricing. We offer volume discounts and flexible payment terms including purchase orders and invoicing."
    },
    {
      question: "Can I use artori offline?",
      answer: "The Pro and Enterprise plans include offline mode in our mobile apps, allowing you to practice questions and review explanations without an internet connection."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You can export all your data before canceling. We keep your data for 90 days after cancellation in case you want to reactivate your account."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students with a valid .edu email address get 50% off all plans. We also offer need-based scholarships for qualifying students."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "SAT Student",
      content: "The Student plan was worth every penny. I improved my score by 200 points and the detailed analytics helped me focus on my weak areas.",
      avatar: "👩‍🎓",
      plan: "Student Plan",
      score: "+200 points",
    },
    {
      name: "Dr. Martinez",
      role: "High School Principal",
      content: "The Enterprise plan transformed our test prep program. Teachers love the dashboards and our pass rates increased by 23%.",
      avatar: "👨‍🏫",
      plan: "Enterprise",
      score: "+23% pass rate",
    },
    {
      name: "Emma Thompson",
      role: "Private Tutor",
      content: "The Pro plan's tutor features and custom tests make my job so much easier. My students see faster improvement now.",
      avatar: "👩‍💼",
      plan: "Pro Plan",
      score: "5-star tutor",
    },
  ];

  const getPrice = (plan: typeof pricingPlans[0]) => {
    if (typeof plan.price.monthly === 'string') return plan.price.monthly;
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (typeof plan.price.monthly === 'string' || plan.price.monthly === 0) return null;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual * 12;
    const savings = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0 px-4 py-2 text-sm font-medium">
            💰 Transparent Pricing
          </Badge>

          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include our core responsible AI features 
            with transparent explanations and bias detection.
            <span className="font-semibold text-indigo-600">
              14-day free trial on all paid plans!
            </span>
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                Save up to 25%
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-indigo-500 scale-105'
                  : 'border border-white/30'
              } ${plan.bgColor}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {typeof getPrice(plan) === 'string' ? (
                      getPrice(plan)
                    ) : (
                      <>
                        ${getPrice(plan)}
                        <span className="text-lg font-normal text-gray-500">
                          /month
                        </span>
                      </>
                    )}
                  </div>
                  {isAnnual && getSavings(plan) && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {getSavings(plan)}% annually
                    </div>
                  )}
                  {typeof getPrice(plan) !== 'string' && getPrice(plan) > 0 && (
                    <div className="text-xs text-gray-500">
                      ${isAnnual ? plan.yearlyPrice.annual : plan.yearlyPrice.monthly} billed {isAnnual ? 'annually' : 'monthly'}
                    </div>
                  )}
                </div>

                <GradientButton
                  gradient={plan.gradient}
                  className="w-full text-sm py-2"
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      window.location.href = '/solutions';
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                >
                  {plan.cta}
                </GradientButton>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Usage Limits */}
                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">Usage Limits</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium">{plan.limits.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exams:</span>
                      <span className="font-medium">{plan.limits.exams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span className="font-medium">{plan.limits.support}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compare All Features
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Detailed breakdown of what's included in each plan
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <GlassmorphismCard padding="p-8">
            {comparisonFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8 last:mb-0">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  {category.category === 'Core Features' && <Target className="h-5 w-5 mr-2 text-indigo-500" />}
                  {category.category === 'Learning Features' && <BookOpen className="h-5 w-5 mr-2 text-purple-500" />}
                  {category.category === 'Analytics & Reporting' && <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />}
                  {category.category === 'Support & Integration' && <Users className="h-5 w-5 mr-2 text-green-500" />}
                  {category.category}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Feature</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Free</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Student</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Pro</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b border-white/10">
                          <td className="py-3 px-4 text-gray-600">{feature.name}</td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.free === 'boolean' ? (
                              feature.free ? (
                                <Check className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.free}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.student === 'boolean' ? (
                              feature.student ? (
                                <Check className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.student}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.pro === 'boolean' ? (
                              feature.pro ? (
                                <Check className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.pro}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.enterprise === 'boolean' ? (
                              feature.enterprise ? (
                                <Check className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </GlassmorphismCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <GlassmorphismCard padding="p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-indigo-500" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pl-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassmorphismCard>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Real feedback from students and educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs mb-1">
                      {testimonial.score}
                    </Badge>
                    <div className="text-xs text-gray-500">{testimonial.plan}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="container mx-auto px-4 py-16">
        <GlassmorphismCard padding="p-12">
          <div className="text-center mb-8">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-emerald-600" />
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Enterprise & Schools
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Custom solutions for educational institutions and organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
              <div className="space-y-3">
                {[
                  "Unlimited users and classes",
                  "Advanced teacher dashboards",
                  "Custom branding and white-labeling",
                  "SSO and LDAP integration",
                  "24/7 priority support",
                  "Custom integrations",
                  "On-premise deployment",
                  "Training and onboarding"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Perfect For</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">K-12</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">K-12 Schools</div>
                    <div className="text-sm text-gray-600">Comprehensive test prep programs</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">UNI</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Universities</div>
                    <div className="text-sm text-gray-600">Student success and retention programs</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">ORG</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Organizations</div>
                    <div className="text-sm text-gray-600">Employee training and certification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/solutions">
              <GradientButton
                size="lg"
                gradient="from-emerald-500 to-teal-600"
                className="text-lg px-8 py-4"
              >
                Contact Sales Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
          </div>
        </GlassmorphismCard>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using responsible AI to achieve their academic goals.
            <span className="font-semibold text-violet-600">
              Start your free trial today!
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <GradientButton
                size="lg"
                gradient="from-violet-500 to-pink-600"
                className="text-lg px-12 py-4"
              >
                🚀 Start Free Trial
              </GradientButton>
            </Link>
            <GradientButton
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-indigo-200 hover:bg-indigo-50"
            >
              💬 Talk to Sales
            </GradientButton>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;