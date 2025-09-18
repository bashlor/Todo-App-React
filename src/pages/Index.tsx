
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return <LandingPage />;
};

export default Index;
