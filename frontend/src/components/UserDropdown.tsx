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
  User, 
  LogOut, 
  Calendar, 
  Settings,
  CreditCard,
  BarChart3,
  HelpCircle,
  ChevronDown
} from "lucide-react";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    school?: string;
    role?: string;
  };
  onLogout: () => void;
  variant?: 'artee' | 'school';
  subscriptionTier?: string;
}

const UserDropdown = ({ user, onLogout, variant = 'artee', subscriptionTier = 'Free' }: UserDropdownProps) => {
  const isSchool = variant === 'school';
  const hoverColor = isSchool ? 'hover:text-green-600' : 'hover:text-indigo-600';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`flex items-center space-x-2 text-gray-600 ${hoverColor}`}>
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 backdrop-blur-sm bg-white/90 border-white/20" align="end">
        <DropdownMenuLabel className="font-semibold">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.school && (
              <Badge className={`bg-gradient-to-r ${isSchool ? 'from-green-500 to-blue-500' : 'from-indigo-500 to-purple-500'} text-white text-xs w-fit`}>
                {user.school}{user.role && ` - ${user.role}`}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>{user.role === 'teacher' ? 'Analytics Dashboard' : 'Study Analytics'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{user.role === 'teacher' ? 'Class Schedule' : 'Study Schedule'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>{user.role === 'teacher' ? 'School Plan' : 'Subscription'}</span>
          <Badge className={`ml-auto bg-gradient-to-r ${subscriptionTier === 'Premium' ? 'from-green-500 to-emerald-500' : 'from-green-500 to-emerald-500'} text-white text-xs`}>
            {subscriptionTier}
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>{user.role === 'teacher' ? 'Teacher Resources' : 'Help & Support'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSchool ? 'Exit Demo' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;