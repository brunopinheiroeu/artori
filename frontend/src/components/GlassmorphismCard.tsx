import { ReactNode } from "react";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
}

const GlassmorphismCard = ({ 
  children, 
  className = "", 
  padding = "p-8" 
}: GlassmorphismCardProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
      <div className={`relative z-10 ${padding}`}>
        {children}
      </div>
    </div>
  );
};

export default GlassmorphismCard;