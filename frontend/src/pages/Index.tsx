import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Target,
  Users,
  Shield,
  BookOpen,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => {
  const [examFilter, setExamFilter] = useState("");

  const examTypes = [
    {
      name: "SAT",
      country: "USA",
      description: "Scholastic Assessment Test",
      gradient: "from-blue-500 to-red-500",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      flag: "🇺🇸",
      students: "2.1M",
    },
    {
      name: "ENEM",
      country: "Brazil",
      description: "Exame Nacional do Ensino Médio",
      gradient: "from-green-400 to-yellow-400",
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      flag: "🇧🇷",
      students: "5.8M",
    },
    {
      name: "A-levels",
      country: "UK",
      description: "Advanced Level Qualifications",
      gradient: "from-red-500 to-blue-600",
      borderColor: "border-red-500",
      bgColor: "bg-red-50",
      flag: "🇬🇧",
      students: "800K",
    },
    {
      name: "IB",
      country: "International",
      description: "International Baccalaureate",
      gradient: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      flag: "🌍",
      students: "170K",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Explainable AI",
      description: "Every answer comes with clear reasoning steps, sources, and bias detection for transparent learning.",
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description: "Personalized practice that identifies your knowledge gaps and adapts to your learning style.",
    },
    {
      icon: Shield,
      title: "Ethical AI",
      description: "Transparent AI that highlights potential bias and promotes critical thinking alongside educators.",
    },
    {
      icon: Users,
      title: "Teacher Collaboration",
      description: "Designed to enhance teaching, not replace it. Teachers can review and add context to AI explanations.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "SAT Student",
      content: "Improved my score by 200 points! The AI explanations helped me understand concepts I'd been struggling with for months.",
      avatar: "👩‍🎓",
      score: "+200 points",
    },
    {
      name: "Miguel Santos",
      role: "ENEM Student",
      content: "The bias detection feature taught me to think more critically about information. It's like having a personal tutor.",
      avatar: "👨‍🎓",
      score: "Top 5%",
    },
    {
      name: "Emma Thompson",
      role: "A-Level Student",
      content: "The step-by-step explanations are incredible. I finally understand why answers are correct, not just what they are.",
      avatar: "👩‍💼",
      score: "A* grades",
    },
  ];

  const filteredExams = examTypes.filter(
    (exam) =>
      exam.name.toLowerCase().includes(examFilter.toLowerCase()) ||
      exam.country.toLowerCase().includes(examFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">artori</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/solutions" className="text-gray-600 hover:text-gray-900 transition-colors">
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
      <section className="pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-gray-100 text-gray-700 border-0 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Exam Preparation
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master high-stakes exams with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              responsible AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get step-by-step explanations, bias detection, and personalized learning paths. 
            Join 50,000+ students studying smarter with transparent AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Start practicing free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
              Watch demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>
              </div>
              <span>50,000+ students</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div>200+ schools</div>
          </div>
        </div>
      </section>

      {/* Exam Types */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Practice for your exam
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Localized content and practice questions for major standardized tests worldwide
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search exams or countries..."
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filteredExams.map((exam) => (
              <div
                key={exam.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{exam.flag}</div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    {exam.students} students
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-gray-600 mb-1">{exam.country}</p>
                <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white group-hover:bg-gray-800 transition-colors"
                  onClick={() => window.location.href = "/login"}
                >
                  Start practicing
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Responsible AI for better learning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for students, trusted by educators. Our AI explains its reasoning and promotes critical thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See how artori is helping students achieve their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800 border-0">
                    {testimonial.score}
                  </Badge>
                </div>
                <p className="text-gray-600 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Trusted by students worldwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-gray-300">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-gray-300">Questions Answered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-gray-300">Partner Schools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to ace your exam?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using responsible AI to achieve their academic goals.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
              Start your free practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;