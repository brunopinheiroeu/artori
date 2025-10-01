import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuestions, useSubmitAnswer } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import type { AnswerResponse } from "@/lib/api";

const Question = () => {
  const { examId, modeId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);

  const { data: questions, isLoading } = useQuestions(examId, modeId);
  const submitAnswerMutation = useSubmitAnswer();

  const currentQ = questions?.[currentQuestion];
  const totalQuestions = questions?.length || 0;
  const progress =
    totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

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

    try {
      const result = await submitAnswerMutation.mutateAsync({
        questionId: currentQ.id,
        answer: selectedAnswer,
      });

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
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const isCorrect = answerResult?.correct || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/practice" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Artee
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/solutions"
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Schools</span>
            </Link>
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
              Question {currentQuestion + 1} of {totalQuestions}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            >
              Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
            </Badge>
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
                  disabled={!selectedAnswer || submitAnswerMutation.isPending}
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
                  disabled={currentQuestion >= totalQuestions - 1}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg px-8"
                >
                  {currentQuestion >= totalQuestions - 1
                    ? "🎉 Complete"
                    : "Next Question →"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Explainable AI Response */}
        {showExplanation && (
          <Card className="border-2 border-indigo-200 backdrop-blur-sm bg-white/60 shadow-xl">
            <CardHeader>
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
      </div>
    </div>
  );
};

export default Question;
