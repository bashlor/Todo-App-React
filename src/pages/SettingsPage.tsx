import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/services/auth/auth";
import { Trash2, User, Shield, Mail, Lock, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string;
    name?: string;
  } | null>(null);
  const [userName, setUserName] = useState("");

  // États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les informations de l'utilisateur
    authService.getUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setUserName(user.name || user.email?.split("@")[0] || "");
      }
    });
  }, []);

  const handleUpdateProfile = async () => {
    if (!userName.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({ name: userName.trim() });
      if (updatedUser) {
        setCurrentUser(updatedUser);
        toast.success("Profil mis à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Réinitialiser les erreurs
    setPasswordError(null);

    // Vérifier que tous les champs sont remplis
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont obligatoires");
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (currentPassword === newPassword) {
      setPasswordError("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    // Vérifier que le mot de passe est assez fort (au moins 6 caractères)
    if (newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsChangingPassword(true);
    try {
      const success = await authService.updatePassword(currentPassword, newPassword);
      if (success) {
        toast.success("Mot de passe mis à jour avec succès");
        // Réinitialiser les champs
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Fermer le dialogue
        document.querySelector<HTMLButtonElement>('[data-dialog-close="true"]')?.click();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setPasswordError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "SUPPRIMER") {
      toast.error("Veuillez saisir le texte exact pour confirmer");
      return;
    }

    setIsDeleting(true);
    try {
      // Appel au service pour supprimer le compte
      await authService.deleteAccount();
      toast.success("Votre compte a été supprimé avec succès");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      toast.error("Une erreur est survenue lors de la suppression de votre compte");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='w-64 flex-shrink-0'>
        <Sidebar />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-6 max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>Paramètres</h1>

          <div className='space-y-6'>
            {/* Carte informations personnelles */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-muted-foreground' />
                  <CardTitle>Informations personnelles</CardTitle>
                </div>
                <CardDescription>
                  Gérez vos informations personnelles et votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nom d'utilisateur</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='name'
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Votre nom d'utilisateur"
                    />
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isSaving || !userName.trim() || userName === currentUser?.name}
                    >
                      {isSaving ? (
                        <>Enregistrement...</>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Adresse email</Label>
                  <Input id='email' value={currentUser?.email || ""} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Carte confidentialité */}
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Shield className='h-5 w-5 text-muted-foreground' />
                  <CardTitle>Confidentialité et sécurité</CardTitle>
                </div>
                <CardDescription>
                  Gérez vos paramètres de confidentialité et de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' className='w-full sm:w-auto'>
                        <Lock className='mr-2 h-4 w-4' />
                        Changer le mot de passe
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Changer votre mot de passe</DialogTitle>
                        <DialogDescription>
                          Veuillez saisir votre mot de passe actuel et votre nouveau mot de passe
                        </DialogDescription>
                      </DialogHeader>

                      <div className='space-y-4 py-4'>
                        {passwordError && (
                          <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20'>
                            {passwordError}
                          </div>
                        )}

                        <div className='space-y-2'>
                          <Label htmlFor='current-password'>Mot de passe actuel</Label>
                          <Input
                            id='current-password'
                            type='password'
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='new-password'>Nouveau mot de passe</Label>
                          <Input
                            id='new-password'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='confirm-password'>Confirmer le mot de passe</Label>
                          <Input
                            id='confirm-password'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type='button' variant='outline' data-dialog-close='true'>
                            Annuler
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={handleUpdatePassword}
                          disabled={
                            isChangingPassword ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                          }
                        >
                          {isChangingPassword ? "Mise à jour..." : "Mettre à jour"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Carte suppression de compte */}
            <Card className='border-destructive'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Trash2 className='h-5 w-5 text-destructive' />
                  <CardTitle className='text-destructive'>Zone de danger</CardTitle>
                </div>
                <CardDescription>
                  Une fois votre compte supprimé, toutes vos données seront définitivement effacées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' className='w-full sm:w-auto'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement votre compte
                        et toutes vos données de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='py-4'>
                      <Label
                        htmlFor='confirm'
                        className='text-destructive font-semibold block mb-2'
                      >
                        Saisissez "SUPPRIMER" pour confirmer
                      </Label>
                      <Input
                        id='confirm'
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className='border-destructive'
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={confirmText !== "SUPPRIMER" || isDeleting}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        {isDeleting ? "Suppression..." : "Supprimer définitivement"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
