import { Brain, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  variant?: "artori" | "school";
  schoolName?: string;
  schoolColors?: string;
  backLink?: string;
  children?: React.ReactNode;
}

const AppHeader = ({
  variant = "artori",
  schoolName,
  schoolColors = "from-indigo-500 to-purple-600",
  backLink = "/",
  children,
}: AppHeaderProps) => {
  const isSchool = variant === "school";
  const logoGradient = isSchool ? "from-green-500 to-blue-600" : schoolColors;
  const textGradient = isSchool
    ? "from-green-600 to-blue-600"
    : "from-indigo-600 to-purple-600";
  const brandName = schoolName || "artori.app";
  const LogoIcon = isSchool ? GraduationCap : Brain;

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link to={backLink} className="flex items-center space-x-2">
          {isSchool ? (
            <>
              <div
                className={`p-2 rounded-xl bg-gradient-to-r ${logoGradient} shadow-lg`}
              >
                <LogoIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}
                >
                  {brandName}
                </span>
                <p className="text-xs text-gray-500">Powered by artori.app</p>
              </div>
            </>
          ) : (
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
          )}
        </Link>

        {children && (
          <div className="flex items-center space-x-4">{children}</div>
        )}
      </nav>
    </header>
  );
};

export default AppHeader;
