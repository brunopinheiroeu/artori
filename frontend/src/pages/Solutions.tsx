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
  Brain,
  Zap,
  Globe,
  Award,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Solutions = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Teacher Dashboards",
      description:
        "Real-time analytics on student progress, learning gaps, and AI interaction patterns with actionable insights.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Class Management",
      description:
        "Organize students, assign practice sets, and monitor collective performance across multiple classes.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageSquare,
      title: "AI Collaboration",
      description:
        "Teachers can review, annotate, and add cultural context to AI explanations for better learning outcomes.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Ethical AI Monitoring",
      description:
        "Full transparency with citations, bias detection, and attribution to maintain academic integrity.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      title: "Smart Interventions",
      description:
        "AI-generated alerts and recommendations for when and how to help struggling students succeed.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: BookOpen,
      title: "Curriculum Integration",
      description:
        "Seamlessly integrate with existing LMS platforms and align with curriculum standards worldwide.",
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
      improvement: "23% score increase",
    },
    {
      name: "Prof. Miguel Santos",
      role: "ENEM Coordinator",
      school: "Colégio São Paulo",
      quote:
        "The bias detection and explainable AI features give us confidence that students are learning responsibly and ethically.",
      avatar: "👨‍🏫",
      improvement: "85% teacher satisfaction",
    },
    {
      name: "Emma Thompson",
      role: "A-Level Coordinator",
      school: "Cambridge Academy",
      quote:
        "Our pass rates improved significantly after implementing artori.app. The teacher collaboration features are game-changing.",
      avatar: "👩‍💼",
      improvement: "40% time saved",
    },
  ];

  const stats = [
    { value: "200+", label: "Partner Schools", icon: Building2 },
    { value: "50K+", label: "Active Students", icon: Users },
    { value: "95%", label: "Teacher Satisfaction", icon: Star },
    { value: "23%", label: "Average Score Improvement", icon: TrendingUp },
  ];

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
              <Link to="/solutions" className="text-gray-900 font-medium">
                For Schools
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Request Demo
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Contact Sales
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-gray-100 text-gray-700 border-0 px-4 py-2">
            <Building2 className="h-4 w-4 mr-2" />
            Educational Solutions
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Empower your school with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              responsible AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Give your teachers the tools they need to guide students through AI-powered learning. 
            Our platform integrates seamlessly while maintaining academic integrity and promoting deep learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
              Download Brochure
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-6 w-6 text-gray-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience our platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how artori.app transforms learning through the lens of Riverside Academy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Riverside Academy
                    </h3>
                    <p className="text-sm text-gray-600">Powered by artori.app</p>
                  </div>
                </div>
                <p className="text-center text-gray-600">
                  See how our whitelabeled platform looks with your school's branding
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Demo */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        Student Experience
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Experience the platform as a student would
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-3 mb-6">
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
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Try Student Demo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Teacher Demo */}
                  <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">
                        Teacher Dashboard
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        See the powerful analytics and management tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-3 mb-6">
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
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                          <Monitor className="h-4 w-4 mr-2" />
                          Try Teacher Demo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <Badge className="bg-gray-100 text-gray-700 border-0">
                    💡 This demo shows complete customization with your school's branding
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for educators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools that enhance teaching, don't replace it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why schools choose artori
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="border border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Proven Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">23%</div>
                      <div className="text-sm text-gray-600">Score Improvement</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
                      <div className="text-sm text-gray-600">Teacher Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">40%</div>
                      <div className="text-sm text-gray-600">Time Saved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                      <div className="text-sm text-gray-600">Student Engagement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What educators say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from schools using artori.app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {testimonial.school}
                      </Badge>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                      {testimonial.improvement}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to transform your school?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of schools already using artori.app to enhance student learning 
            and support teachers with responsible AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
              Schedule Your Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Solutions;