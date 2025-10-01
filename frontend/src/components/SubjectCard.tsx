import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "./GradientButton";

interface SubjectCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: number;
  progress: number;
  duration?: string;
  day?: string;
  gradient: string;
  bgColor: string;
  examId: string;
  buttonText?: string;
  progressLabel?: string;
}

const SubjectCard = ({
  id,
  name,
  description,
  icon,
  questions,
  progress,
  duration,
  day,
  gradient,
  bgColor,
  examId,
  buttonText = "Continue Studying",
  progressLabel = "Progress"
}: SubjectCardProps) => {
  return (
    <Card 
      className={`hover:shadow-2xl transition-all duration-300 cursor-pointer ${bgColor} backdrop-blur-sm bg-white/60 border-white/20 hover:scale-105`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-3xl">{icon}</div>
          <Badge variant="outline" className="text-xs">
            {duration || day}
          </Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{progressLabel}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>{questions} {questions === 1 ? 'question' : 'questions'}</span>
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{Math.floor(Math.random() * 10) + 1}% this week
            </span>
          </div>
          
          <Link to={`/question/${examId}/${id}`}>
            <GradientButton 
              gradient={gradient}
              className="w-full"
            >
              {buttonText}
            </GradientButton>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;