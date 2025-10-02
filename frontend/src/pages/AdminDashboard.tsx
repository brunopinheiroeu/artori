import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

const AdminDashboard = () => {
  // Mock dashboard data
  const stats = {
    totalUsers: 15247,
    activeUsers: 8934,
    totalExams: 8,
    totalQuestions: 12456,
    totalSubjects: 42,
    systemHealth: 98,
    avgResponseTime: 245,
    errorRate: 0.02,
  };

  const recentActivity = [
    {
      type: "user_signup",
      message: "New user registered: alex.johnson@email.com",
      time: "2 minutes ago",
      icon: Users,
      color: "text-green-600",
    },
    {
      type: "question_added",
      message: "25 new SAT Math questions added",
      time: "15 minutes ago",
      icon: HelpCircle,
      color: "text-blue-600",
    },
    {
      type: "exam_completed",
      message: "Student completed ENEM practice test",
      time: "32 minutes ago",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      type: "system_alert",
      message: "Database backup completed successfully",
      time: "1 hour ago",
      icon: Database,
      color: "text-orange-600",
    },
  ];

  const examStats = [
    { name: "SAT", users: 4521, questions: 1247, completion: 68 },
    { name: "ENEM", users: 3892, questions: 2156, completion: 72 },
    { name: "A-levels", users: 2134, questions: 1456, completion: 65 },
    { name: "Leaving Cert", users: 1876, questions: 1123, completion: 71 },
    { name: "Selectividad", users: 1654, questions: 967, completion: 69 },
  ];

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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {stats.totalUsers.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                    active
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Questions
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalQuestions.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {stats.totalSubjects} subjects
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <HelpCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    System Health
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {stats.systemHealth}%
                  </p>
                  <p className="text-sm text-emerald-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All systems operational
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100">
                  <Database className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
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
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Response Time</span>
                  <span>{stats.avgResponseTime}ms</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>System Health</span>
                  <span>{stats.systemHealth}%</span>
                </div>
                <Progress value={stats.systemHealth} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Error Rate</span>
                  <span>{stats.errorRate}%</span>
                </div>
                <Progress value={stats.errorRate} className="h-2" />
              </div>
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
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Performance */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Exam Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examStats.map((exam, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-white/20"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{exam.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exam.users.toLocaleString()} users •{" "}
                        {exam.questions.toLocaleString()} questions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">
                      {exam.completion}%
                    </div>
                    <div className="text-sm text-gray-600">avg completion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
