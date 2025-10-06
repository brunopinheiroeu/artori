import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import GradientButton from "@/components/GradientButton";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import ExamCard from "@/components/ExamCard";
import FeatureCard from "@/components/FeatureCard";
import AppHeader from "@/components/AppHeader";

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
    },
    {
      name: "ENEM",
      country: "Brazil",
      description: "Exame Nacional do Ensino Médio",
      gradient: "from-green-400 to-yellow-400",
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      flag: "🇧🇷",
    },
    {
      name: "Leaving Certificate",
      country: "Ireland",
      description: "Irish State Examination",
      gradient: "from-green-600 to-orange-500",
      borderColor: "border-green-600",
      bgColor: "bg-green-50",
      flag: "🇮🇪",
    },
    {
      name: "Selectividad",
      country: "Spain",
      description: "Evaluación de Bachillerato para el Acceso a la Universidad",
      gradient: "from-red-600 to-yellow-500",
      borderColor: "border-red-600",
      bgColor: "bg-red-50",
      flag: "🇪🇸",
    },
    {
      name: "A-levels",
      country: "UK",
      description: "Advanced Level Qualifications",
      gradient: "from-red-500 to-blue-600",
      borderColor: "border-red-500",
      bgColor: "bg-red-50",
      flag: "🇬🇧",
    },
    {
      name: "Abitur",
      country: "Germany",
      description: "German University Entrance",
      gradient: "from-yellow-400 to-red-500",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-50",
      flag: "🇩🇪",
    },
    {
      name: "IB",
      country: "International",
      description: "International Baccalaureate",
      gradient: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      flag: "🌍",
    },
    {
      name: "BAC",
      country: "France",
      description: "Baccalauréat",
      gradient: "from-blue-600 to-red-600",
      borderColor: "border-blue-600",
      bgColor: "bg-blue-50",
      flag: "🇫🇷",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Explainable AI",
      description: "Every answer comes with clear reasoning steps and sources",
      gradient: "from-purple-400 to-pink-400",
      bgColor: "bg-purple-50",
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description: "Personalized practice that adapts to your learning gaps",
      gradient: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Bias Detection",
      description: "Transparent AI that highlights potential bias in reasoning",
      gradient: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "Teacher Collaboration",
      description: "Designed to work with educators, not replace them",
      gradient: "from-orange-400 to-red-400",
      bgColor: "bg-orange-50",
    },
    {
      icon: BookOpen,
      title: "Reflection Activities",
      description: "Open-ended prompts that promote critical thinking",
      gradient: "from-indigo-400 to-purple-400",
      bgColor: "bg-indigo-50",
    },
    {
      icon: TrendingUp,
      title: "Study Journeys",
      description: "Track your learning process, not just outcomes",
      gradient: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50",
    },
  ];

  const filteredExams = examTypes.filter(
    (exam) =>
      exam.name.toLowerCase().includes(examFilter.toLowerCase()) ||
      exam.country.toLowerCase().includes(examFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
            🚀 AI-Powered Exam Preparation
          </Badge>

          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your AI Study
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master high-stakes exams with responsible AI that explains its
            reasoning, detects bias, and promotes deep learning alongside your
            teachers.
            <span className="font-semibold text-indigo-600">
              Join 50,000+ students already studying smarter!
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <GradientButton
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4"
              >
                🎯 Start Practicing Free
              </GradientButton>
            </Link>
            <GradientButton
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-4"
            >
              📚 Learn More
            </GradientButton>
          </div>
        </GlassmorphismCard>
      </section>

      {/* Exam Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Supported Exams
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Practice for your specific exam with localized content
          </p>

          {/* Search Filter */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exams or countries..."
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
              onSelect={() => (window.location.href = "/login")}
            />
          ))}

          {/* More Exams Card */}
          <ExamCard
            name="More Exams"
            country="Coming Soon"
            description="Request your exam type"
            flag="➕"
            gradient="from-gray-400 to-gray-500"
            borderColor="border-gray-300"
            bgColor="bg-white/40"
            buttonText="Request Exam"
            onSelect={() => {}}
          />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Responsible AI Features
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Built for students, trusted by educators
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

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <GlassmorphismCard className="text-center" padding="p-12">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Trusted by Students Worldwide
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                200+
              </div>
              <div className="text-gray-600">Partner Schools</div>
            </div>
          </div>
        </GlassmorphismCard>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <GlassmorphismCard padding="p-12">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Transform Your Study Experience?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using AI responsibly to
            ace their exams.
            <span className="font-semibold text-violet-600">
              Start your free practice today!
            </span>
          </p>
          <Link to="/login">
            <GradientButton
              size="lg"
              gradient="from-violet-500 to-pink-600"
              className="text-lg px-12 py-4"
            >
              🚀 Start Your Free Practice
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
