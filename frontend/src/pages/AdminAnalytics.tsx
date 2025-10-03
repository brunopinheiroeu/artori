import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Globe,
  Activity,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  useAdminDashboardStats,
  useAdminActivityLogs,
  useSystemHealth,
  useUserAnalytics,
} from "@/hooks/useAdminApi";
import { formatDistanceToNow } from "date-fns";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminDashboardStats();

  const {
    data: userAnalytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useUserAnalytics();

  const {
    data: systemHealth,
    isLoading: healthLoading,
    error: healthError,
  } = useSystemHealth();

  const {
    data: activityLogs,
    isLoading: activityLoading,
    error: activityError,
  } = useAdminActivityLogs(10, 0);

  // Helper function to get activity icon and color
  const getActivityDisplay = (action: string, resourceType: string) => {
    switch (action) {
      case "create":
        return { icon: CheckCircle, type: "success" };
      case "update":
        return { icon: Activity, type: "info" };
      case "delete":
        return { icon: AlertTriangle, type: "warning" };
      case "view":
        return { icon: Activity, type: "info" };
      default:
        return { icon: Activity, type: "info" };
    }
  };

  // Show error state if critical data fails to load
  if (statsError || analyticsError) {
    return (
      <AdminLayout
        title="Advanced Analytics"
        description="Detailed insights and performance metrics for the platform."
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Advanced Analytics"
      description="Detailed insights and performance metrics for the platform."
    >
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select defaultValue="7d">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

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
                      {dashboardStats?.total_users.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {dashboardStats?.new_users_today || 0} new today
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
                    <p className="text-3xl font-bold text-green-600">
                      {dashboardStats?.active_users.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      {dashboardStats
                        ? Math.round(
                            (dashboardStats.active_users /
                              dashboardStats.total_users) *
                              100
                          )
                        : 0}
                      % active
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              {analyticsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      User Retention
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {userAnalytics?.user_retention_rate.toFixed(1) || 0}%
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Excellent retention
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
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
                      {systemHealth?.status === "healthy" ? "99.9%" : "N/A"}
                    </p>
                    <p className="text-sm text-emerald-600 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {systemHealth?.status || "Unknown"}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-100">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Exams */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Top Performing Exams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/40 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Total Exams</p>
                        <p className="text-sm text-gray-600">
                          {dashboardStats?.total_exams || 0} exams
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">
                        {dashboardStats?.total_exams || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Total Questions</p>
                        <p className="text-sm text-gray-600">
                          {dashboardStats?.total_questions.toLocaleString() ||
                            0}{" "}
                          questions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {dashboardStats?.total_questions || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="font-medium">Completion Rate</p>
                        <p className="text-sm text-gray-600">
                          Average completion rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        {dashboardStats?.completion_rate || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Geographic Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : userAnalytics?.geographic_distribution ? (
                <div className="space-y-4">
                  {Object.entries(userAnalytics.geographic_distribution).map(
                    ([country, users], index) => {
                      const percentage =
                        (users / userAnalytics.total_users) * 100;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{country}</span>
                            <span className="text-gray-600">
                              {users.toLocaleString()} ({percentage.toFixed(1)}
                              %)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No geographic data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent System Activity */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent System Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg"
                  >
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : activityError ? (
                <p className="text-center text-gray-500">
                  Failed to load activity logs
                </p>
              ) : activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((activity, index) => {
                  const { icon: Icon, type } = getActivityDisplay(
                    activity.action,
                    activity.resource_type
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          type === "success"
                            ? "bg-green-100 text-green-600"
                            : type === "warning"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.action} {activity.resource_type}
                          {activity.resource_id &&
                            ` (${activity.resource_id.slice(-6)})`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          type === "success"
                            ? "default"
                            : type === "warning"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {type}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
