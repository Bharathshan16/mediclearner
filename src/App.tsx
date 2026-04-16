

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Index = lazy(() => import("./pages/Index"));
const DiabetesPrediction = lazy(() => import("./pages/DiabetesPrediction"));
const HeartDiseasePrediction = lazy(() => import("./pages/HeartDiseasePrediction"));
const LungCancerPrediction = lazy(() => import("./pages/LungCancerPrediction"));
const StrokeRiskPrediction = lazy(() => import("./pages/StrokeRiskPrediction"));
const ChatbotService = lazy(() => import("./pages/ChatbotService"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

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
