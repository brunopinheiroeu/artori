import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Award,
  Flame,
  Star,
  BarChart3,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { format, addDays, subDays, differenceInDays } from "date-fns";
import { useTranslation } from "react-i18next";

const StudentGoals = () => {
  const { t } = useTranslation("student");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Mock goals data - in a real app, this would come from an API
  const goals = [
    {
      id: "1",
      title: "Master Calculus Integration",
      description:
        "Complete all integration techniques and solve 100 practice problems",
      category: "Academic",
      subject: "Mathematics",
      priority: "high",
      status: "in-progress",
      progress: 75,
      targetDate: addDays(new Date(), 14),
      createdDate: subDays(new Date(), 21),
      milestones: [
        { id: "m1", title: "Learn integration by parts", completed: true },
        { id: "m2", title: "Master substitution method", completed: true },
        {
          id: "m3",
          title: "Practice trigonometric integrals",
          completed: true,
        },
        { id: "m4", title: "Solve 50 mixed problems", completed: false },
        { id: "m5", title: "Complete final assessment", completed: false },
      ],
      reward: "Treat myself to a nice dinner",
    },
    {
      id: "2",
      title: "Improve Physics Problem Solving",
      description: "Achieve 90% accuracy on quantum mechanics problems",
      category: "Academic",
      subject: "Physics",
      priority: "high",
      status: "in-progress",
      progress: 60,
      targetDate: addDays(new Date(), 30),
      createdDate: subDays(new Date(), 10),
      milestones: [
        { id: "m6", title: "Review wave-particle duality", completed: true },
        { id: "m7", title: "Practice Schrödinger equation", completed: true },
        {
          id: "m8",
          title: "Solve uncertainty principle problems",
          completed: false,
        },
        {
          id: "m9",
          title: "Master quantum tunneling concepts",
          completed: false,
        },
        { id: "m10", title: "Take practice exam", completed: false },
      ],
      reward: "Buy new physics textbook",
    },
    {
      id: "3",
      title: "Complete Chemistry Lab Reports",
      description: "Submit all 8 organic chemistry lab reports with A grades",
      category: "Academic",
      subject: "Chemistry",
      priority: "medium",
      status: "in-progress",
      progress: 50,
      targetDate: addDays(new Date(), 45),
      createdDate: subDays(new Date(), 15),
      milestones: [
        { id: "m11", title: "Complete synthesis lab report", completed: true },
        { id: "m12", title: "Finish spectroscopy analysis", completed: true },
        { id: "m13", title: "Submit kinetics experiment", completed: true },
        { id: "m14", title: "Complete thermodynamics lab", completed: true },
        { id: "m15", title: "Finish remaining 4 reports", completed: false },
      ],
      reward: "Weekend trip with friends",
    },
    {
      id: "4",
      title: "Daily Study Streak",
      description: "Maintain a 30-day consecutive study streak",
      category: "Habit",
      subject: "General",
      priority: "medium",
      status: "in-progress",
      progress: 80,
      targetDate: addDays(new Date(), 6),
      createdDate: subDays(new Date(), 24),
      milestones: [
        { id: "m16", title: "Complete first week", completed: true },
        { id: "m17", title: "Reach 14-day streak", completed: true },
        { id: "m18", title: "Achieve 21-day milestone", completed: true },
        { id: "m19", title: "Maintain consistency", completed: false },
        { id: "m20", title: "Celebrate 30-day achievement", completed: false },
      ],
      reward: "New study setup upgrade",
    },
    {
      id: "5",
      title: "Exam Preparation Schedule",
      description: "Follow structured study plan for final exams",
      category: "Academic",
      subject: "General",
      priority: "high",
      status: "completed",
      progress: 100,
      targetDate: subDays(new Date(), 5),
      createdDate: subDays(new Date(), 60),
      milestones: [
        { id: "m21", title: "Create study schedule", completed: true },
        { id: "m22", title: "Complete all practice tests", completed: true },
        { id: "m23", title: "Review weak areas", completed: true },
        { id: "m24", title: "Final review sessions", completed: true },
        { id: "m25", title: "Take all exams", completed: true },
      ],
      reward: "Vacation after exams ✈️",
    },
    {
      id: "6",
      title: "Learn Advanced Biology Concepts",
      description: "Master molecular biology and genetics for upcoming course",
      category: "Academic",
      subject: "Biology",
      priority: "low",
      status: "not-started",
      progress: 0,
      targetDate: addDays(new Date(), 90),
      createdDate: new Date(),
      milestones: [
        { id: "m26", title: "Study DNA replication", completed: false },
        { id: "m27", title: "Learn protein synthesis", completed: false },
        { id: "m28", title: "Understand gene regulation", completed: false },
        { id: "m29", title: "Practice genetics problems", completed: false },
        { id: "m30", title: "Complete final project", completed: false },
      ],
      reward: "Biology field trip",
    },
  ];

  // Mock achievements data
  const achievements = [
    {
      id: "a1",
      title: "First Goal Completed",
      description: "Completed your first study goal",
      icon: Trophy,
      unlockedDate: subDays(new Date(), 30),
      category: "milestone",
    },
    {
      id: "a2",
      title: "Study Streak Master",
      description: "Maintained a 21-day study streak",
      icon: Flame,
      unlockedDate: subDays(new Date(), 3),
      category: "habit",
    },
    {
      id: "a3",
      title: "Math Wizard",
      description: "Solved 100 calculus problems",
      icon: Zap,
      unlockedDate: subDays(new Date(), 7),
      category: "subject",
    },
    {
      id: "a4",
      title: "Perfect Score",
      description: "Achieved 100% on a practice test",
      icon: Star,
      unlockedDate: subDays(new Date(), 14),
      category: "performance",
    },
  ];

  const activeGoals = goals.filter((g) => g.status === "in-progress");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const notStartedGoals = goals.filter((g) => g.status === "not-started");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return t("goals.high");
      case "medium":
        return t("goals.medium");
      case "low":
        return t("goals.low");
      default:
        return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("goals.completed");
      case "in-progress":
        return t("goals.inProgress");
      case "not-started":
        return t("goals.notStarted");
      default:
        return status.replace("-", " ");
    }
  };

  const GoalCard = ({ goal }: { goal: (typeof goals)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {goal.subject}
              </Badge>
              <Badge className={getPriorityColor(goal.priority)}>
                {getPriorityText(goal.priority)}
              </Badge>
              <Badge className={getStatusColor(goal.status)}>
                {getStatusText(goal.status)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {goal.progress}%
            </div>
            <div className="text-xs text-gray-600">{t("goals.completed")}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t("goals.progress")}</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>
                {t("goals.dueDate")}: {format(goal.targetDate, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="h-3 w-3" />
              <span>
                {differenceInDays(goal.targetDate, new Date())} days left
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              {t("goals.milestones")} (
              {goal.milestones.filter((m) => m.completed).length}/
              {goal.milestones.length})
            </div>
            <div className="space-y-1">
              {goal.milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  {milestone.completed ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-gray-400" />
                  )}
                  <span
                    className={
                      milestone.completed
                        ? "text-green-700 line-through"
                        : "text-gray-600"
                    }
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
              {goal.milestones.length > 3 && (
                <div className="text-xs text-gray-500 ml-5">
                  +{goal.milestones.length - 3} {t("goals.milestones")}
                </div>
              )}
            </div>
          </div>

          {goal.reward && (
            <div className="p-2 bg-yellow-50 rounded-lg">
              <div className="text-xs font-medium text-yellow-800 mb-1">
                🎁 {t("goals.reward")}:
              </div>
              <div className="text-sm text-yellow-700">{goal.reward}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const AchievementCard = ({
    achievement,
  }: {
    achievement: (typeof achievements)[0];
  }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
      <CardContent className="p-4 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
          <achievement.icon className="h-6 w-6 text-white" />
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">
          {achievement.title}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
        <div className="text-xs text-gray-500">
          Unlocked {format(achievement.unlockedDate, "MMM d, yyyy")}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <StudentLayout
      title={t("goals.title")}
      description={t("goals.description")}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">
                {activeGoals.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("goals.activeGoals")}
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {completedGoals.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("goals.completed")}
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  activeGoals.reduce((sum, g) => sum + g.progress, 0) /
                    activeGoals.length || 0
                )}
                %
              </div>
              <div className="text-sm text-gray-600">{t("goals.progress")}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {achievements.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("goals.achievements")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="backdrop-blur-sm bg-white/60 border-white/20">
              <TabsTrigger value="active">
                {t("goals.activeGoals")} ({activeGoals.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                {t("goals.completedGoals")} ({completedGoals.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                {t("goals.allGoals")} ({goals.length})
              </TabsTrigger>
              <TabsTrigger value="achievements">
                {t("goals.achievements")} ({achievements.length})
              </TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("goals.createGoal")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("goals.createGoal")}</DialogTitle>
                  <DialogDescription>
                    {t("goals.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      {t("goals.title")}
                    </label>
                    <Input placeholder={t("goals.title")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("common.description", { defaultValue: "Description" })}
                    </label>
                    <Textarea
                      placeholder={t("common.description", {
                        defaultValue: "Description",
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {t("common.subject", { defaultValue: "Subject" })}
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t("goals.selectSubject")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {t("goals.priority")}
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("goals.selectPriority")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            {t("goals.high")}
                          </SelectItem>
                          <SelectItem value="medium">
                            {t("goals.medium")}
                          </SelectItem>
                          <SelectItem value="low">{t("goals.low")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("goals.dueDate")}
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t("goals.reward")}
                    </label>
                    <Input placeholder={t("goals.reward")} />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                    {t("goals.createGoal")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="active">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
            {activeGoals.length === 0 && (
              <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("goals.activeGoals")}
                  </h3>
                  <p className="text-gray-600">{t("goals.description")}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>
                    {t("goals.achievements")} {t("goals.progress")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {t("dashboard.studyStreak")} (25{" "}
                        {t("dashboard.daysInRow", { defaultValue: "days" })})
                      </span>
                      <span>
                        24/25{" "}
                        {t("dashboard.daysInRow", { defaultValue: "days" })}
                      </span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {t("dashboard.questionsSolved")} (200{" "}
                        {t("dashboard.questions", { defaultValue: "problems" })}
                        )
                      </span>
                      <span>
                        156/200{" "}
                        {t("dashboard.questions", { defaultValue: "problems" })}
                      </span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subject Master (5 subjects)</span>
                      <span>3/5 subjects</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentGoals;
