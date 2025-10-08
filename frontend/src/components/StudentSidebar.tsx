import { useState } from "react";
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
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
  GraduationCap,
  ChevronDown,
  Settings,
  Target,
  Clock,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useApi";

interface StudentSidebarProps {
  className?: string;
}

const StudentSidebar = ({ className }: StudentSidebarProps) => {
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
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Navigation items for students
  const navigation = [
    {
      name: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      current: location.pathname === "/student",
    },
    {
      name: "Study Progress",
      href: "/student/progress",
      icon: BarChart3,
      current: location.pathname.startsWith("/student/progress"),
    },
    {
      name: "Practice",
      href: "/practice",
      icon: BookOpen,
      current:
        location.pathname.startsWith("/practice") ||
        location.pathname.startsWith("/question") ||
        location.pathname.startsWith("/results"),
    },
    {
      name: "Find Tutors",
      href: "/student/tutors",
      icon: Users,
      current: location.pathname.startsWith("/student/tutors"),
    },
    {
      name: "Schedule",
      href: "/student/schedule",
      icon: Calendar,
      current: location.pathname.startsWith("/student/schedule"),
    },
    {
      name: "Messages",
      href: "/student/messages",
      icon: MessageSquare,
      current: location.pathname.startsWith("/student/messages"),
    },
    {
      name: "Study Goals",
      href: "/student/goals",
      icon: Target,
      current: location.pathname.startsWith("/student/goals"),
    },
  ];

  // Use real authenticated user data
  const studentUser = user
    ? {
        name: user.name,
        email: user.email,
        role: "Student",
        examName: "Selected Exam", // Will be populated from dashboard data
        studyStreak: 0, // Will be populated from dashboard data
        totalStudyTime: 0, // Will be populated from dashboard data
      }
    : {
        name: "Loading...",
        email: "Loading...",
        role: "Loading...",
        examName: "Loading...",
        studyStreak: 0,
        totalStudyTime: 0,
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-blue-700">
            <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
            <div className="ml-3">
              <p className="text-xs text-blue-300">Student Portal</p>
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-blue-200 hover:text-white hover:bg-blue-800/50"
                )}
                onClick={() => setIsCollapsed(true)} // Close sidebar when clicking nav item
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User dropdown */}
          <div className="border-t border-blue-700 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-blue-200 hover:text-white hover:bg-blue-800/50"
                >
                  <GraduationCap className="mr-3 h-5 w-5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{studentUser.name}</p>
                    <p className="text-xs text-blue-300">{studentUser.email}</p>
                    {studentUser.studyStreak > 0 && (
                      <p className="text-xs text-blue-300">
                        🔥 {studentUser.studyStreak} day streak
                      </p>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-blue-800 border-blue-700 text-white"
                align="end"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{studentUser.name}</p>
                    <p className="text-xs text-blue-300">{studentUser.email}</p>
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs w-fit">
                      {studentUser.role}
                    </Badge>
                    <div className="text-xs text-blue-300 mt-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-3 w-3" />
                        <span>{studentUser.examName}</span>
                      </div>
                      {studentUser.studyStreak > 0 && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{studentUser.totalStudyTime}h studied</span>
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-blue-700" />

                <DropdownMenuItem
                  className="text-blue-200 hover:text-white hover:bg-blue-700"
                  asChild
                >
                  <Link to="/student/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-blue-200 hover:text-white hover:bg-blue-700"
                  asChild
                >
                  <Link to="/student/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-blue-700" />

                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 hover:bg-blue-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
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

export default StudentSidebar;
