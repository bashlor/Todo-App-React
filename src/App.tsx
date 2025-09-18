import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

// Landing page and auth pages
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Main app pages
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Import the auth service
import authService from "./services/auth/auth";

const queryClient = new QueryClient();

// Protected route component to check authentication
const ProtectedRoute = () => {
  const location = useLocation();
  // Use state to manage authentication status for reactivity
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initial state null to indicate loading

  useEffect(() => {
    // Check initial auth state
    authService.isAuthenticated().then(setIsAuthenticated);

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Update state based on user object
      if (!user) {
        console.log(
          "User not authenticated (onAuthStateChanged), redirecting from:",
          location.pathname
        );
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [location]); // location dependency might be optional here, depending on desired re-check behavior

  // Show loading or a placeholder while checking auth
  if (isAuthenticated === null) {
    return <div>Loading authentication status...</div>; // Or a spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />;
};

// Check if user is already logged in and redirect from auth pages if needed
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Use state to manage authentication status for reactivity
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initial state null

  useEffect(() => {
    // Check initial auth state
    authService.isAuthenticated().then(setIsAuthenticated);

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []); // Empty dependency array, runs once on mount and cleans up on unmount

  // Show children or loading state while checking auth
  if (isAuthenticated === null) {
    // Potentially show children immediately for auth pages or a loader
    // Depending on UX preference, you might not want a loader here
    // For now, let's proceed as before if still loading, but this can be adjusted.
    // Or, return a loading indicator: return <div>Checking auth...</div>;
  }

  if (isAuthenticated) {
    // If user is already logged in and tries to access login/signup pages, redirect to dashboard
    console.log("User authenticated, redirecting from auth page:", location.pathname);
    return <Navigate to='/dashboard' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position='top-right' closeButton richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<LandingPage />} />
          <Route
            path='/login'
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/tasks' element={<TasksPage />} />
            {/* We'll implement these routes later */}
            <Route path='/inbox' element={<TasksPage />} />
            <Route path='/category/:categoryId' element={<TasksPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>

          {/* Catch-all for unknown routes */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
