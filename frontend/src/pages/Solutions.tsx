import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Users,
  BarChart3,
  Shield,
  BookOpen,
  Target,
  CheckCircle,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Play,
  Monitor,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Solutions = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BarChart3,
      title: t("solutions.features.items.dashboards.title"),
      description: t("solutions.features.items.dashboards.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: t("solutions.features.items.management.title"),
      description: t("solutions.features.items.management.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageSquare,
      title: t("solutions.features.items.collaboration.title"),
      description: t("solutions.features.items.collaboration.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: t("solutions.features.items.tracing.title"),
      description: t("solutions.features.items.tracing.description"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      title: t("solutions.features.items.alerts.title"),
      description: t("solutions.features.items.alerts.description"),
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: BookOpen,
      title: t("solutions.features.items.integration.title"),
      description: t("solutions.features.items.integration.description"),
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  const benefits = t("solutions.benefits.items", {
    returnObjects: true,
  }) as string[];

  const testimonials = [
    {
      name: t("solutions.testimonials.items.sarah.name"),
      role: t("solutions.testimonials.items.sarah.role"),
      school: t("solutions.testimonials.items.sarah.school"),
      quote: t("solutions.testimonials.items.sarah.quote"),
      avatar: "👩‍🏫",
    },
    {
      name: t("solutions.testimonials.items.miguel.name"),
      role: t("solutions.testimonials.items.miguel.role"),
      school: t("solutions.testimonials.items.miguel.school"),
      quote: t("solutions.testimonials.items.miguel.quote"),
      avatar: "👨‍🏫",
    },
    {
      name: t("solutions.testimonials.items.emma.name"),
      role: t("solutions.testimonials.items.emma.role"),
      school: t("solutions.testimonials.items.emma.school"),
      quote: t("solutions.testimonials.items.emma.quote"),
      avatar: "👩‍💼",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost">{t("solutions.header.requestDemo")}</Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
              {t("solutions.header.contactSales")}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>

          <div className="relative z-10 p-12">
            <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2">
              {t("solutions.hero.badge")}
            </Badge>

            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("solutions.hero.title")}
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("solutions.hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("solutions.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-lg px-8 py-4"
              >
                {t("solutions.hero.ctaPrimary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-4"
              >
                {t("solutions.hero.ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t("solutions.demo.title")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t("solutions.demo.subtitle")}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>

          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {t("solutions.demo.schoolName")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("solutions.demo.poweredBy")}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                {t("solutions.demo.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Demo */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-700">
                    {t("solutions.demo.student.title")}
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    {t("solutions.demo.student.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4 mb-6">
                    {(
                      t("solutions.demo.student.features", {
                        returnObjects: true,
                      }) as string[]
                    ).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center space-x-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/demo-login?role=student">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                      <Play className="h-4 w-4 mr-2" />
                      {t("solutions.demo.student.cta")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Teacher Demo */}
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-blue-700">
                    {t("solutions.demo.teacher.title")}
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    {t("solutions.demo.teacher.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4 mb-6">
                    {(
                      t("solutions.demo.teacher.features", {
                        returnObjects: true,
                      }) as string[]
                    ).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center space-x-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/demo-login?role=teacher">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                      <Monitor className="h-4 w-4 mr-2" />
                      {t("solutions.demo.teacher.cta")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                {t("solutions.demo.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("solutions.features.title")}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t("solutions.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-2xl transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/20 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t("solutions.benefits.title")}
              </span>
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            <div className="relative z-10 p-8">
              <div className="text-center">
                <GraduationCap className="h-24 w-24 mx-auto mb-6 text-indigo-600" />
                <h3 className="text-2xl font-bold mb-4">
                  {t("solutions.benefits.stats.title")}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {t("solutions.benefits.stats.improvement.value")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("solutions.benefits.stats.improvement.label")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {t("solutions.benefits.stats.satisfaction.value")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("solutions.benefits.stats.satisfaction.label")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {t("solutions.benefits.stats.timeSaved.value")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("solutions.benefits.stats.timeSaved.label")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">
                      {t("solutions.benefits.stats.engagement.value")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("solutions.benefits.stats.engagement.label")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("solutions.testimonials.title")}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all"
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
                <Badge variant="outline">{testimonial.school}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic text-center">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
          <div className="relative z-10 p-12">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("solutions.cta.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("solutions.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-lg px-8 py-4"
              >
                {t("solutions.cta.primary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-4"
              >
                {t("solutions.cta.secondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t("solutions.footer.title")}
            </span>
          </div>
          <p className="text-gray-500">{t("solutions.footer.tagline")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Solutions;
