import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GradientButton from "./GradientButton";

interface ExamCardProps {
  name: string;
  country: string;
  description: string;
  flag: string;
  gradient: string;
  borderColor: string;
  bgColor: string;
  subjects?: string[];
  totalQuestions?: number;
  onSelect?: () => void;
  buttonText?: string;
}

const ExamCard = ({
  name,
  country,
  description,
  flag,
  gradient,
  borderColor,
  bgColor,
  subjects,
  totalQuestions,
  onSelect,
  buttonText = "Start Practicing"
}: ExamCardProps) => {
  return (
    <Card 
      className={`hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${borderColor} ${bgColor} backdrop-blur-sm bg-white/60 hover:scale-105`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription className="text-lg">{country}</CardDescription>
          </div>
          <div className="text-4xl">{flag}</div>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
              <div className="flex flex-wrap gap-2">
                {subjects.slice(0, 3).map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{subjects.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {totalQuestions && (
            <div className="text-sm text-gray-600">
              {totalQuestions} practice questions available
            </div>
          )}
          
          <GradientButton 
            gradient={gradient}
            className="w-full"
            onClick={onSelect}
          >
            {buttonText}
          </GradientButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamCard;