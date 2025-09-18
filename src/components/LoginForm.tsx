import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { AtSign, KeyRound } from "lucide-react";
import { useLogin } from "../hooks/useAuth";

const LoginForm = () => {
  const { formState, handleChange, handleLogin } = useLogin();
  const { email, password, isLoading } = formState;

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <div className='flex justify-center mb-4'>
          <div className='h-12 w-12 rounded-xl gradient-bg flex items-center justify-center'>
            <span className='text-white text-xl font-bold'>T</span>
          </div>
        </div>
        <CardTitle className='text-2xl text-center'>Connexion</CardTitle>
        <CardDescription className='text-center'>
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <AtSign className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='exemple@email.com'
                className='pl-10'
                value={email}
                onChange={handleChange("email")}
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Mot de passe</Label>
              <Link to='/forgot-password' className='text-sm text-primary hover:underline'>
                Mot de passe oublié?
              </Link>
            </div>
            <div className='relative'>
              <KeyRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='password'
                type='password'
                className='pl-10'
                value={password}
                onChange={handleChange("password")}
                required
              />
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='text-center text-sm mt-2'>
          Vous n'avez pas de compte?{" "}
          <Link to='/signup' className='text-primary hover:underline'>
            S'inscrire
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
