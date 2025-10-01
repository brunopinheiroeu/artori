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
  Users,
  BarChart3,
  User,
  LogOut,
  Calendar,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Target,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DemoTutor = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("demoUser");
    if (!userData) {
      navigate("/demo-login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "teacher") {
      navigate("/demo-practice");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    navigate("/solutions");
  };

  // Mock class data
  const classData = [
    {
      id: 1,
      name: "AP Calculus BC",
      students: 28,
      avgProgress: 73,
      activeStudents: 24,
      needsAttention: 4,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      name: "SAT Prep - Morning",
      students: 22,
      avgProgress: 68,
      activeStudents: 20,
      needsAttention: 2,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      name: "SAT Prep - Afternoon",
      students: 25,
      avgProgress: 61,
      activeStudents: 21,
      needsAttention: 6,
      gradient: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
    },
  ];

  // Mock student alerts
  const studentAlerts = [
    {
      student: "Alex Johnson",
      issue: "Struggling with quadratic equations",
      priority: "high",
      lastActive: "2 hours ago",
    },
    {
      student: "Emma Davis",
      issue: "Low engagement in reading comprehension",
      priority: "medium",
      lastActive: "1 day ago",
    },
    {
      student: "Michael Chen",
      issue: "Needs review of algebra fundamentals",
      priority: "medium",
      lastActive: "3 hours ago",
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
                    {user.school} - Teacher
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
                <span>Analytics Dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Class Schedule</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Teacher Resources</span>
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
                <span className="text-4xl">👩‍🏫</span>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  Teacher Dashboard
                </Badge>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome, {user.name}
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Monitor your students' progress and AI interactions
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">75</div>
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 this week
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
              <div className="text-sm text-gray-600">Avg Progress</div>
              <div className="text-xs text-blue-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3% this week
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Need Attention</div>
              <div className="text-xs text-orange-600 flex items-center justify-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Review needed
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                89%
              </div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
              <div className="text-xs text-emerald-600 flex items-center justify-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Excellent
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classData.map((classItem) => (
              <Card
                key={classItem.id}
                className={`hover:shadow-2xl transition-all duration-300 cursor-pointer ${classItem.bgColor} backdrop-blur-sm bg-white/60 border-white/20 hover:scale-105`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">📚</div>
                    <Badge variant="outline" className="text-xs">
                      {classItem.students} students
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {classItem.activeStudents} active •{" "}
                    {classItem.needsAttention} need attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Class Average</span>
                        <span>{classItem.avgProgress}%</span>
                      </div>
                      <Progress value={classItem.avgProgress} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {classItem.activeStudents} active
                      </span>
                      <span className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                        {classItem.needsAttention} alerts
                      </span>
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${classItem.gradient} hover:shadow-lg transition-all`}
                    >
                      View Class Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Student Alerts
          </h2>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Students Needing Attention
              </CardTitle>
              <CardDescription>
                AI-generated intervention recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          alert.priority === "high"
                            ? "bg-red-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">{alert.student}</p>
                        <p className="text-sm text-gray-600">{alert.issue}</p>
                        <p className="text-xs text-gray-500">
                          Last active: {alert.lastActive}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 hover:bg-green-50"
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                View detailed performance analytics
              </p>
              <Button
                variant="outline"
                className="w-full border-green-200 hover:bg-green-50"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Assignments</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Create and manage practice sets
              </p>
              <Button
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50"
              >
                Manage
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Review AI explanations and add context
              </p>
              <Button
                variant="outline"
                className="w-full border-teal-200 hover:bg-teal-50"
              >
                Review
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Access teaching materials and guides
              </p>
              <Button
                variant="outline"
                className="w-full border-emerald-200 hover:bg-emerald-50"
              >
                Browse
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

export default DemoTutor;
