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
import { AtSign, KeyRound, User } from "lucide-react";
import { useSignup } from "../hooks/useAuth";

const SignupForm = () => {
  const { formState, handleChange, handleSignup } = useSignup();
  const { name, email, password, confirmPassword, isLoading } = formState;

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <div className='flex justify-center mb-4'>
          <div className='h-12 w-12 rounded-xl gradient-bg flex items-center justify-center'>
            <span className='text-white text-xl font-bold'>T</span>
          </div>
        </div>
        <CardTitle className='text-2xl text-center'>Créer un compte</CardTitle>
        <CardDescription className='text-center'>
          Entrez vos informations pour créer votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleSignup} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nom</Label>
            <div className='relative'>
              <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='name'
                type='text'
                placeholder='Votre nom'
                className='pl-10'
                value={name}
                onChange={handleChange("name")}
                required
              />
            </div>
          </div>
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
            <Label htmlFor='password'>Mot de passe</Label>
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
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirmer le mot de passe</Label>
            <div className='relative'>
              <KeyRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='confirmPassword'
                type='password'
                className='pl-10'
                value={confirmPassword}
                onChange={handleChange("confirmPassword")}
                required
              />
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? "Création du compte..." : "S'inscrire"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <div className='text-center text-sm mt-2'>
          Vous avez déjà un compte?{" "}
          <Link to='/login' className='text-primary hover:underline'>
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
