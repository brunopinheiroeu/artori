import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Target,
  Users,
  Shield,
  BookOpen,
  TrendingUp,
  Search,
  Check,
  Star,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import GradientButton from "@/components/GradientButton";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import ExamCard from "@/components/ExamCard";
import FeatureCard from "@/components/FeatureCard";
import AppHeader from "@/components/AppHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [examFilter, setExamFilter] = useState("");
  const [isAnnual, setIsAnnual] = useState(true);

  // Define which exams are supported in the database
  const supportedExams = ["SAT", "ENEM", "Leaving Certificate", "Selectividad"];

  const examTypes = [
    {
      name: "SAT",
      country: "USA",
      description: t("landing.exams.sat"),
      gradient: "from-blue-500 to-red-500",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      flag: "🇺🇸",
      isSupported: true,
    },
    {
      name: "ENEM",
      country: "Brazil",
      description: t("landing.exams.enem"),
      gradient: "from-green-400 to-yellow-400",
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      flag: "🇧🇷",
      isSupported: true,
    },
    {
      name: "Leaving Certificate",
      country: "Ireland",
      description: t("landing.exams.leavingCertificate"),
      gradient: "from-green-600 to-orange-500",
      borderColor: "border-green-600",
      bgColor: "bg-green-50",
      flag: "🇮🇪",
      isSupported: true,
    },
    {
      name: "Selectividad",
      country: "Spain",
      description: t("landing.exams.selectividad"),
      gradient: "from-red-600 to-yellow-500",
      borderColor: "border-red-600",
      bgColor: "bg-red-50",
      flag: "🇪🇸",
      isSupported: true,
    },
    {
      name: "A-levels",
      country: "UK",
      description: t("landing.exams.aLevels"),
      gradient: "from-red-500 to-blue-600",
      borderColor: "border-red-500",
      bgColor: "bg-red-50",
      flag: "🇬🇧",
      isSupported: false,
    },
    {
      name: "Abitur",
      country: "Germany",
      description: t("landing.exams.abitur"),
      gradient: "from-yellow-400 to-red-500",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-50",
      flag: "🇩🇪",
      isSupported: false,
    },
    {
      name: "IB",
      country: "International",
      description: t("landing.exams.ib"),
      gradient: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      flag: "🌍",
      isSupported: false,
    },
    {
      name: "BAC",
      country: "France",
      description: t("landing.exams.bac"),
      gradient: "from-blue-600 to-red-600",
      borderColor: "border-blue-600",
      bgColor: "bg-blue-50",
      flag: "🇫🇷",
      isSupported: false,
    },
  ];

  const features = [
    {
      icon: Brain,
      title: t("landing.features.explainableAi"),
      description: t("landing.features.explainableAiDescription"),
      gradient: "from-purple-400 to-pink-400",
      bgColor: "bg-purple-50",
    },
    {
      icon: Target,
      title: t("landing.features.adaptiveLearning"),
      description: t("landing.features.adaptiveLearningDescription"),
      gradient: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: t("landing.features.biasDetection"),
      description: t("landing.features.biasDetectionDescription"),
      gradient: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: t("landing.features.teacherCollaboration"),
      description: t("landing.features.teacherCollaborationDescription"),
      gradient: "from-orange-400 to-red-400",
      bgColor: "bg-orange-50",
    },
    {
      icon: BookOpen,
      title: t("landing.features.reflectionActivities"),
      description: t("landing.features.reflectionActivitiesDescription"),
      gradient: "from-indigo-400 to-purple-400",
      bgColor: "bg-indigo-50",
    },
    {
      icon: TrendingUp,
      title: t("landing.features.studyJourneys"),
      description: t("landing.features.studyJourneysDescription"),
      gradient: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50",
    },
  ];

  const pricingPlans = [
    {
      name: t("pricing.plans.free.name"),
      description: t("pricing.plans.free.description"),
      price: { monthly: 0, annual: 0 },
      features: [
        t("pricing.plans.free.features.practiceQuestions"),
        t("pricing.plans.free.features.basicExplanations"),
        t("pricing.plans.free.features.progressTracking"),
        t("pricing.plans.free.features.oneExamType"),
        t("pricing.plans.free.features.communitySupport"),
      ],
      cta: t("pricing.plans.free.cta"),
      popular: false,
      gradient: "from-gray-400 to-gray-500",
      isSchool: false,
    },
    {
      name: t("pricing.plans.student.name"),
      description: t("pricing.plans.student.description"),
      price: { monthly: 19, annual: 15 },
      features: [
        t("pricing.plans.student.features.unlimitedQuestions"),
        t("pricing.plans.student.features.advancedExplanations"),
        t("pricing.plans.student.features.personalizedRecommendations"),
        t("pricing.plans.student.features.allExamTypes"),
        t("pricing.plans.student.features.detailedAnalytics"),
        t("pricing.plans.student.features.prioritySupport"),
      ],
      cta: t("pricing.plans.student.cta"),
      popular: true,
      gradient: "from-indigo-500 to-purple-600",
      isSchool: false,
    },
    {
      name: t("pricing.plans.pro.name"),
      description: t("pricing.plans.pro.description"),
      price: { monthly: 39, annual: 31 },
      features: [
        t("pricing.plans.pro.features.everythingInStudent"),
        t("pricing.plans.pro.features.aiStudySchedule"),
        t("pricing.plans.pro.features.customTests"),
        t("pricing.plans.pro.features.performancePredictions"),
        t("pricing.plans.pro.features.studyGroupFeatures"),
        t("pricing.plans.pro.features.expertTutorMatching"),
      ],
      cta: t("pricing.plans.pro.cta"),
      popular: false,
      gradient: "from-violet-500 to-pink-600",
      isSchool: false,
    },
    {
      name: t("pricing.plans.school.name"),
      description: t("pricing.plans.school.description"),
      price: { monthly: t("pricing.custom"), annual: t("pricing.custom") },
      features: [
        t("pricing.plans.school.features.everythingInPro"),
        t("pricing.plans.school.features.unlimitedUsers"),
        t("pricing.plans.school.features.advancedDashboards"),
        t("pricing.plans.school.features.customBranding"),
        t("pricing.plans.school.features.ssoIntegration"),
        t("pricing.plans.school.features.dedicatedSupport"),
      ],
      cta: t("pricing.plans.school.cta"),
      popular: false,
      gradient: "from-emerald-500 to-teal-600",
      isSchool: true,
    },
  ];

  const testimonials = [
    {
      name: t("landing.testimonials.sarahChen"),
      role: t("landing.testimonials.satStudent"),
      content: t("landing.testimonials.sarahTestimonial"),
      avatar: "👩‍🎓",
      score: t("landing.testimonials.sarahScore"),
    },
    {
      name: t("landing.testimonials.miguelSantos"),
      role: t("landing.testimonials.enemStudent"),
      content: t("landing.testimonials.miguelTestimonial"),
      avatar: "👨‍🎓",
      score: t("landing.testimonials.miguelScore"),
    },
    {
      name: t("landing.testimonials.emmaThompson"),
      role: t("landing.testimonials.aLevelStudent"),
      content: t("landing.testimonials.emmaTestimonial"),
      avatar: "👩‍💼",
      score: t("landing.testimonials.emmaScore"),
    },
  ];

  const filteredExams = examTypes.filter(
    (exam) =>
      exam.name.toLowerCase().includes(examFilter.toLowerCase()) ||
      exam.country.toLowerCase().includes(examFilter.toLowerCase())
  );

  const getPrice = (plan: (typeof pricingPlans)[0]) => {
    if (typeof plan.price.monthly === "string") return plan.price.monthly;
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: (typeof pricingPlans)[0]) => {
    if (typeof plan.price.monthly === "string" || plan.price.monthly === 0)
      return null;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost =
      (typeof plan.price.annual === "number" ? plan.price.annual : 0) * 12;
    const savings = Math.round(
      ((monthlyCost - annualCost) / monthlyCost) * 100
    );
    return savings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
            {t("landing.hero.aiPoweredExamPrep")}
          </Badge>

          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("landing.hero.yourAiStudyCompanion")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("landing.hero.heroDescription")}
            <span className="font-semibold text-indigo-600">
              {t("landing.hero.joinStudents")}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <GradientButton
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4"
              >
                {t("landing.hero.startPracticingFree")}
              </GradientButton>
            </Link>
            <GradientButton
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-4"
            >
              {t("landing.hero.learnMore")}
            </GradientButton>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Badge className="bg-white/50 text-gray-700 border-white/20 backdrop-blur-sm">
            <span className="text-green-500 mr-2">🔒</span>
            {t("landing.trustBadges.soc2Compliant")}
          </Badge>
          <Badge className="bg-white/50 text-gray-700 border-white/20 backdrop-blur-sm">
            <span className="text-blue-500 mr-2">🛡️</span>
            {t("landing.trustBadges.gdprReady")}
          </Badge>
          <Badge className="bg-white/50 text-gray-700 border-white/20 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            {t("landing.trustBadges.studentRating")}
          </Badge>
          <Badge className="bg-white/50 text-gray-700 border-white/20 backdrop-blur-sm">
            <span className="text-orange-500 mr-2">🏆</span>
            {t("landing.trustBadges.edtechAward")}
          </Badge>
        </div>
      </section>

      {/* Exam Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("landing.exams.supportedExams")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {t("landing.exams.practiceForExam")}
          </p>

          {/* Search Filter */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("landing.exams.searchExamsCountries")}
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.name}
              name={exam.name}
              country={exam.country}
              description={exam.description}
              flag={exam.flag}
              gradient={exam.gradient}
              borderColor={exam.borderColor}
              bgColor={exam.bgColor}
              buttonText={
                exam.isSupported
                  ? t("landing.exams.startPracticing")
                  : t("landing.exams.comingSoon")
              }
              onSelect={exam.isSupported ? () => navigate("/login") : () => {}}
            />
          ))}

          {/* More Exams Card */}
          <ExamCard
            name={t("landing.exams.moreExams")}
            country={t("landing.exams.comingSoon")}
            description={t("landing.exams.requestExamType")}
            flag="➕"
            gradient="from-gray-400 to-gray-500"
            borderColor="border-gray-300"
            bgColor="bg-white/40"
            buttonText={t("landing.exams.requestExam")}
            onSelect={() => {}}
          />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("landing.features.responsibleAiFeatures")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t("landing.features.builtForStudents")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {t("pricing.title")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">{t("pricing.subtitle")}</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-sm ${
                !isAnnual ? "text-indigo-600 font-medium" : "text-gray-500"
              }`}
            >
              {t("pricing.billing.monthly")}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                isAnnual ? "text-indigo-600 font-medium" : "text-gray-500"
              }`}
            >
              {t("pricing.billing.annual")}
            </span>
            {isAnnual && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                {t("pricing.billing.saveUpTo")}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                plan.popular
                  ? "border-2 border-indigo-500 scale-105"
                  : plan.isSchool
                  ? "border-2 border-emerald-500"
                  : "border border-white/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-3 py-1">
                    {t("pricing.mostPopular")}
                  </Badge>
                </div>
              )}

              {plan.isSchool && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1">
                    <Building2 className="h-3 w-3 mr-1" />
                    {t("pricing.forInstitutions")}
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
                  <div className="text-5xl font-bold text-gray-800 mb-2">
                    {typeof getPrice(plan) === "string" ? (
                      <span className="text-2xl">{t("pricing.custom")}</span>
                    ) : (
                      <>
                        ${getPrice(plan)}
                        <span className="text-lg font-normal text-gray-500">
                          {t("pricing.perMonth")}
                        </span>
                      </>
                    )}
                  </div>
                  {isAnnual && getSavings(plan) && (
                    <div className="text-sm text-green-600 font-medium">
                      {t("pricing.billing.saveAnnually", {
                        percentage: getSavings(plan),
                      })}
                    </div>
                  )}
                  {plan.isSchool && (
                    <div className="text-sm text-emerald-600 font-medium">
                      {t("pricing.tailoredToNeeds")}
                    </div>
                  )}
                </div>

                <GradientButton
                  gradient={plan.gradient}
                  className="w-full text-lg py-3"
                  onClick={() => {
                    if (plan.isSchool) {
                      navigate("/solutions");
                    } else {
                      navigate("/login");
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
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.isSchool && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs text-gray-500 text-center">
                      {t("pricing.customPricingNote")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">{t("pricing.needMoreFeatures")}</p>
          <Link to="/solutions">
            <GradientButton
              variant="outline"
              className="border-indigo-200 hover:bg-indigo-50"
            >
              {t("pricing.contactSales")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t("landing.newsletter.stayUpdated")}
                </span>
              </h3>
              <p className="text-gray-600">
                {t("landing.newsletter.getLatestUpdates")}
              </p>
            </div>
            <div className="flex space-x-3">
              <Input
                type="email"
                placeholder={t("landing.newsletter.enterEmail")}
                className="flex-1 bg-white/50 backdrop-blur-sm border-white/20"
              />
              <GradientButton className="px-6 py-2">
                {t("landing.newsletter.subscribe")}
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t("landing.testimonials.lovedByStudents")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t("landing.testimonials.seeHowArtori")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all"
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                    {testimonial.score}
                  </Badge>
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

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <GlassmorphismCard className="text-center" padding="p-12">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("landing.stats.trustedByStudents")}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">
                {t("landing.stats.activeStudents")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">
                {t("landing.stats.questionsAnswered")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">95%</div>
              <div className="text-gray-600">
                {t("landing.stats.satisfactionRate")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                200+
              </div>
              <div className="text-gray-600">
                {t("landing.stats.partnerSchools")}
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              {t("landing.cta.readyToTransform")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("landing.cta.joinThousands")}
            <span className="font-semibold text-violet-600">
              {t("landing.cta.startFreeToday")}
            </span>
          </p>
          <Link to="/login">
            <GradientButton
              size="lg"
              gradient="from-violet-500 to-pink-600"
              className="text-lg px-12 py-4"
            >
              {t("landing.cta.startFreePractice")}
            </GradientButton>
          </Link>
        </GlassmorphismCard>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
