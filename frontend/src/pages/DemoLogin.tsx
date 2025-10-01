import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, Mail, Lock, Eye, EyeOff, Users, BarChart3 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const DemoLogin = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for demo
    localStorage.setItem('demoUser', JSON.stringify({ 
      email, 
      name: selectedRole === 'student' ? 'Alex Johnson' : 'Ms. Sarah Wilson',
      role: selectedRole,
      school: 'Riverside Academy'
    }));
    
    if (selectedRole === 'student') {
      navigate('/demo-practice');
    } else {
      navigate('/demo-tutor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <Link to="/solutions" className="flex items-center space-x-2">
          <ArrowLeft className="h-5 w-5" />
          <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Riverside Academy
            </span>
            <p className="text-xs text-gray-500">Powered by Artee</p>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>
          
          <Card className="relative z-10 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome to Riverside Academy
                </span>
              </CardTitle>
              <CardDescription>
                Experience our AI-powered learning platform
              </CardDescription>
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 text-xs">
                🎯 Demo Environment
              </Badge>
            </CardHeader>
            
            <CardContent>
              {/* Role Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Choose your role:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedRole === 'student' 
                        ? 'border-2 border-green-500 bg-green-50/80' 
                        : 'border border-gray-200 hover:border-gray-300 bg-white/40'
                    }`}
                    onClick={() => setSelectedRole('student')}
                  >
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="font-medium text-sm">Student</p>
                      <p className="text-xs text-gray-600">Practice & Learn</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedRole === 'teacher' 
                        ? 'border-2 border-blue-500 bg-blue-50/80' 
                        : 'border border-gray-200 hover:border-gray-300 bg-white/40'
                    }`}
                    onClick={() => setSelectedRole('teacher')}
                  >
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium text-sm">Teacher</p>
                      <p className="text-xs text-gray-600">Manage & Monitor</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={selectedRole === 'student' ? 'alex.johnson@riverside.edu' : 'sarah.wilson@riverside.edu'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter demo password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-white/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className={`w-full shadow-lg ${
                    selectedRole === 'student' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  }`}
                  size="lg"
                >
                  {selectedRole === 'student' ? '🎓 Enter as Student' : '👩‍🏫 Enter as Teacher'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  💡 This is a demo environment
                </p>
                <p className="text-xs text-gray-500">
                  Use any email and password to explore the platform
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            🏫 Experience whitelabeled Artee platform
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;