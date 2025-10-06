import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Building2,
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
      features: [
        "5 practice questions per day",
        "Basic AI explanations",
        "Progress tracking",
        "1 exam type",
        "Community support",
      ],
      cta: "Get started free",
      popular: false,
      gradient: "from-gray-400 to-gray-500",
      isSchool: false,
    },
    {
      name: "Student",
      description: "Everything you need to ace your exam",
      price: { monthly: 19, annual: 15 },
      features: [
        "Unlimited practice questions",
        "Advanced AI explanations with bias detection",
        "Personalized study recommendations",
        "All exam types",
        "Detailed progress analytics",
        "Priority support",
      ],
      cta: "Start free trial",
      popular: true,
      gradient: "from-indigo-500 to-purple-600",
      isSchool: false,
    },
    {
      name: "Pro",
      description: "For serious students and tutors",
      price: { monthly: 39, annual: 31 },
      features: [
        "Everything in Student",
        "AI-powered study schedule",
        "Custom practice tests",
        "Performance predictions",
        "Study group features",
        "Expert tutor matching",
      ],
      cta: "Start free trial",
      popular: false,
      gradient: "from-violet-500 to-pink-600",
      isSchool: false,
    },
    {
      name: "For Schools",
      description: "Custom solutions for educational institutions",
      price: { monthly: "Custom", annual: "Custom" },
      features: [
        "Everything in Pro",
        "Unlimited students and teachers",
        "Advanced teacher dashboards",
        "Custom branding and white-labeling",
        "SSO and LDAP integration",
        "24/7 dedicated support",
      ],
      cta: "Explore solutions",
      popular: false,
      gradient: "from-emerald-500 to-teal-600",
      isSchool: true,
    },
  ];

  // Debug: Log the number of plans
  console.log("Number of pricing plans:", pricingPlans.length);
  console.log("Plans:", pricingPlans.map(p => p.name));

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

      {/* Debug Section - Remove this after testing */}
      <section className="container mx-auto px-4 py-4">
        <div className="text-center text-sm text-gray-500">
          Debug: Showing {pricingPlans.length} pricing plans
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        {/* First try: Simple flex layout */}
        <div className="flex flex-wrap justify-center gap-6 max-w-none mx-auto">
          {pricingPlans.map((plan, index) => {
            console.log(`Rendering plan ${index + 1}:`, plan.name);
            return (
              <Card
                key={`${plan.name}-${index}`}
                className={`w-full sm:w-80 lg:w-72 xl:w-80 relative backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-indigo-500 scale-105'
                    : 'border border-white/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.isSchool && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1">
                      <Building2 className="h-3 w-3 mr-1" />
                      For Institutions
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
                        <span className="text-2xl">Customizable</span>
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
                    {plan.isSchool && (
                      <div className="text-sm text-emerald-600 font-medium">
                        Tailored to your needs
                      </div>
                    )}
                  </div>

                  <GradientButton
                    gradient={plan.gradient}
                    className="w-full text-sm py-2"
                    onClick={() => {
                      if (plan.isSchool) {
                        window.location.href = '/solutions';
                      } else {
                        window.location.href = '/login';
                      }
                    }}
                  >
                    {plan.cta}
                    {plan.isSchool && <ArrowRight className="ml-2 h-4 w-4" />}
                  </GradientButton>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.isSchool && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs text-gray-500 text-center">
                        Custom pricing based on number of students and specific requirements
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alternative: Grid layout as backup */}
        <div className="hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={`grid-${plan.name}-${index}`} className="min-h-[500px] bg-red-100 p-4">
                <h3>{plan.name}</h3>
                <p>Plan {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Questions about pricing? We're here to help.
          </p>
          <GradientButton
            variant="outline"
            className="border-indigo-200 hover:bg-indigo-50"
          >
            💬 Contact Sales
          </GradientButton>
        </div>
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
            <Link to="/solutions">
              <GradientButton
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-indigo-200 hover:bg-indigo-50"
              >
                🏫 Explore School Solutions
              </GradientButton>
            </Link>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;