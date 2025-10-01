import { Brain, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  variant?: "artori" | "school";
  schoolName?: string;
  schoolColors?: string;
}

const Footer = ({
  variant = "artori",
  schoolName,
  schoolColors,
}: FooterProps) => {
  const isSchool = variant === "school";
  const logoGradient = schoolColors || "from-indigo-500 to-purple-600";
  const textGradient = schoolColors || "from-indigo-600 to-purple-600";
  const brandName = schoolName || "artori.app";
  const LogoIcon = isSchool ? GraduationCap : Brain;

  return (
    <footer className="container mx-auto px-4 py-12 border-t border-white/20 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div
            className={`p-2 rounded-xl bg-gradient-to-r ${logoGradient} shadow-lg`}
          >
            <LogoIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span
              className={`text-xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}
            >
              {brandName}
            </span>
            {isSchool && (
              <p className="text-xs text-gray-500">Powered by artori.app</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-6 text-gray-600">
          <Link
            to="/solutions"
            className={`hover:text-${
              isSchool ? "green" : "indigo"
            }-600 transition-colors`}
          >
            {isSchool ? "About" : "Schools"}
          </Link>
          <Link
            to="/about"
            className={`hover:text-${
              isSchool ? "green" : "indigo"
            }-600 transition-colors`}
          >
            {isSchool ? "Privacy" : "About"}
          </Link>
          <Link
            to="/privacy"
            className={`hover:text-${
              isSchool ? "green" : "indigo"
            }-600 transition-colors`}
          >
            Privacy
          </Link>
          <Link
            to="/contact"
            className={`hover:text-${
              isSchool ? "green" : "indigo"
            }-600 transition-colors`}
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-500">
        © 2025 {brandName}. {isSchool ? "Powered by artori.app - " : ""}
        Responsible AI for better learning. 🌟
      </div>
    </footer>
  );
};

export default Footer;
