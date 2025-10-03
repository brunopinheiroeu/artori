import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Activity,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  useAdminDashboardStats,
  useAdminActivityLogs,
  useSystemHealth,
} from "@/hooks/useAdminApi";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminDashboardStats();

  const {
    data: activityLogs,
    isLoading: activityLoading,
    error: activityError,
  } = useAdminActivityLogs(10, 0);

  const {
    data: systemHealth,
    isLoading: healthLoading,
    error: healthError,
  } = useSystemHealth();

  // Helper function to get activity icon and color
  const getActivityDisplay = (action: string, resourceType: string) => {
    switch (action) {
      case "create":
        if (resourceType === "user")
          return { icon: Users, color: "text-green-600" };
        if (resourceType === "question")
          return { icon: HelpCircle, color: "text-blue-600" };
        if (resourceType === "exam")
          return { icon: BookOpen, color: "text-purple-600" };
        return { icon: CheckCircle, color: "text-green-600" };
      case "update":
        return { icon: Activity, color: "text-orange-600" };
      case "delete":
        return { icon: AlertTriangle, color: "text-red-600" };
      case "view":
        return { icon: Activity, color: "text-blue-600" };
      default:
        return { icon: Database, color: "text-gray-600" };
    }
  };

  // Show error state if critical data fails to load
  if (statsError) {
    return (
      <AdminLayout
        title="Dashboard"
        description="Overview of platform performance and key metrics."
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of platform performance and key metrics."
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
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {stats?.total_users.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats?.new_users_today || 0} new today
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-indigo-100">
                    <Users className="h-6 w-6 text-indigo-600" />
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
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats?.active_users.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      {stats
                        ? Math.round(
                            (stats.active_users / stats.total_users) * 100
                          )
                        : 0}
                      % active
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Activity className="h-6 w-6 text-purple-600" />
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
                      Total Questions
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.total_questions.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {stats?.total_subjects || 0} subjects
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <HelpCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {healthLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      System Health
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {systemHealth?.status === "healthy" ? "99%" : "N/A"}
                    </p>
                    <p className="text-sm text-emerald-600 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {systemHealth?.status || "Unknown"}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-100">
                    <Database className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>System Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Time</span>
                      <span>{systemHealth?.response_time || 0}ms</span>
                    </div>
                    <Progress
                      value={Math.min(
                        (systemHealth?.response_time || 0) / 10,
                        100
                      )}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Uptime</span>
                      <span>{systemHealth?.uptime || "N/A"}</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Error Rate</span>
                      <span>{systemHealth?.error_rate || 0}%</span>
                    </div>
                    <Progress
                      value={systemHealth?.error_rate || 0}
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
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))
                ) : activityError ? (
                  <p className="text-sm text-gray-500">
                    Failed to load activity logs
                  </p>
                ) : activityLogs && activityLogs.length > 0 ? (
                  activityLogs.map((activity, index) => {
                    const { icon: Icon, color } = getActivityDisplay(
                      activity.action,
                      activity.resource_type
                    );
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full bg-gray-100 ${color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.action} {activity.resource_type}
                            {activity.resource_id &&
                              ` (${activity.resource_id.slice(-6)})`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Platform Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-white/20"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/40 rounded-lg border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {stats?.total_exams || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Exams</div>
                  </div>
                </div>
                <div className="p-4 bg-white/40 rounded-lg border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats?.completion_rate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
                <div className="p-4 bg-white/40 rounded-lg border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats?.average_accuracy || 0}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Average Accuracy
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
