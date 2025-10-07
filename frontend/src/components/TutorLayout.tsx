import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TutorSidebar from "./TutorSidebar";
import Footer from "./Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useApi";
import { isAuthenticated } from "@/lib/api";
import { AlertTriangle, GraduationCap, LogOut } from "lucide-react";

interface TutorLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const TutorLayout = ({ children, title, description }: TutorLayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Check if user is tutor based on user role
  const isTutor = user && user.role === "tutor";

  // Show loading state while checking user data
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
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

  // Show access denied if user is not tutor
  if (!user || !isTutor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Card className="w-96 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the tutor panel. Please
              contact your administrator if you believe this is an error.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Return to Home
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
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render tutor layout if user has tutor role
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <TutorSidebar />

      {/* Main content with proper mobile spacing */}
      <div className="lg:ml-64">
        <div className="px-4 py-8 lg:px-8 pt-20 lg:pt-8">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-teal-600 bg-clip-text text-transparent">
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

export default TutorLayout;
