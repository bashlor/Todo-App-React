import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../services/auth/auth";

export interface AuthFormState {
  email: string;
  password: string;
  isLoading: boolean;
}

interface SignupFormState extends AuthFormState {
  name: string;
  confirmPassword: string;
}

// Hook pour la connexion
export const useLogin = () => {
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
    isLoading: false,
  });
  const navigate = useNavigate();

  const handleChange = (field: keyof AuthFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formState;

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await authService.login({ email, password });
      if (user) {
        toast.success("Connexion réussie!");
        navigate("/dashboard");
      } else {
        toast.error("Échec de la connexion. Utilisateur non retourné.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la connexion");
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    formState,
    handleChange,
    handleLogin,
  };
};

// Hook pour l'inscription
export const useSignup = () => {
  const [formState, setFormState] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isLoading: false,
  });
  const navigate = useNavigate();

  const handleChange =
    (field: keyof SignupFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formState;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await authService.signup({
        email,
        password,
        name,
      });

      if (user) {
        toast.success("Inscription réussie!");
        navigate("/dashboard");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'inscription");
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    formState,
    handleChange,
    handleSignup,
  };
};

// Hook pour la déconnexion
export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return handleLogout;
};
