import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  gradient?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const GradientButton = ({ 
  children, 
  gradient = "from-indigo-500 to-purple-600", 
  size = "default",
  variant = "default",
  onClick,
  className = "",
  disabled = false,
  type = "button"
}: GradientButtonProps) => {
  const baseClasses = variant === "outline" 
    ? "border-2 border-indigo-200 hover:bg-indigo-50" 
    : `bg-gradient-to-r ${gradient} hover:shadow-lg transition-all`;
  
  const hoverClasses = variant === "default" 
    ? gradient.replace("500", "600").replace("600", "700")
    : "";

  return (
    <Button
      size={size}
      variant={variant === "outline" ? "outline" : "default"}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${variant === "default" ? baseClasses : baseClasses} ${className}`}
    >
      {children}
    </Button>
  );
};

export default GradientButton;