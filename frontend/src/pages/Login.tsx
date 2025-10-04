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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Check, X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-5 w-5" />
          <img src="/artori-logo.png" alt="Artori" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl"></div>

          <Card className="relative z-10 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <img
                  src="/artori-logo.png"
                  alt="Artori"
                  className="h-10 w-auto rounded-full"
                />
              </div>
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {isLogin ? "Welcome Back!" : "Join artori.app"}
                </span>
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Sign in to continue your study journey"
                  : "Create your account to start practicing"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/50 backdrop-blur-sm border-white/20"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements for Signup */}
                  {!isLogin && password && (
                    <div className="mt-3 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
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
                            One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                  size="lg"
                  disabled={
                    isLoading || (!isLogin && !passwordValidation.isValid)
                  }
                >
                  {isLoading
                    ? isLogin
                      ? "Signing In..."
                      : "Creating Account..."
                    : isLogin
                    ? "🚀 Sign In"
                    : "✨ Create Account"}
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
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
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
        </div>

        <div className="mt-8 text-center">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            🎯 Join 50,000+ students already studying smarter!
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Login;
