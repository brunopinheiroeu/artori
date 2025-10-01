import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Practice from "./pages/Practice";
import Question from "./pages/Question";
import Solutions from "./pages/Solutions";
import DemoLogin from "./pages/DemoLogin";
import DemoPractice from "./pages/DemoPractice";
import DemoTutor from "./pages/DemoTutor";
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
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/demo-practice" element={<DemoPractice />} />
          <Route path="/demo-tutor" element={<DemoTutor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;