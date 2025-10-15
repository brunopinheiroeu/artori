import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StudentSidebar from "./StudentSidebar";
import Footer from "./Footer";
import LanguageSelector from "./LanguageSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useApi";
import { isAuthenticated } from "@/lib/api";
import { AlertTriangle, GraduationCap, LogOut } from "lucide-react";

interface StudentLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const StudentLayout = ({
  children,
  title,
  description,
}: StudentLayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Check if user has selected an exam - if not, redirect to exam selection
    if (user && !user.selected_exam_id) {
      navigate("/practice");
      return;
    }
  }, [navigate, user]);

  // Check if user is student (not admin or tutor)
  const isStudent = user && (user.role === "student" || !user.role);

  // Show loading state while checking user data
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if user is not student (but allow access for now)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("common.accessDenied")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("common.studentAccessDeniedMessage")}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                {t("common.returnToHome")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  navigate("/login");
                }}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("common.signIn")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render student layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <StudentSidebar />

      {/* Main content with proper mobile spacing */}
      <div className="lg:ml-64">
        <div className="px-4 py-8 lg:px-8 pt-20 lg:pt-8">
          {/* Language selector in top right */}
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>

          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-slate-600">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default StudentLayout;
