import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Brain,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Share2,
  Download,
  Lightbulb,
  AlertTriangle,
  Star,
  Award,
  BarChart3,
} from "lucide-react";
import { useExam } from "@/hooks/useApi";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import StatCard from "@/components/StatCard";

const Results = () => {
  const { examId, subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: exam } = useExam(examId);

  // Get results from URL params (in a real app, this would come from the backend)
  const score = parseInt(searchParams.get("score") || "0");
  const totalQuestions = parseInt(searchParams.get("total") || "0");
  const timeSpent = searchParams.get("time") || "0:00";
  const correctAnswers = parseInt(searchParams.get("correct") || "0");
  const incorrectAnswers = totalQuestions - correctAnswers;

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  // Mock detailed results data (in a real app, this would come from the backend)
  const [detailedResults] = useState({
    sessionId: "session_123",
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    endTime: new Date(),
    subject: exam?.subjects?.find((s) => s.id === subjectId)?.name || "Subject",
    performance: {
      grade:
        percentage >= 90
          ? "A"
          : percentage >= 80
          ? "B"
          : percentage >= 70
          ? "C"
          : percentage >= 60
          ? "D"
          : "F",
      percentile: Math.min(95, percentage + Math.floor(Math.random() * 10)),
      improvement: Math.floor(Math.random() * 15) + 5,
    },
    topicBreakdown: [
      { topic: "Algebra", correct: 8, total: 10, percentage: 80 },
      { topic: "Geometry", correct: 6, total: 8, percentage: 75 },
      { topic: "Statistics", correct: 4, total: 6, percentage: 67 },
      { topic: "Trigonometry", correct: 3, total: 4, percentage: 75 },
    ],
    mistakes: [
      {
        questionNumber: 5,
        question: "What is the derivative of f(x) = x² + 3x - 2?",
        yourAnswer: "2x + 3",
        correctAnswer: "2x + 3",
        explanation:
          "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0.",
        topic: "Calculus",
        difficulty: "Medium",
        wasCorrect: true,
      },
      {
        questionNumber: 12,
        question: "Solve for x: 2x + 5 = 13",
        yourAnswer: "x = 3",
        correctAnswer: "x = 4",
        explanation:
          "To solve 2x + 5 = 13, subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4.",
        topic: "Algebra",
        difficulty: "Easy",
        wasCorrect: false,
      },
      {
        questionNumber: 18,
        question: "What is the area of a circle with radius 5?",
        yourAnswer: "25π",
        correctAnswer: "25π",
        explanation:
          "The area of a circle is πr². With radius 5, the area is π × 5² = 25π.",
        topic: "Geometry",
        difficulty: "Easy",
        wasCorrect: true,
      },
      {
        questionNumber: 23,
        question: "Find the mean of the dataset: 2, 4, 6, 8, 10",
        yourAnswer: "5",
        correctAnswer: "6",
        explanation:
          "To find the mean, add all values (2+4+6+8+10 = 30) and divide by the number of values (5). Mean = 30/5 = 6.",
        topic: "Statistics",
        difficulty: "Easy",
        wasCorrect: false,
      },
    ],
    recommendations: [
      {
        area: "Algebra",
        suggestion:
          "Focus on solving linear equations and practice more word problems",
        priority: "High",
        estimatedTime: "2-3 hours",
      },
      {
        area: "Statistics",
        suggestion: "Review measures of central tendency (mean, median, mode)",
        priority: "Medium",
        estimatedTime: "1-2 hours",
      },
      {
        area: "Problem Solving",
        suggestion:
          "Practice reading questions more carefully to avoid calculation errors",
        priority: "Medium",
        estimatedTime: "1 hour",
      },
    ],
  });

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent work! You've mastered this topic.";
    if (percentage >= 80) return "Great job! You're doing very well.";
    if (percentage >= 70) return "Good work! Keep practicing to improve.";
    if (percentage >= 60)
      return "You're on the right track. Focus on weak areas.";
    return "Keep studying! Review the fundamentals and try again.";
  };

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case "A":
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case "B":
        return <Award className="h-8 w-8 text-blue-500" />;
      case "C":
        return <Target className="h-8 w-8 text-green-500" />;
      default:
        return <BookOpen className="h-8 w-8 text-gray-500" />;
    }
  };

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
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Results Header */}
        <div className="text-center mb-12">
          <GlassmorphismCard padding="p-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {getGradeIcon(detailedResults.performance.grade)}
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 text-lg px-4 py-2">
                Test Complete!
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
              >
                Your Results
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {detailedResults.subject} • {exam?.name}
            </p>
            <div className="text-6xl font-bold mb-2">
              <span className={getPerformanceColor(percentage)}>
                {percentage}%
              </span>
            </div>
            <p className="text-lg text-gray-600">
              {getPerformanceMessage(percentage)}
            </p>
          </GlassmorphismCard>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={`${correctAnswers}/${totalQuestions}`}
            label="Questions Correct"
            icon={CheckCircle}
            color="text-green-600"
            trend={{
              value: `${percentage}% accuracy`,
              icon: TrendingUp,
              color: "text-green-600",
            }}
          />
          <StatCard
            value={detailedResults.performance.grade}
            label="Grade"
            icon={Award}
            color="text-blue-600"
            subtext={`${detailedResults.performance.percentile}th percentile`}
          />
          <StatCard
            value={timeSpent}
            label="Time Spent"
            icon={Clock}
            color="text-purple-600"
            subtext="Average pace"
          />
          <StatCard
            value={`+${detailedResults.performance.improvement}%`}
            label="Improvement"
            icon={TrendingUp}
            color="text-emerald-600"
            subtext="From last attempt"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Topic Breakdown */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance by Topic</span>
              </CardTitle>
              <CardDescription>
                See how you performed in different areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedResults.topicBreakdown.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{topic.topic}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {topic.correct}/{topic.total}
                      </span>
                      <Badge
                        className={`${getPerformanceColor(
                          topic.percentage
                        )} bg-transparent border`}
                        variant="outline"
                      >
                        {topic.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={topic.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Study Recommendations */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Study Recommendations</span>
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to improve your performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedResults.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/40 rounded-lg border border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rec.area}</h4>
                    <Badge
                      variant={
                        rec.priority === "High" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.suggestion}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Estimated time: {rec.estimatedTime}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Question Review */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Question Review</span>
            </CardTitle>
            <CardDescription>
              Review your answers and learn from mistakes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {detailedResults.mistakes.map((mistake, index) => (
                <AccordionItem key={index} value={`question-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-3">
                      {mistake.wasCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <span className="font-medium">
                          Question {mistake.questionNumber}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {mistake.topic}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              mistake.difficulty === "Easy"
                                ? "border-green-500 text-green-600"
                                : mistake.difficulty === "Medium"
                                ? "border-yellow-500 text-yellow-600"
                                : "border-red-500 text-red-600"
                            }`}
                          >
                            {mistake.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Question:</h4>
                        <p className="text-gray-700">{mistake.question}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`p-4 rounded-lg border-2 ${
                            mistake.wasCorrect
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <h4 className="font-medium mb-2 flex items-center">
                            {mistake.wasCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            Your Answer:
                          </h4>
                          <p
                            className={
                              mistake.wasCorrect
                                ? "text-green-700"
                                : "text-red-700"
                            }
                          >
                            {mistake.yourAnswer}
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Correct Answer:
                          </h4>
                          <p className="text-green-700">
                            {mistake.correctAnswer}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Brain className="h-4 w-4 text-blue-500 mr-2" />
                          AI Explanation:
                        </h4>
                        <p className="text-blue-700">{mistake.explanation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/question/${examId}/${subjectId}`}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg px-8"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Practice Again
            </Button>
          </Link>
          <Link to="/practice">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-indigo-200 hover:bg-indigo-50 px-8"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-green-200 hover:bg-green-50 px-8"
          >
            <Star className="h-5 w-5 mr-2" />
            Study Weak Areas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
