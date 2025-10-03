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
  Brain,
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
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAuth,
  useExams,
  useExam,
  useSetUserExam,
  useLogout,
} from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Practice = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: exams, isLoading: examsLoading } = useExams();
  const { data: selectedExamData } = useExam(user?.selected_exam_id);
  const setUserExamMutation = useSetUserExam();
  const logoutMutation = useLogout();
  const hasSelectedExam = !!user?.selected_exam_id;
  const isNewUser = !hasSelectedExam;

  // Check if user is admin based on user role
  const isAdmin =
    user && ["admin", "super_admin"].includes(user.role || "student");

  // Fetch dashboard data for users with selected exam
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.getDashboard(),
    enabled: hasSelectedExam,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleExamSelection = async (examId: string) => {
    try {
      await setUserExamMutation.mutateAsync(examId);
      toast({
        title: "Exam selected",
        description: "You can now start practicing!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select exam",
        variant: "destructive",
      });
    }
  };

  if (authLoading || examsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              artori.app
            </span>
          </Link>

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
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
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isAdmin && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

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
                <span>Subscription</span>
                <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                  Free
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
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!hasSelectedExam || isNewUser ? (
          <>
            {/* Exam Selection */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
                <div className="relative z-10 p-8">
                  <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                    👋 Welcome, {user.name}!
                  </Badge>
                  <h1 className="text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Choose Your Exam
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600">
                    Select the exam you're preparing for to start your study
                    journey
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {exams?.map((exam) => (
                <Card
                  key={exam.id}
                  className={`hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                    exam.borderColor || "border-gray-200"
                  } ${
                    exam.bgColor || "bg-white"
                  } backdrop-blur-sm bg-white/60 hover:scale-105`}
                  onClick={() => handleExamSelection(exam.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{exam.name}</CardTitle>
                        <CardDescription className="text-lg">
                          {exam.country}
                        </CardDescription>
                      </div>
                      <div className="text-4xl">{exam.flag || "📚"}</div>
                    </div>
                    <p className="text-gray-600">{exam.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Subjects:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exam.subjects &&
                            exam.subjects.slice(0, 3).map((subject) => (
                              <Badge
                                key={subject.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {subject.name}
                              </Badge>
                            ))}
                          {exam.subjects && exam.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{exam.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        {exam.total_questions || 0} practice questions available
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${
                          exam.gradient || "from-blue-500 to-purple-500"
                        } hover:shadow-lg transition-all`}
                      >
                        Start Preparation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Dynamic Dashboard */}
            {dashboardData && (
              <>
                <div className="text-center mb-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
                    <div className="relative z-10 p-8">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <span className="text-4xl">
                          {dashboardData.selected_exam.flag || "📚"}
                        </span>
                        <Badge
                          className={`bg-gradient-to-r ${
                            dashboardData.selected_exam.gradient ||
                            "from-blue-500 to-purple-500"
                          } text-white border-0`}
                        >
                          {dashboardData.selected_exam.name} 2025
                        </Badge>
                      </div>
                      <h1 className="text-5xl font-bold mb-4">
                        <span
                          className={`bg-gradient-to-r ${
                            dashboardData.selected_exam.gradient ||
                            "from-blue-600 to-purple-600"
                          } bg-clip-text text-transparent`}
                        >
                          Study Dashboard
                        </span>
                      </h1>
                      <p className="text-xl text-gray-600">
                        Continue your {dashboardData.selected_exam.name}{" "}
                        preparation. You're making great progress!
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
                          <CardTitle className="text-xl">
                            Overall Progress
                          </CardTitle>
                          <CardDescription>
                            Your performance across all sections
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {dashboardData.user_progress
                                ? Math.round(
                                    dashboardData.user_progress.overall_progress
                                  )
                                : 0}
                              %
                            </div>
                            <div className="text-xs text-gray-600">
                              Complete
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              89
                            </div>
                            <div className="text-xs text-gray-600">
                              Days left
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress
                        value={
                          dashboardData.user_progress?.overall_progress || 0
                        }
                        className="h-3 mb-4"
                      />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-indigo-600">
                            {dashboardData.user_progress?.questions_solved || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Questions Solved
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {dashboardData.user_progress
                              ? Math.round(
                                  dashboardData.user_progress.accuracy_rate
                                )
                              : 0}
                            %
                          </div>
                          <div className="text-sm text-gray-600">
                            Accuracy Rate
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {dashboardData.user_progress?.study_time_hours || 0}
                            h
                          </div>
                          <div className="text-sm text-gray-600">
                            Study Time
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {dashboardData.user_progress?.current_streak_days ||
                              0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Day Streak
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Subject Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.selected_exam.subjects?.map((subject) => {
                    const subjectProgress =
                      dashboardData.user_progress?.subject_progress?.find(
                        (sp) => sp.subject_id === subject.id
                      );

                    return (
                      <Card
                        key={subject.id}
                        className={`hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                          subject.bgColor || "bg-white"
                        } backdrop-blur-sm bg-white/60 border-white/20 hover:scale-105`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="text-3xl">
                              {subject.icon || "📚"}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {subject.duration || "N/A"}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">
                            {subject.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {subject.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>
                                  {subjectProgress
                                    ? Math.round(subjectProgress.progress)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={subjectProgress?.progress || 0}
                                className="h-2"
                              />
                            </div>

                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                {subject.total_questions || 0} questions
                              </span>
                              <span className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {subjectProgress
                                  ? Math.round(subjectProgress.accuracy_rate)
                                  : 0}
                                % accuracy
                              </span>
                            </div>

                            <Link
                              to={`/question/${dashboardData.selected_exam.id}/${subject.id}`}
                            >
                              <Button
                                className={`w-full bg-gradient-to-r ${
                                  subject.gradient ||
                                  "from-blue-500 to-purple-500"
                                } hover:shadow-lg transition-all`}
                              >
                                Continue Studying
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        Full Practice Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Take a complete {dashboardData.selected_exam.name}{" "}
                        practice test under timed conditions
                      </p>
                      <Button variant="outline" className="w-full">
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
                      <Button variant="outline" className="w-full">
                        Start Review
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">Study Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        View your personalized schedule until test day
                      </p>
                      <Button variant="outline" className="w-full">
                        View Schedule
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/20 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              artori.app
            </span>
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            <Link
              to="/solutions"
              className="hover:text-indigo-600 transition-colors"
            >
              Schools
            </Link>
            <Link
              to="/about"
              className="hover:text-indigo-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="hover:text-indigo-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/contact"
              className="hover:text-indigo-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          © 2025 artori.app. Responsible AI for better learning. 🌟
        </div>
      </footer>
    </div>
  );
};

export default Practice;
