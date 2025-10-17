import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Users,
  MessageSquare,
  Play,
  Award,
  Brain,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const StudentDashboard = () => {
  const { t } = useTranslation("student");
  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: () => apiClient.getDashboard(),
  });

  // Mock data for features not yet implemented
  const mockData = {
    upcomingTutorSessions: [
      {
        id: "1",
        tutorName: "Dr. Sarah Johnson",
        subject: "Mathematics",
        time: dayjs().add(1, "day").toDate(),
        duration: "1 hour",
        type: "Algebra Review",
      },
      {
        id: "2",
        tutorName: "Prof. Michael Chen",
        subject: "Physics",
        time: dayjs().add(2, "day").toDate(),
        duration: "45 minutes",
        type: "Mechanics Help",
      },
    ],
    studyGoals: [
      {
        id: "1",
        title: "Complete 50 Math Questions",
        progress: 32,
        target: 50,
        dueDate: dayjs().add(3, "day").toDate(),
      },
      {
        id: "2",
        title: "Study 2 Hours Daily",
        progress: 5,
        target: 7,
        dueDate: new Date(),
      },
    ],
    recentAchievements: [
      {
        id: "1",
        title: "7-Day Study Streak",
        icon: "🔥",
        earnedDate: new Date(),
      },
      {
        id: "2",
        title: "Math Master",
        icon: "🧮",
        earnedDate: dayjs().subtract(2, "day").toDate(),
      },
    ],
  };

  // Show error state if critical data fails to load
  if (dashboardError) {
    return (
      <StudentLayout
        title={t("dashboard.title")}
        description={t("dashboard.description")}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("dashboard.errorMessage", {
              defaultValue:
                "Failed to load dashboard data. Please try refreshing the page.",
            })}
          </AlertDescription>
        </Alert>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("dashboard.welcomeBack")}! 👋
                </h2>
                <p className="text-gray-600">
                  {t("dashboard.welcomeMessage", {
                    defaultValue:
                      "Ready to continue your learning journey? Let's make today count!",
                  })}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-6xl">🎯</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {dashboardLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("dashboard.questionsSolved", {
                        defaultValue: "Questions Solved",
                      })}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {dashboardData?.user_progress?.questions_solved || 0}
                    </p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {t("dashboard.keepGoing", {
                        defaultValue: "Keep going!",
                      })}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {dashboardLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("progress.accuracy")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {dashboardData?.user_progress
                        ? Math.round(dashboardData.user_progress.accuracy_rate)
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <Target className="h-3 w-3 mr-1" />
                      {t("dashboard.excellent", { defaultValue: "Excellent!" })}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {dashboardLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("dashboard.studyStreak")}
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {dashboardData?.user_progress?.current_streak_days || 0}
                    </p>
                    <p className="text-sm text-orange-600 flex items-center mt-1">
                      <Zap className="h-3 w-3 mr-1" />
                      {t("dashboard.daysInRow", {
                        defaultValue: "Days in a row",
                      })}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {dashboardLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("dashboard.studyTime", { defaultValue: "Study Time" })}
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {dashboardData?.user_progress?.study_time_hours || 0}h
                    </p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {t("dashboard.totalHours")}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Progress */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>{t("progress.overallProgress")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {t("dashboard.examPreparation", {
                          defaultValue: "Exam Preparation",
                        })}
                      </span>
                      <span>
                        {dashboardData?.user_progress
                          ? Math.round(
                              dashboardData.user_progress.overall_progress
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardData?.user_progress?.overall_progress || 0
                      }
                      className="h-3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-600">
                        {dashboardData?.selected_exam?.subjects?.length || 0}
                      </div>
                      <div className="text-gray-600">
                        {t("dashboard.subjects", { defaultValue: "Subjects" })}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-600">
                        {dashboardData?.selected_exam?.total_questions || 0}
                      </div>
                      <div className="text-gray-600">
                        {t("dashboard.questions", {
                          defaultValue: "Questions",
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>
                  {t("dashboard.quickActions", {
                    defaultValue: "Quick Actions",
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/practice">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transition-all">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t("practice.continueStudying")}
                </Button>
              </Link>
              <Link to="/student/tutors">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  {t("tutors.title")}
                </Button>
              </Link>
              <Link to="/student/progress">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t("dashboard.viewAnalytics", {
                    defaultValue: "View Analytics",
                  })}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions and Study Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tutor Sessions */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{t("dashboard.upcomingSessions")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.upcomingTutorSessions.length > 0 ? (
                  mockData.upcomingTutorSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg"
                    >
                      <div className="p-2 rounded-full bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {session.tutorName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.subject} • {session.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dayjs(session.time).format("MMM D, h:mm A")} •{" "}
                          {session.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {t("dashboard.noUpcomingSessions")}
                    </p>
                    <Link to="/student/tutors">
                      <Button variant="outline" size="sm" className="mt-2">
                        {t("tutors.title")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>{t("dashboard.studyGoals")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.studyGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-white/40 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium">{goal.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {dayjs(goal.dueDate).format("MMM D")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          {goal.progress} / {goal.target}
                        </span>
                        <span>
                          {Math.round((goal.progress / goal.target) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(goal.progress / goal.target) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
                <Link to="/student/goals">
                  <Button variant="outline" size="sm" className="w-full">
                    {t("dashboard.viewAllGoals")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>{t("dashboard.achievements")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockData.recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="text-center p-4 bg-white/40 rounded-lg border border-white/20"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-medium">{achievement.title}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {dayjs(achievement.earnedDate).format("MMM D, YYYY")}
                  </div>
                </div>
              ))}
              <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">
                  {t("dashboard.keepStudyingMessage", {
                    defaultValue: "Keep studying to unlock more achievements!",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
