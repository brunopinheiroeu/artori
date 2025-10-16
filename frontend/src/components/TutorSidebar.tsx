import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  GraduationCap,
  ChevronDown,
  MessageSquare,
  DollarSign,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useApi";

interface TutorSidebarProps {
  className?: string;
}

const TutorSidebar = ({ className }: TutorSidebarProps) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const handleLogout = () => {
    try {
      // Call the API client logout method to clear tokens and localStorage
      apiClient.logout();

      // Show success message
      toast({
        title: t("tutor:sidebar.loggedOutSuccessfully"),
        description: t("tutor:sidebar.signedOutMessage"),
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("tutor:sidebar.logoutError"),
        description: t("tutor:sidebar.logoutErrorMessage"),
        variant: "destructive",
      });
    }
  };

  // Navigation items for tutors
  const navigation = [
    {
      name: t("tutor:sidebar.dashboard"),
      href: "/tutor",
      icon: LayoutDashboard,
      current: location.pathname === "/tutor",
    },
    {
      name: t("tutor:sidebar.myStudents"),
      href: "/tutor/students",
      icon: Users,
      current: location.pathname.startsWith("/tutor/students"),
    },
    {
      name: t("tutor:sidebar.schedule"),
      href: "/tutor/schedule",
      icon: Calendar,
      current: location.pathname.startsWith("/tutor/schedule"),
    },
    {
      name: t("tutor:sidebar.sessions"),
      href: "/tutor/sessions",
      icon: BookOpen,
      current: location.pathname.startsWith("/tutor/sessions"),
    },
    {
      name: t("tutor:sidebar.messages"),
      href: "/tutor/messages",
      icon: MessageSquare,
      current: location.pathname.startsWith("/tutor/messages"),
    },
    {
      name: t("tutor:sidebar.earnings"),
      href: "/tutor/earnings",
      icon: DollarSign,
      current: location.pathname.startsWith("/tutor/earnings"),
    },
  ];

  // Use real authenticated user data
  const tutorUser = user
    ? {
        name: user.name,
        email: user.email,
        role: "Tutor",
        rating: user.tutor_data?.rating || 0,
        totalSessions: user.tutor_data?.total_sessions || 0,
      }
    : {
        name: "Loading...",
        email: "Loading...",
        role: "Loading...",
        rating: 0,
        totalSessions: 0,
      };

  return (
    <>
      {/* Mobile menu button - repositioned to top-right */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white/90 backdrop-blur-sm shadow-lg border-2"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-emerald-900 to-teal-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-emerald-700">
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
            <div className="ml-3">
              <p className="text-xs text-emerald-300">
                {t("tutor:sidebar.tutorPanel")}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-emerald-200 hover:text-white hover:bg-emerald-800/50"
                )}
                onClick={() => setIsCollapsed(true)} // Close sidebar when clicking nav item
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User dropdown */}
          <div className="border-t border-emerald-700 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-800/50"
                >
                  <GraduationCap className="mr-3 h-5 w-5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{tutorUser.name}</p>
                    <p className="text-xs text-emerald-300">
                      {tutorUser.email}
                    </p>
                    {tutorUser.rating > 0 && (
                      <p className="text-xs text-emerald-300">
                        ⭐ {tutorUser.rating.toFixed(1)} •{" "}
                        {tutorUser.totalSessions} {t("tutor:sidebar.sessions")}
                      </p>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-emerald-800 border-emerald-700 text-white"
                align="end"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{tutorUser.name}</p>
                    <p className="text-xs text-emerald-300">
                      {tutorUser.email}
                    </p>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs w-fit">
                      {tutorUser.role}
                    </Badge>
                    {tutorUser.rating > 0 && (
                      <div className="text-xs text-emerald-300">
                        ⭐ {tutorUser.rating.toFixed(1)}{" "}
                        {t("tutor:sidebar.rating")} • {tutorUser.totalSessions}{" "}
                        {t("tutor:sidebar.sessions")}
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald-700" />

                <DropdownMenuItem
                  className="text-emerald-200 hover:text-white hover:bg-emerald-700"
                  asChild
                >
                  <Link to="/tutor/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("tutor:sidebar.profile")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-emerald-200 hover:text-white hover:bg-emerald-700"
                  asChild
                >
                  <Link to="/tutor/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("tutor:sidebar.settings")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-emerald-700" />

                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 hover:bg-emerald-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("tutor:sidebar.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default TutorSidebar;
