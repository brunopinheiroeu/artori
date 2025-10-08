import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Target,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Zap,
  Brain,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

const StudentProgress = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  // Fetch dashboard data for progress information
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["studentProgress"],
    queryFn: () => apiClient.getDashboard(),
  });

  // Mock detailed progress data
  const progressData = {
    weeklyStats: [
      { week: "Week 1", questionsAnswered: 45, accuracy: 78, studyTime: 8.5 },
      { week: "Week 2", questionsAnswered: 62, accuracy: 82, studyTime: 12.2 },
      { week: "Week 3", questionsAnswered: 58, accuracy: 85, studyTime: 10.8 },
      { week: "Week 4", questionsAnswered: 71, accuracy: 88, studyTime: 14.5 },
    ],
    subjectBreakdown: [
      {
        subject: "Mathematics",
        progress: 85,
        questionsAnswered: 156,
        accuracy: 87,
        timeSpent: 25.5,
      },
      {
        subject: "Physics",
        progress: 72,
        questionsAnswered: 98,
        accuracy: 82,
        timeSpent: 18.2,
      },
      {
        subject: "Chemistry",
        progress: 68,
        questionsAnswered: 87,
        accuracy: 79,
        timeSpent: 15.8,
      },
      {
        subject: "Biology",
        progress: 91,
        questionsAnswered: 134,
        accuracy: 91,
        timeSpent: 22.3,
      },
    ],
    strengths: [
      { topic: "Algebra", accuracy: 94, confidence: "High" },
      { topic: "Cell Biology", accuracy: 92, confidence: "High" },
      { topic: "Organic Chemistry", accuracy: 89, confidence: "Medium" },
    ],
    weaknesses: [
      { topic: "Calculus", accuracy: 65, confidence: "Low" },
      { topic: "Thermodynamics", accuracy: 68, confidence: "Low" },
      { topic: "Genetics", accuracy: 72, confidence: "Medium" },
    ],
    studyStreak: 12,
    totalStudyTime: 82.3,
    questionsAnswered: 475,
    averageAccuracy: 84,
  };

  return (
    <StudentLayout
      title="Study Progress"
      description="Track your learning journey and identify areas for improvement."
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Study Streak
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {progressData.studyStreak}
                  </p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Days in a row
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Study Time
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {progressData.totalStudyTime}h
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    This month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Questions Answered
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {progressData.questionsAnswered}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Total solved
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Accuracy
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {progressData.averageAccuracy}%
                  </p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    Great job!
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="backdrop-blur-sm bg-white/60 border-white/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="strengths">
                Strengths & Weaknesses
              </TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white/60 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Weekly Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.weeklyStats.map((week, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{week.week}</span>
                          <span className="text-gray-600">
                            {week.questionsAnswered} questions
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Accuracy: </span>
                            <span className="font-medium">
                              {week.accuracy}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Study Time: </span>
                            <span className="font-medium">
                              {week.studyTime}h
                            </span>
                          </div>
                        </div>
                        <Progress value={week.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">🔥</div>
                      <div>
                        <p className="font-medium">12-Day Study Streak</p>
                        <p className="text-sm text-gray-600">Keep it up!</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <p className="font-medium">90% Accuracy in Biology</p>
                        <p className="text-sm text-gray-600">
                          Excellent performance!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl">📚</div>
                      <div>
                        <p className="font-medium">500 Questions Milestone</p>
                        <p className="text-sm text-gray-600">You're on fire!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressData.subjectBreakdown.map((subject, index) => (
                <Card
                  key={index}
                  className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {subject.subject}
                      </CardTitle>
                      <Badge variant="outline">
                        {subject.progress}% Complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {subject.questionsAnswered}
                        </div>
                        <div className="text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {subject.accuracy}%
                        </div>
                        <div className="text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">
                          {subject.timeSpent}h
                        </div>
                        <div className="text-gray-600">Time Spent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strengths">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <Star className="h-5 w-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.strengths.map((strength, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{strength.topic}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            {strength.confidence}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Accuracy</span>
                          <span>{strength.accuracy}%</span>
                        </div>
                        <Progress value={strength.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <Brain className="h-5 w-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.weaknesses.map((weakness, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{weakness.topic}</h4>
                          <Badge className="bg-orange-100 text-orange-800">
                            {weakness.confidence}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Accuracy</span>
                          <span>{weakness.accuracy}%</span>
                        </div>
                        <Progress value={weakness.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Detailed Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're working on advanced analytics and trend visualization
                    to help you track your progress over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentProgress;
