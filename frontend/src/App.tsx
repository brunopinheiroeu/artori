import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Practice from "./pages/Practice";
import Question from "./pages/Question";
import Results from "./pages/Results";
import Solutions from "./pages/Solutions";
import DemoLogin from "./pages/DemoLogin";
import DemoPractice from "./pages/DemoPractice";
import DemoTutor from "./pages/DemoTutor";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExams from "./pages/AdminExams";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminHelp from "./pages/AdminHelp";
import TutorDashboard from "./pages/TutorDashboard";
import TutorProfile from "./pages/TutorProfile";
import TutorStudents from "./pages/TutorStudents";
import TutorSchedule from "./pages/TutorSchedule";
import TutorSessions from "./pages/TutorSessions";
import TutorMessages from "./pages/TutorMessages";
import TutorEarnings from "./pages/TutorEarnings";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentProgress from "./pages/StudentProgress";
import StudentTutors from "./pages/StudentTutors";
import StudentSchedule from "./pages/StudentSchedule";
import StudentMessages from "./pages/StudentMessages";
import StudentGoals from "./pages/StudentGoals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
