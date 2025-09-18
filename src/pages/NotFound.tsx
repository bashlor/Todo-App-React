
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="h-20 w-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-muted-foreground mb-8">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Aller au tableau de bord</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
