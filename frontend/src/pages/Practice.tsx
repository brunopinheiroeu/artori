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
  Brain,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">artori</span>
            </Link>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border border-gray-200"
                align="end"
              >
                <DropdownMenuLabel className="font-semibold">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
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
                  <span>Analytics</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!hasSelectedExam || isNewUser ? (
          <>
            {/* Exam Selection */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gray-100 text-gray-700 border-0">
                Welcome, {user.name}!
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Choose your exam
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select the exam you're preparing for to start your personalized study journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {exams?.map((exam) => (
                <Card
                  key={exam.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200"
                  onClick={() => handleExamSelection(exam.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{exam.name}</CardTitle>
                        <CardDescription className="text-lg text-gray-600">
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
                                className="text-xs bg-gray-100 text-gray-600"
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

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        Start preparation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Dashboard */}
            {dashboardData && (
              <>
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-4xl">
                      {dashboardData.selected_exam.flag || "📚"}
                    </span>
                    <Badge className="bg-gray-100 text-gray-700 border-0">
                      {dashboardData.selected_exam.name} 2025
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Study Dashboard
                  </h1>
                  <p className="text-xl text-gray-600">
                    Continue your {dashboardData.selected_exam.name} preparation. You're making great progress!
                  </p>
                </div>

                {/* Overall Progress */}
                <div className="mb-8">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-gray-900">
                            Overall Progress
                          </CardTitle>
                          <CardDescription>
                            Your performance across all sections
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
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
                            <div className="text-2xl font-bold text-gray-900">
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
                          <div className="text-lg font-bold text-gray-900">
                            {dashboardData.user_progress?.questions_solved || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Questions Solved
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
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
                          <div className="text-lg font-bold text-gray-900">
                            {dashboardData.user_progress?.study_time_hours || 0}
                            h
                          </div>
                          <div className="text-sm text-gray-600">
                            Study Time
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
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
                        className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200"
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
                          <CardTitle className="text-lg text-gray-900">
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
                              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                                Continue studying
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Practice;