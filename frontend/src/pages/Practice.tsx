import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Settings,
  Clock,
  Brain,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useExams, useExam, useSetUserExam } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import StudentLayout from "@/components/StudentLayout";

const Practice = () => {
  const { t } = useTranslation("practice");
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: exams, isLoading: examsLoading } = useExams();
  const { data: selectedExamData } = useExam(user?.selected_exam_id);
  const setUserExamMutation = useSetUserExam();
  const hasSelectedExam = !!user?.selected_exam_id;
  const isNewUser = !hasSelectedExam;

  // Exam setup state
  const [examSetup, setExamSetup] = useState({
    questionCount: "20",
    difficulty: "mixed",
    timeLimit: "unlimited",
    mode: "practice",
  });

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

  const handleExamSelection = async (examId: string) => {
    try {
      await setUserExamMutation.mutateAsync(examId);
      toast({
        title: t("examSelected"),
        description: t("canStartPracticing"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("failedToSelectExam"),
        variant: "destructive",
      });
    }
  };

  const handleStartExam = (examId: string, subjectId: string) => {
    // Create URL with exam setup parameters
    const params = new URLSearchParams({
      questions: examSetup.questionCount,
      difficulty: examSetup.difficulty,
      timeLimit: examSetup.timeLimit,
      mode: examSetup.mode,
    });

    navigate(`/question/${examId}/${subjectId}?${params.toString()}`);

    toast({
      title: t("examStarted"),
      description: `${t("startingSession")} ${examSetup.mode} ${t(
        "sessionWith"
      )} ${examSetup.questionCount} ${t("questions")}`,
    });
  };

  if (authLoading || examsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If user hasn't selected an exam, show exam selection without sidebar
  if (!hasSelectedExam || isNewUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
            </Link>
          </nav>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Exam Selection */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  👋 {t("welcome")} {user.name}!
                </Badge>
                <h1 className="text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t("chooseYourExam")}
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  {t("selectExamDescription")}
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
                        {t("subjects")}:
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
                      {t("questionsAvailable", {
                        count: exam.total_questions || 0,
                      })}
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${
                        exam.gradient || "from-blue-500 to-purple-500"
                      } hover:shadow-lg transition-all`}
                    >
                      {t("startPreparation")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If user has selected an exam, show practice content with sidebar
  return (
    <StudentLayout title={t("title")} description={t("description")}>
      <div className="space-y-6">
        {/* Dynamic Dashboard */}
        {dashboardData && (
          <>
            <div className="text-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-3xl">
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
                  <h1 className="text-4xl font-bold mb-4">
                    <span
                      className={`bg-gradient-to-r ${
                        dashboardData.selected_exam.gradient ||
                        "from-blue-600 to-purple-600"
                      } bg-clip-text text-transparent`}
                    >
                      {t("practiceSessions")}
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600">
                    {t("continuePreparation", {
                      examName: dashboardData.selected_exam.name,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {t("overallProgress")}
                    </CardTitle>
                    <CardDescription>
                      {t("performanceAcrossSections")}
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
                        {t("complete")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">89</div>
                      <div className="text-xs text-gray-600">
                        {t("daysLeft")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress
                  value={dashboardData.user_progress?.overall_progress || 0}
                  className="h-3 mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-indigo-600">
                      {dashboardData.user_progress?.questions_solved || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("questionsSolved")}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {dashboardData.user_progress
                        ? Math.round(dashboardData.user_progress.accuracy_rate)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("accuracyRate")}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {dashboardData.user_progress?.study_time_hours || 0}h
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("studyTime")}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {dashboardData.user_progress?.current_streak_days || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("dayStreak")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                        <div className="text-3xl">{subject.icon || "📚"}</div>
                        <Badge variant="outline" className="text-xs">
                          {subject.duration || "N/A"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{t("progress")}</span>
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
                            {subject.total_questions || 0} {t("questions")}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {subjectProgress
                              ? Math.round(subjectProgress.accuracy_rate)
                              : 0}
                            % {t("accuracy")}
                          </span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className={`w-full bg-gradient-to-r ${
                                subject.gradient ||
                                "from-blue-500 to-purple-500"
                              } hover:shadow-lg transition-all`}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              {t("continueStudying")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Brain className="h-5 w-5 text-indigo-600" />
                                <span>{t("setupPracticeSession")}</span>
                              </DialogTitle>
                              <DialogDescription>
                                {t("customizeSession")} {subject.name}{" "}
                                {t("practiceSession")}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                              {/* Number of Questions */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="questionCount"
                                  className="text-sm font-medium"
                                >
                                  {t("numberOfQuestions")}
                                </Label>
                                <Select
                                  value={examSetup.questionCount}
                                  onValueChange={(value) =>
                                    setExamSetup({
                                      ...examSetup,
                                      questionCount: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">
                                      {t("5QuestionsQuick")}
                                    </SelectItem>
                                    <SelectItem value="10">
                                      {t("10Questions")}
                                    </SelectItem>
                                    <SelectItem value="20">
                                      {t("20QuestionsRecommended")}
                                    </SelectItem>
                                    <SelectItem value="30">
                                      {t("30Questions")}
                                    </SelectItem>
                                    <SelectItem value="50">
                                      {t("50QuestionsFullTest")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Difficulty Level */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="difficulty"
                                  className="text-sm font-medium"
                                >
                                  {t("difficultyLevel")}
                                </Label>
                                <Select
                                  value={examSetup.difficulty}
                                  onValueChange={(value) =>
                                    setExamSetup({
                                      ...examSetup,
                                      difficulty: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>{t("easy")}</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>{t("medium")}</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="hard">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>{t("hard")}</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="mixed">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                                        <span>{t("mixedRecommended")}</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Time Limit */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="timeLimit"
                                  className="text-sm font-medium"
                                >
                                  {t("timeLimit")}
                                </Label>
                                <Select
                                  value={examSetup.timeLimit}
                                  onValueChange={(value) =>
                                    setExamSetup({
                                      ...examSetup,
                                      timeLimit: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unlimited">
                                      <div className="flex items-center space-x-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{t("noTimeLimit")}</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="30">
                                      {t("30Minutes")}
                                    </SelectItem>
                                    <SelectItem value="45">
                                      {t("45Minutes")}
                                    </SelectItem>
                                    <SelectItem value="60">
                                      {t("1Hour")}
                                    </SelectItem>
                                    <SelectItem value="90">
                                      {t("1Point5Hours")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Practice Mode */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="mode"
                                  className="text-sm font-medium"
                                >
                                  {t("practiceMode")}
                                </Label>
                                <Select
                                  value={examSetup.mode}
                                  onValueChange={(value) =>
                                    setExamSetup({ ...examSetup, mode: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="practice">
                                      <div className="flex items-center space-x-2">
                                        <BookOpen className="h-3 w-3" />
                                        <span>
                                          {t("practiceModeWithExplanations")}
                                        </span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="exam">
                                      <div className="flex items-center space-x-2">
                                        <Zap className="h-3 w-3" />
                                        <span>
                                          {t("examModeTimedNoExplanations")}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Separator />

                              {/* Summary */}
                              <div className="bg-indigo-50 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-900 mb-2">
                                  {t("sessionSummary")}
                                </h4>
                                <div className="text-sm text-indigo-700 space-y-1">
                                  <div>
                                    📝 {examSetup.questionCount}{" "}
                                    {t("questions")}
                                  </div>
                                  <div>
                                    🎯 {examSetup.difficulty} {t("difficulty")}
                                  </div>
                                  <div>
                                    ⏱️{" "}
                                    {examSetup.timeLimit === "unlimited"
                                      ? t("noTimeLimit")
                                      : `${examSetup.timeLimit} ${t(
                                          "minutes"
                                        )}`}
                                  </div>
                                  <div>
                                    🧠{" "}
                                    {examSetup.mode === "practice"
                                      ? t("practiceModeWithAI")
                                      : t("examModeTimed")}
                                  </div>
                                </div>
                              </div>

                              <Button
                                onClick={() =>
                                  handleStartExam(
                                    dashboardData.selected_exam.id,
                                    subject.id
                                  )
                                }
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                size="lg"
                              >
                                <Target className="h-4 w-4 mr-2" />
                                {t("startPracticeSession")}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">
                    {t("fullPracticeTest")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t("takeCompleteTest")} {dashboardData.selected_exam.name}{" "}
                    {t("underTimedConditions")}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t("startPracticeTest")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t("smartReview")}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t("reviewWrongQuestions")}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t("startReview")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/60 border-white/20 hover:shadow-xl transition-all cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t("studyPlan")}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t("viewPersonalizedSchedule")}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t("viewSchedule")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default Practice;
