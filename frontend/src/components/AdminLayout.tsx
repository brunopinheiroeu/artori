import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminSidebar from "./AdminSidebar";
import Footer from "./Footer";
import LanguageSelector from "./LanguageSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useApi";
import { isAuthenticated } from "@/lib/api";
import { AlertTriangle, Shield, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Check if user is admin based on user role
  const isAdmin =
    user && ["admin", "super_admin"].includes(user.role || "student");

  // Show loading state while checking user data
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
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

  // Show access denied if user is not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("common.accessDenied")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("common.tutorAccessDeniedMessage")}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
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
                {t("common.signOut")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin layout if user has admin role
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminSidebar />

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
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

export default AdminLayout;
