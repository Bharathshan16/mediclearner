
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import HeartDiseasePrediction from "./pages/HeartDiseasePrediction";
import LungCancerPrediction from "./pages/LungCancerPrediction";
import StrokeRiskPrediction from "./pages/StrokeRiskPrediction";
import ChatbotService from "./pages/ChatbotService";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/diabetes" element={<ProtectedRoute><DiabetesPrediction /></ProtectedRoute>} />
            <Route path="/heart" element={<ProtectedRoute><HeartDiseasePrediction /></ProtectedRoute>} />
            <Route path="/lung" element={<ProtectedRoute><LungCancerPrediction /></ProtectedRoute>} />
            <Route path="/stroke" element={<ProtectedRoute><StrokeRiskPrediction /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotService /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
