
import SignupForm from "@/components/SignupForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SignupPage = () => {
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
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
