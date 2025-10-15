import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Target,
  MessageSquare,
  Building2,
  Pause,
  Play,
  Square,
  Clock,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useQuestions,
  useSubmitAnswer,
  useAIExplanation,
} from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import type { AnswerResponse } from "@/lib/api";
import { AITutorChat } from "@/components/AITutorChat";

const Question = () => {
  const { examId, modeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Exam setup from URL parameters
  const examSetup = {
    questionCount: parseInt(searchParams.get("questions") || "20"),
    difficulty: searchParams.get("difficulty") || "mixed",
    timeLimit: searchParams.get("timeLimit") || "unlimited",
    mode: searchParams.get("mode") || "practice",
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [sessionStartTime] = useState(new Date());
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Array<{
      questionIndex: number;
      selectedAnswer: string;
      correct: boolean;
      timeSpent: number;
    }>
  >([]);
  const [showAITutorChat, setShowAITutorChat] = useState(false);

  // Timer and pause functionality
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    examSetup.timeLimit === "unlimited"
      ? null
      : parseInt(examSetup.timeLimit) * 60
  );
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const { data: questions, isLoading } = useQuestions(examId, modeId);
  const submitAnswerMutation = useSubmitAnswer();
  const aiExplanationMutation = useAIExplanation();

  // Limit questions based on setup
  const limitedQuestions = questions?.slice(0, examSetup.questionCount) || [];
  const currentQ = limitedQuestions[currentQuestion];
  const totalQuestions = limitedQuestions.length;
  const progress =
    totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || isPaused || showExplanation) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up!
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isPaused, showExplanation]);

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Your exam time has expired. Submitting your answers...",
      variant: "destructive",
    });

    // Auto-submit and go to results
    const sessionEndTime = new Date();
    const totalTimeSpent = Math.floor(
      (sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000
    );
    const minutes = Math.floor(totalTimeSpent / 60);
    const seconds = totalTimeSpent % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const resultsParams = new URLSearchParams({
      score: score.toString(),
      total: totalQuestions.toString(),
      correct: score.toString(),
      time: timeString,
      timeUp: "true",
    });

    navigate(`/results/${examId}/${modeId}?${resultsParams.toString()}`);
  };

  const handlePauseExam = () => {
    setIsPaused(true);
    setShowPauseDialog(true);
  };

  const handleResumeExam = () => {
    setIsPaused(false);
    setShowPauseDialog(false);
  };

  const handleStopExam = () => {
    setShowStopDialog(true);
  };

  const handleConfirmStop = () => {
    // Save progress and redirect to practice
    toast({
      title: "Exam Stopped",
      description: "Your progress has been saved. You can resume later.",
    });
    navigate("/practice");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            No questions available for this subject.
          </p>
          <Link to="/practice">
            <Button className="mt-4">Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Question not found.</p>
          <Link to="/practice">
            <Button className="mt-4">Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQ) return;

    const questionStartTime = Date.now();

    try {
      const result = await submitAnswerMutation.mutateAsync({
        questionId: currentQ.id,
        answer: selectedAnswer,
      });

      const timeSpent = Date.now() - questionStartTime;

      // Track this answer
      const answerRecord = {
        questionIndex: currentQuestion,
        selectedAnswer,
        correct: result.correct,
        timeSpent,
      };

      setAnsweredQuestions((prev) => [...prev, answerRecord]);
      setAnswerResult(result);

      if (result.correct) {
        setScore(score + 1);
      }
      setShowExplanation(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswerResult(null);
    } else {
      // Test is complete - redirect to results page
      const sessionEndTime = new Date();
      const totalTimeSpent = Math.floor(
        (sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000
      );
      const minutes = Math.floor(totalTimeSpent / 60);
      const seconds = totalTimeSpent % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      // Calculate final score
      const finalScore = score + (answerResult?.correct ? 1 : 0);

      // Redirect to results page with query parameters
      const resultsParams = new URLSearchParams({
        score: finalScore.toString(),
        total: totalQuestions.toString(),
        correct: finalScore.toString(),
        time: timeString,
      });

      console.log(
        "Redirecting to results with params:",
        resultsParams.toString()
      );
      navigate(`/results/${examId}/${modeId}?${resultsParams.toString()}`);
    }
  };

  const isCorrect = answerResult?.correct || false;
  const isLastQuestion = currentQuestion >= totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/practice" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            {/* Timer */}
            {timeRemaining !== null && (
              <Badge
                variant="outline"
                className={`bg-white/50 backdrop-blur-sm ${
                  timeRemaining < 300 ? "border-red-500 text-red-700" : ""
                }`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}

            {/* Exam Mode Badge */}
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              {examSetup.mode === "practice" ? "Practice Mode" : "Exam Mode"}
            </Badge>

            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Question {currentQuestion + 1} of {totalQuestions}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            >
              Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
            </Badge>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              {!isPaused ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseExam}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResumeExam}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleStopExam}
                className="bg-white/50 backdrop-blur-sm hover:bg-red-50"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-2xl border border-white/20"></div>
            <div className="relative z-10 p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-bold text-indigo-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-white/50" />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 border-blue-200">
                  Subject
                </Badge>
                <Badge variant="default">Practice</Badge>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all backdrop-blur-sm ${
                    selectedAnswer === option.id
                      ? showExplanation
                        ? option.id === answerResult?.correct_answer
                          ? "border-green-500 bg-green-50/80"
                          : "border-red-500 bg-red-50/80"
                        : "border-indigo-500 bg-indigo-50/80"
                      : showExplanation &&
                        option.id === answerResult?.correct_answer
                      ? "border-green-500 bg-green-50/80"
                      : "border-gray-200 hover:border-gray-300 bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() =>
                    !showExplanation && handleAnswerSelect(option.id)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.id
                          ? showExplanation
                            ? option.id === answerResult?.correct_answer
                              ? "border-green-500 bg-green-500"
                              : "border-red-500 bg-red-500"
                            : "border-indigo-500 bg-indigo-500"
                          : showExplanation &&
                            option.id === answerResult?.correct_answer
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {showExplanation &&
                        (selectedAnswer === option.id ? (
                          option.id === answerResult?.correct_answer ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <XCircle className="h-4 w-4 text-white" />
                          )
                        ) : option.id === answerResult?.correct_answer ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : null)}
                    </div>
                    <span className="font-medium">
                      {option.id.toUpperCase()}.
                    </span>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={
                    !selectedAnswer ||
                    submitAnswerMutation.isPending ||
                    isPaused
                  }
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg px-8"
                >
                  {submitAnswerMutation.isPending
                    ? "Submitting..."
                    : "Submit Answer"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={isPaused}
                  size="lg"
                  className={`shadow-lg px-8 ${
                    isLastQuestion
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  }`}
                >
                  {isLastQuestion ? "🎉 View Results" : "Next Question →"}
                </Button>
              )}
            </div>

            {/* Pause Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                  <Pause className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Exam Paused
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Click resume to continue your exam
                  </p>
                  <Button
                    onClick={handleResumeExam}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explainable AI Response - Only in Practice Mode */}
        {showExplanation && examSetup.mode === "practice" && (
          <Card className="border-2 border-indigo-200 backdrop-blur-sm bg-white/60 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    AI Explanation
                  </CardTitle>
                  {isCorrect ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                      ✅ Correct!
                    </Badge>
                  ) : (
                    <Badge variant="destructive">❌ Incorrect</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAITutorChat(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                >
                  AI Tutor
                </Button>
              </div>
              <CardDescription>
                Here's how I arrived at the answer, step by step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reasoning Steps */}
              <div className="bg-yellow-50/80 backdrop-blur-sm p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">
                    Step-by-Step Reasoning
                  </h3>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  {answerResult?.explanation?.reasoning?.map(
                    (step: string, index: number) => (
                      <li key={index}>{step}</li>
                    )
                  )}
                </ol>
              </div>

              <Separator />

              {/* Concept Explanation */}
              <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Key Concept</h3>
                </div>
                <p className="text-gray-700">
                  {answerResult?.explanation?.concept}
                </p>
              </div>

              <Separator />

              {/* Bias Check */}
              <Alert className="bg-orange-50/80 backdrop-blur-sm border-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <strong className="text-orange-800">Bias Check:</strong>
                  <span className="text-gray-700 ml-1">
                    {answerResult?.explanation?.bias_check}
                  </span>
                </AlertDescription>
              </Alert>

              {/* Reflection Prompt */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-900">
                    💭 Reflection
                  </h3>
                </div>
                <p className="text-indigo-800">
                  {answerResult?.explanation?.reflection}
                </p>
              </div>

              {/* Sources */}
              <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                <h3 className="font-semibold mb-2 text-gray-800">
                  📚 Sources & References
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {answerResult?.explanation?.sources?.map(
                    (source: string, index: number) => (
                      <li key={index}>{source}</li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pause Dialog */}
        <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Pause className="h-5 w-5 text-blue-600" />
                <span>Exam Paused</span>
              </DialogTitle>
              <DialogDescription>
                Your exam is paused. Take your time and resume when ready.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Current Progress
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>
                    📝 Question {currentQuestion + 1} of {totalQuestions}
                  </div>
                  <div>
                    🎯 Score: {score}/
                    {currentQuestion + (showExplanation ? 1 : 0)}
                  </div>
                  {timeRemaining !== null && (
                    <div>⏱️ Time remaining: {formatTime(timeRemaining)}</div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleResumeExam}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Exam
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStopExam}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stop Confirmation Dialog */}
        <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Square className="h-5 w-5 text-red-600" />
                <span>Stop Exam?</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to stop the exam? Your progress will be
                saved.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Your Progress</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <div>
                    📝 Completed: {currentQuestion + (showExplanation ? 1 : 0)}{" "}
                    of {totalQuestions} questions
                  </div>
                  <div>🎯 Current Score: {score} correct answers</div>
                  <div>💾 Progress will be saved for later</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStopDialog(false)}
                  className="flex-1"
                >
                  Continue Exam
                </Button>
                <Button
                  onClick={handleConfirmStop}
                  variant="destructive"
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Exit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Tutor Chat */}
        <AITutorChat
          isOpen={showAITutorChat}
          onClose={() => setShowAITutorChat(false)}
          question={{
            id: currentQ.id,
            question: currentQ.question,
            options: currentQ.options,
            correct_answer: answerResult?.correct_answer || "",
          }}
          selectedAnswer={selectedAnswer}
        />
      </div>
    </div>
  );
};

export default Question;
