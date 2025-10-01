import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  ArrowLeft,
  Play,
  BookOpen,
  Target,
  User,
  LogOut,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  CreditCard,
  BarChart3,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DemoPractice = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("demoUser");
    if (!userData) {
      navigate("/demo-login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "student") {
      navigate("/demo-tutor");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    navigate("/solutions");
  };

  // SAT Subject Structure for demo
  const satSubjects = [
    {
      id: "reading",
      name: "Evidence-Based Reading",
      description:
        "Reading comprehension, vocabulary in context, and analysis of texts",
      questions: 52,
      progress: 68,
      duration: "65 minutes",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      icon: "📖",
    },
    {
      id: "writing",
      name: "Writing and Language",
      description: "Grammar, usage, and rhetoric in context",
      questions: 44,
      progress: 45,
      duration: "35 minutes",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      icon: "✍️",
    },
    {
      id: "math-no-calc",
      name: "Math (No Calculator)",
      description:
        "Algebra, advanced math, and problem-solving without calculator",
      questions: 20,
      progress: 72,
      duration: "25 minutes",
      gradient: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
      icon: "🧮",
    },
    {
      id: "math-calc",
      name: "Math (Calculator)",
      description: "Problem solving, data analysis, algebra, and advanced math",
      questions: 38,
      progress: 58,
      duration: "55 minutes",
      gradient: "from-emerald-500 to-blue-500",
      bgColor: "bg-emerald-50",
      icon: "📊",
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/solutions" className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Riverside Academy
              </span>
              <p className="text-xs text-gray-500">Powered by artori.app</p>
            </div>
          </Link>

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 backdrop-blur-sm bg-white/90 border-white/20"
              align="end"
            >
              <DropdownMenuLabel className="font-semibold">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs w-fit">
                    {user.school}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Study Analytics</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Study Schedule</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>School Plan</span>
                <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                  Premium
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Exit Demo</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl">🎓</span>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  SAT 2025 Prep
                </Badge>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back, {user.name}!
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Continue your SAT preparation with AI-powered practice
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Overall Progress</CardTitle>
                  <CardDescription>
                    Your performance across all sections
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">61%</div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89</div>
                    <div className="text-xs text-gray-600">Days left</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={61} className="h-3 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600">Questions Solved</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">82%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-teal-600">31h</div>
                  <div className="text-sm text-gray-600">Study Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">18</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {satSubjects.map((subject) => (
            <Card
              key={subject.id}
              className={`hover:shadow-2xl transition-all duration-300 cursor-pointer ${subject.bgColor} backdrop-blur-sm bg-white/60 border-white/20 hover:scale-105`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{subject.icon}</div>
                  <Badge variant="outline" className="text-xs">
                    {subject.duration}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription className="text-sm">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{subject.questions} questions</span>
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +7% this week
                    </span>
                  </div>

                  <Link to={`/question/sat/${subject.id}`}>
                    <Button
                      className={`w-full bg-gradient-to-r ${subject.gradient} hover:shadow-lg transition-all`}
                    >
                      Continue Studying
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Full Practice Test</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Take a complete SAT practice test under timed conditions
              </p>
              <Button
                variant="outline"
                className="w-full border-green-200 hover:bg-green-50"
              >
                Start Practice Test
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Smart Review</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Review questions you got wrong with AI explanations
              </p>
              <Button
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50"
              >
                Start Review
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Study Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                View your personalized schedule until test day
              </p>
              <Button
                variant="outline"
                className="w-full border-teal-200 hover:bg-teal-50"
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/20 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Riverside Academy
              </span>
              <p className="text-xs text-gray-500">Powered by artori.app</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            <Link
              to="/about"
              className="hover:text-green-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="hover:text-green-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/contact"
              className="hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          © 2025 Riverside Academy. Powered by artori.app - Responsible AI for
          better learning. 🌟
        </div>
      </footer>
    </div>
  );
};

export default DemoPractice;
