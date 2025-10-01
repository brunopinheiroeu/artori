import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  bgColor: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient, bgColor }: FeatureCardProps) => {
  return (
    <Card className={`hover:shadow-2xl transition-all duration-300 ${bgColor} backdrop-blur-sm bg-white/60 border-white/20 hover:scale-105`}>
      <CardHeader className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;