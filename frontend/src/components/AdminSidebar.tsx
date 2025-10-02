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
  Users,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ChevronDown,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Exams",
      href: "/admin/exams",
      icon: BookOpen,
      current: location.pathname.startsWith("/admin/exams"),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname.startsWith("/admin/users"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
    },
  ];

  // Mock admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@artori.app",
    role: "Super Admin",
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-slate-700">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                artori.app
              </span>
              <p className="text-xs text-slate-400">Admin Panel</p>
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
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
                onClick={() => setIsCollapsed(true)} // Close sidebar when clicking nav item
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User dropdown */}
          <div className="border-t border-slate-700 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <User className="mr-3 h-5 w-5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{adminUser.name}</p>
                    <p className="text-xs text-slate-400">{adminUser.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-slate-800 border-slate-700 text-white"
                align="end"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{adminUser.name}</p>
                    <p className="text-xs text-slate-400">{adminUser.email}</p>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs w-fit">
                      {adminUser.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />

                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" asChild>
                  <Link to="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" asChild>
                  <Link to="/admin/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700" asChild>
                  <Link to="/admin/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-slate-700">
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

export default AdminSidebar;