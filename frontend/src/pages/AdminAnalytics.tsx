import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

const AdminAnalytics = () => {
  const metrics = {
    totalUsers: 15247,
    activeUsers: 8934,
    newUsersToday: 127,
    totalSessions: 45678,
    avgSessionTime: "12m 34s",
    bounceRate: 23.4,
    conversionRate: 4.2,
    systemUptime: 99.8,
  };

  const topExams = [
    { name: "SAT", users: 4521, growth: 12.3, color: "bg-blue-500" },
    { name: "ENEM", users: 3892, growth: 8.7, color: "bg-green-500" },
    { name: "A-levels", users: 2134, growth: -2.1, color: "bg-purple-500" },
    { name: "Leaving Cert", users: 1876, growth: 15.2, color: "bg-orange-500" },
    { name: "Selectividad", users: 1654, growth: 6.8, color: "bg-red-500" },
  ];

  const recentActivity = [
    { type: "success", message: "Database backup completed", time: "5 min ago", icon: CheckCircle },
    { type: "warning", message: "High CPU usage detected", time: "12 min ago", icon: AlertTriangle },
    { type: "info", message: "New feature deployed", time: "1 hour ago", icon: Activity },
    { type: "success", message: "Security scan passed", time: "2 hours ago", icon: CheckCircle },
  ];

  const geographicData = [
    { country: "United States", users: 5234, percentage: 34.3 },
    { country: "Brazil", users: 3892, percentage: 25.5 },
    { country: "United Kingdom", users: 2134, percentage: 14.0 },
    { country: "Ireland", users: 1876, percentage: 12.3 },
    { country: "Spain", users: 1654, percentage: 10.8 },
    { country: "Others", users: 457, percentage: 3.1 },
  ];

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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {metrics.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% active
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {metrics.avgSessionTime}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% improvement
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {metrics.systemUptime}%
                  </p>
                  <p className="text-sm text-emerald-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Excellent
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
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
              <div className="space-y-4">
                {topExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${exam.color}`}></div>
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-sm text-gray-600">{exam.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${
                        exam.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {exam.growth > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{Math.abs(exam.growth)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {geographicData.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{country.country}</span>
                      <span className="text-gray-600">{country.users.toLocaleString()} ({country.percentage}%)</span>
                    </div>
                    <Progress value={country.percentage} className="h-2" />
                  </div>
                ))}
              </div>
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/40 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.type === 'success' ? 'default' :
                    activity.type === 'warning' ? 'destructive' : 'secondary'
                  }>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;