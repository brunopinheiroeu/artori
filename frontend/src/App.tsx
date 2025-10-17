import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load all page components for code-splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Practice = lazy(() => import("./pages/Practice"));
const Question = lazy(() => import("./pages/Question"));
const Results = lazy(() => import("./pages/Results"));
const Solutions = lazy(() => import("./pages/Solutions"));
const DemoLogin = lazy(() => import("./pages/DemoLogin"));
const DemoPractice = lazy(() => import("./pages/DemoPractice"));
const DemoTutor = lazy(() => import("./pages/DemoTutor"));

// Admin pages - typically larger components
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminExams = lazy(() => import("./pages/AdminExams"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminProfile = lazy(() => import("./pages/AdminProfile"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminHelp = lazy(() => import("./pages/AdminHelp"));

// Tutor pages - typically larger components
const TutorDashboard = lazy(() => import("./pages/TutorDashboard"));
const TutorProfile = lazy(() => import("./pages/TutorProfile"));
const TutorStudents = lazy(() => import("./pages/TutorStudents"));
const TutorSchedule = lazy(() => import("./pages/TutorSchedule"));
const TutorSessions = lazy(() => import("./pages/TutorSessions"));
const TutorMessages = lazy(() => import("./pages/TutorMessages"));
const TutorEarnings = lazy(() => import("./pages/TutorEarnings"));

// Student pages - typically larger components
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const StudentProgress = lazy(() => import("./pages/StudentProgress"));
const StudentTutors = lazy(() => import("./pages/StudentTutors"));
const StudentSchedule = lazy(() => import("./pages/StudentSchedule"));
const StudentMessages = lazy(() => import("./pages/StudentMessages"));
const StudentGoals = lazy(() => import("./pages/StudentGoals"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/question/:examId/:modeId" element={<Question />} />
            <Route path="/results/:examId/:modeId" element={<Results />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/demo-login" element={<DemoLogin />} />
            <Route path="/demo-practice" element={<DemoPractice />} />
            <Route path="/demo-tutor" element={<DemoTutor />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/exams" element={<AdminExams />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/help" element={<AdminHelp />} />
            <Route path="/tutor" element={<TutorDashboard />} />
            <Route path="/tutor/profile" element={<TutorProfile />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/schedule" element={<TutorSchedule />} />
            <Route path="/tutor/sessions" element={<TutorSessions />} />
            <Route path="/tutor/messages" element={<TutorMessages />} />
            <Route path="/tutor/earnings" element={<TutorEarnings />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/tutors" element={<StudentTutors />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/goals" element={<StudentGoals />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
