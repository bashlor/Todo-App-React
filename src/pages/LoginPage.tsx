
import LoginForm from "@/components/LoginForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="container max-w-6xl py-8 flex justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft size={16} />
            Retour
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
