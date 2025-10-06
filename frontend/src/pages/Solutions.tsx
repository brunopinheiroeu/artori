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

const Solutions = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Teacher Dashboards",
      description:
        "Real-time analytics on student progress, learning gaps, and AI interaction patterns",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Class Management",
      description:
        "Organize students, assign practice sets, and monitor collective performance",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageSquare,
      title: "AI Collaboration",
      description:
        "Teachers can annotate AI explanations and add cultural/ethical context",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Ethical Tracing",
      description:
        "Full transparency with citations and attribution to prevent plagiarism",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      title: "Intervention Alerts",
      description:
        "AI-generated suggestions for when and how to help struggling students",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: BookOpen,
      title: "Curriculum Integration",
      description:
        "Seamlessly integrate with existing LMS and curriculum standards",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  const benefits = [
    "Reduce teacher workload with automated progress tracking",
    "Identify learning gaps before they become problems",
    "Maintain academic integrity with transparent AI",
    "Enhance student engagement with personalized learning",
    "Support teachers with data-driven insights",
    "Scale quality education across all classrooms",
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Mathematics Department Head",
      school: "Lincoln High School",
      quote:
        "artori.app has transformed how we approach exam preparation. Teachers love the insights, and students are more engaged than ever.",
      avatar: "👩‍🏫",
    },
    {
      name: "Prof. Miguel Santos",
      role: "ENEM Coordinator",
      school: "Colégio São Paulo",
      quote:
        "The bias detection and explainable AI features give us confidence that students are learning responsibly.",
      avatar: "👨‍🏫",
    },
    {
      name: "Emma Thompson",
      role: "A-Level Coordinator",
      school: "Cambridge Academy",
      quote:
        "Our pass rates improved by 23% after implementing artori.app. The teacher collaboration features are game-changing.",
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
            <Button variant="ghost">Request Demo</Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
              Contact Sales
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
              🏫 Educational Solutions
            </Badge>

            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Empower Your School
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                with Responsible AI
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Give your teachers the tools they need to guide students through
              AI-powered learning. Our school plugin integrates seamlessly with
              your existing systems while maintaining academic integrity and
              promoting deep learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-lg px-8 py-4"
              >
                📞 Schedule Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-4"
              >
                📋 Download Brochure
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
              Try Our Platform
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Experience artori.app through the eyes of Riverside Academy
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
                    Riverside Academy
                  </h3>
                  <p className="text-sm text-gray-500">Powered by artori.app</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                See how our whitelabeled platform looks and feels with your
                school's branding
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
                    Student Experience
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Experience the platform as a student would
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AI-powered practice questions</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Explainable AI responses</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Progress tracking</span>
                    </div>
                  </div>
                  <Link to="/demo-login?role=student">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                      <Play className="h-4 w-4 mr-2" />
                      Try Student Demo
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
                    Teacher Dashboard
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    See the powerful analytics and management tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Class performance analytics</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>AI interaction monitoring</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Intervention recommendations</span>
                    </div>
                  </div>
                  <Link to="/demo-login?role=teacher">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                      <Monitor className="h-4 w-4 mr-2" />
                      Try Teacher Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                💡 This demo shows how artori.app can be completely customized
                with your school's branding and colors
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
              Built for Educators
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Comprehensive tools that enhance teaching, don't replace it
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
                Why Schools Choose artori.app
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
                  200+ Schools Trust artori.app
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600">
                      23%
                    </div>
                    <div className="text-sm text-gray-600">
                      Average Score Improvement
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      85%
                    </div>
                    <div className="text-sm text-gray-600">
                      Teacher Satisfaction
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-gray-600">
                      Time Saved on Grading
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600">
                      95%
                    </div>
                    <div className="text-sm text-gray-600">
                      Student Engagement
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
              What Educators Say
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
                Ready to Transform Your School?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of schools already using artori.app to enhance
              student learning and support teachers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-lg px-8 py-4"
              >
                📞 Schedule Your Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-4"
              >
                💬 Contact Sales Team
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
              for Schools
            </span>
          </div>
          <p className="text-gray-500">
            Empowering educators with responsible AI since 2025 🎓
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Solutions;
