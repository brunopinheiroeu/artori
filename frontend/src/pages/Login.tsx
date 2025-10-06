import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Check, X, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useSignup } from "@/hooks/useApi";
import { apiClient, type User } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// Password validation functions
interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

const validatePasswordStrength = (
  password: string
): { requirements: PasswordRequirements; isValid: boolean } => {
  const requirements: PasswordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { requirements, isValid };
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  // Password strength validation for signup
  const passwordValidation = useMemo(() => {
    if (isLogin || !password) {
      return {
        requirements: {
          length: false,
          uppercase: false,
          number: false,
          special: false,
        } as PasswordRequirements,
        isValid: true,
      };
    }
    return validatePasswordStrength(password);
  }, [password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login logic
        const authResponse = await loginMutation.mutateAsync({
          email,
          password,
        });

        // Ensure the API client has the new token
        apiClient.token = authResponse.access_token;

        // Add a small delay to ensure token is properly set
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Check user role and redirect accordingly
        try {
          // Add a longer delay to ensure token is properly set
          await new Promise((resolve) => setTimeout(resolve, 500));

          const user = await apiClient.getCurrentUser();
          console.log("User data after login:", user); // Debug log
          const userRole = user?.role || "student";
          console.log("User role:", userRole); // Debug log

          if (["admin", "super_admin"].includes(userRole)) {
            toast({
              title: "Admin login successful",
              description: "Welcome to the admin panel!",
            });
            navigate("/admin");
          } else {
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            navigate("/practice");
          }
        } catch (roleError) {
          console.error("Role check failed:", roleError);
          // Try one more time with a longer delay
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const user = await apiClient.getCurrentUser();
            const userRole = user?.role || "student";

            if (["admin", "super_admin"].includes(userRole)) {
              toast({
                title: "Admin login successful",
                description: "Welcome to the admin panel!",
              });
              navigate("/admin");
            } else {
              toast({
                title: "Login successful",
                description: "Welcome back!",
              });
              navigate("/practice");
            }
          } catch (finalError) {
            console.error("Final role check failed:", finalError);
            // Final fallback to practice page
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            navigate("/practice");
          }
        }
      } else {
        // Signup logic
        if (!name.trim()) {
          toast({
            title: "Error",
            description: "Name is required",
            variant: "destructive",
          });
          return;
        }

        // Check password strength before submitting
        if (!passwordValidation.isValid) {
          toast({
            title: "Password Requirements Not Met",
            description: "Please ensure your password meets all requirements",
            variant: "destructive",
          });
          return;
        }

        await signupMutation.mutateAsync({ name, email, password });
        toast({
          title: "Account created",
          description: "Welcome to artori.app!",
        });
        navigate("/practice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">artori</span>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin
                ? "Sign in to continue your study journey"
                : "Join thousands of students studying smarter"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Requirements for Signup */}
                {!isLogin && password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordValidation.requirements.length ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            passwordValidation.requirements.length
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.requirements.uppercase ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            passwordValidation.requirements.uppercase
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.requirements.number ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            passwordValidation.requirements.number
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          One number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.requirements.special ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            passwordValidation.requirements.special
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          One special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white"
                disabled={
                  isLoading || (!isLogin && !passwordValidation.isValid)
                }
              >
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                  ? "Sign in"
                  : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Forgot your password?
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Badge className="bg-gray-100 text-gray-700 border-0">
            Join 50,000+ students studying smarter
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Login;