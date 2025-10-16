import { useTranslation } from "react-i18next";
import TutorLayout from "@/components/TutorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, TutorDashboardStats } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const TutorDashboard = () => {
  const { t } = useTranslation();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<TutorDashboardStats>({
    queryKey: ["tutorDashboard"],
    queryFn: () => apiClient.getTutorDashboard(),
  });

  // Mock upcoming sessions data - in a real app, this would come from an API
  const upcomingSessions = [
    {
      id: "1",
      studentName: "Alice Johnson",
      subject: "Mathematics",
      time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: "1 hour",
      type: "Regular Session",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      subject: "Physics",
      time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: "45 minutes",
      type: "Exam Prep",
    },
    {
      id: "3",
      studentName: "Carol Davis",
      subject: "Chemistry",
      time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: "1.5 hours",
      type: "Regular Session",
    },
  ];

  // Show error state if critical data fails to load
  if (statsError) {
    return (
      <TutorLayout
        title={t("tutor:dashboard.title")}
        description={t("tutor:dashboard.description")}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("tutor:dashboard.failedToLoad")}
          </AlertDescription>
        </Alert>
      </TutorLayout>
    );
  }

  return (
    <TutorLayout
      title={t("tutor:dashboard.title")}
      description={t("tutor:dashboard.description")}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {statsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("tutor:dashboard.totalStudents")}
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {stats?.total_students || 0}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {t("tutor:dashboard.activeLearners")}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-100">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {statsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("tutor:dashboard.activeSessions")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.active_sessions || 0}
                    </p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {t("tutor:dashboard.inProgress")}
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
              {statsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("tutor:dashboard.averageRating")}
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats?.average_rating?.toFixed(1) || "0.0"}
                    </p>
                    <p className="text-sm text-yellow-600 flex items-center mt-1">
                      <Star className="h-3 w-3 mr-1" />
                      {t("tutor:dashboard.studentFeedback")}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {statsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("tutor:dashboard.totalEarnings")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ${stats?.total_earnings?.toFixed(0) || "0"}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {t("tutor:dashboard.thisMonth")}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Session Overview and Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{t("tutor:dashboard.sessionOverview")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("tutor:dashboard.completedSessions")}</span>
                      <span>{stats?.completed_sessions || 0}</span>
                    </div>
                    <Progress
                      value={Math.min(
                        ((stats?.completed_sessions || 0) / 150) * 100,
                        100
                      )}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("tutor:dashboard.upcomingSessions")}</span>
                      <span>{stats?.upcoming_sessions || 0}</span>
                    </div>
                    <Progress
                      value={Math.min(
                        ((stats?.upcoming_sessions || 0) / 10) * 100,
                        100
                      )}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("tutor:dashboard.studentSatisfaction")}</span>
                      <span>
                        {stats?.average_rating?.toFixed(1) || "0.0"}/5.0
                      </span>
                    </div>
                    <Progress
                      value={((stats?.average_rating || 0) / 5) * 100}
                      className="h-2"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t("tutor:dashboard.upcomingSessions")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-2 rounded-full bg-emerald-100">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {session.studentName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.subject} • {session.duration}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(session.time, {
                            addSuffix: true,
                          })}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {session.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    {t("tutor:dashboard.noUpcomingSessions")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{t("tutor:dashboard.quickActions")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/40 rounded-lg border border-white/20 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {t("tutor:dashboard.messageStudents")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("tutor:dashboard.sendUpdates")}
                </div>
              </div>
              <div className="p-4 bg-white/40 rounded-lg border border-white/20 text-center">
                <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {t("tutor:dashboard.scheduleSession")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("tutor:dashboard.bookSessions")}
                </div>
              </div>
              <div className="p-4 bg-white/40 rounded-lg border border-white/20 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {t("tutor:dashboard.createMaterials")}
                </div>
                <div className="text-xs text-gray-600">
                  {t("tutor:dashboard.prepareLessons")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorDashboard;
