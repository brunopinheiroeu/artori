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
  Brain,
  ArrowLeft,
  Target,
  Users,
  Shield,
  BookOpen,
  Heart,
  Lightbulb,
  Globe,
  Award,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Responsible AI",
      description: "We believe AI should be transparent, explainable, and designed to enhance human learning, not replace critical thinking.",
    },
    {
      icon: Heart,
      title: "Student-First",
      description: "Every decision we make is guided by what's best for students and their learning journey.",
    },
    {
      icon: Users,
      title: "Teacher Partnership",
      description: "We work alongside educators, not against them, to create better learning experiences.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Quality education should be accessible to students worldwide, regardless of their location or background.",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former Stanford AI researcher with 10+ years in educational technology. PhD in Machine Learning.",
      avatar: "👩‍💼",
      expertise: "AI Ethics, Educational Psychology",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Google engineer who led AI infrastructure teams. Passionate about scalable educational platforms.",
      avatar: "👨‍💻",
      expertise: "AI Infrastructure, Platform Architecture",
    },
    {
      name: "Dr. Amara Okafor",
      role: "Head of Education",
      bio: "Former high school principal and curriculum designer. 15+ years in education leadership.",
      avatar: "👩‍🏫",
      expertise: "Curriculum Design, Teacher Training",
    },
    {
      name: "James Liu",
      role: "Head of Product",
      bio: "Product leader from Duolingo and Khan Academy. Expert in learning experience design.",
      avatar: "👨‍🎨",
      expertise: "Product Strategy, UX Design",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a mission to make AI-powered learning transparent and ethical.",
    },
    {
      year: "2024",
      title: "First 10,000 Students",
      description: "Reached our first major milestone with students from 50+ countries.",
    },
    {
      year: "2024",
      title: "School Partnerships",
      description: "Launched partnerships with 200+ schools worldwide.",
    },
    {
      year: "2025",
      title: "50,000+ Active Users",
      description: "Growing community of students achieving better exam results.",
    },
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
              <Link to="/solutions" className="text-gray-600 hover:text-gray-900 transition-colors">
                For Schools
              </Link>
              <Link to="/about" className="text-gray-900 font-medium">
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
            <Lightbulb className="h-4 w-4 mr-2" />
            Our Story
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Building the future of{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              responsible AI education
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make AI-powered learning transparent, ethical, and accessible 
            to students worldwide. Every explanation, every recommendation, every interaction 
            is designed to enhance human learning, not replace it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Join our mission
              </Button>
            </Link>
            <Link to="/solutions">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
                Partner with us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why we exist
              </h2>
              <p className="text-xl text-gray-600">
                The problem we're solving and the future we're building
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize access to high-quality, personalized education through 
                  transparent AI that empowers students and supports teachers. We believe 
                  every student deserves to understand not just what the right answer is, 
                  but why it's right.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A world where AI enhances human learning without replacing human judgment. 
                  Where students develop critical thinking skills alongside academic knowledge, 
                  and where teachers are empowered with tools that amplify their impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet our team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate educators, engineers, and researchers working together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-indigo-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {member.bio}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    {member.expertise}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in building responsible AI for education
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className="bg-gray-100 text-gray-700 border-0">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impact by the numbers
            </h2>
            <p className="text-xl text-gray-600">
              The difference we're making in education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-gray-600">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in touch
              </h2>
              <p className="text-xl text-gray-600">
                We'd love to hear from you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-gray-200 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">General Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Questions about artori or our mission
                  </p>
                  <Button variant="outline" className="w-full">
                    hello@artori.app
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">School Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Interested in bringing artori to your school
                  </p>
                  <Button variant="outline" className="w-full">
                    schools@artori.app
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    San Francisco, CA<br />
                    New York, NY
                  </p>
                  <Button variant="outline" className="w-full">
                    Schedule a visit
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to join our mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a student, teacher, or school administrator, 
            we'd love to have you as part of the artori community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Start learning today
              </Button>
            </Link>
            <Link to="/solutions">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300">
                Partner with us
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

export default About;