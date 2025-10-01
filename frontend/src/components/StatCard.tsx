import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string | number;
  label: string;
  subtext?: string;
  icon?: LucideIcon;
  color?: string;
  trend?: {
    value: string;
    icon: LucideIcon;
    color: string;
  };
}

const StatCard = ({ value, label, subtext, icon: Icon, color = "text-indigo-600", trend }: StatCardProps) => {
  return (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
      <CardContent className="p-6 text-center">
        {Icon && (
          <div className="flex justify-center mb-2">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        )}
        <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
        {subtext && (
          <div className="text-xs text-gray-500 mt-1">{subtext}</div>
        )}
        {trend && (
          <div className={`text-xs ${trend.color} flex items-center justify-center mt-1`}>
            <trend.icon className="h-3 w-3 mr-1" />
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;