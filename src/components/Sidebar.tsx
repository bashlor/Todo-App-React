import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  ListTodo,
  Tag,
  Settings,
  LogOut,
  PlusCircle,
  Inbox,
  Loader2,
  LucideIcon,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useState, useEffect } from "react";
import { useLogout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const {
    categories,
    isLoading,
    error,
    createCategory,
    deleteCategory,
    updateCategory,
    updateCategoryCounts,
    refreshCategories,
  } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Rafraîchir les catégories et leurs compteurs lors du montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // D'abord mettre à jour les compteurs
        await updateCategoryCounts();
        // Puis rafraîchir la liste des catégories
        await refreshCategories();
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    loadCategories();

    // Supprimer l'intervalle de rafraîchissement périodique
    // Nous mettons à jour uniquement lors des changements réels
  }, [updateCategoryCounts, refreshCategories]);

  // Mettre à jour les compteurs lors du changement de page uniquement
  // cela garantit que les compteurs sont toujours à jour après navigation
  useEffect(() => {
    updateCategoryCounts().catch((error) => {
      console.error("Erreur lors de la mise à jour des compteurs:", error);
    });
  }, [location.pathname, updateCategoryCounts]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      toast.success("Catégorie créée avec succès");
    } catch (err) {
      toast.error("Erreur lors de la création de la catégorie");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      await updateCategory(editingCategory.id, editingCategory.name.trim());
      setEditingCategory(null);
      toast.success("Catégorie mise à jour avec succès");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;

    try {
      await deleteCategory(deletingCategoryId);
      setDeletingCategoryId(null);
      toast.success("Catégorie supprimée avec succès");
    } catch (err) {
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) => {
    const isActive = location.pathname === to;

    return (
      <Link to={to}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-1",
            isActive && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <Icon className='mr-2 h-5 w-5' />
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <div className='h-screen p-4 bg-sidebar border-r flex flex-col'>
      <div className='flex items-center gap-2 py-4 px-2 mb-6'>
        <div className='h-8 w-8 rounded-lg gradient-bg flex items-center justify-center'>
          <span className='text-white font-bold'>T</span>
        </div>
        <h1 className='text-xl font-bold'>TaskFlow</h1>
      </div>

      <div className='space-y-1 mb-6'>
        <NavItem to='/dashboard' icon={Home} label='Tableau de bord' />
        <NavItem to='/tasks' icon={ListTodo} label='Toutes les tâches' />
        <NavItem to='/inbox' icon={Inbox} label="À faire aujourd'hui" />
      </div>

      <div className='mb-6'>
        <div className='px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
          Catégories
        </div>
        {error && (
          <div className='text-sm text-destructive px-3 mb-2'>
            Erreur de chargement des catégories
          </div>
        )}
        {isLoading ? (
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div key={category.id} className='flex items-center'>
                <Link to={`/category/${category.id}`} className='flex-1'>
                  <Button
                    variant='ghost'
                    className='w-full justify-between mb-1 text-muted-foreground hover:text-foreground'
                  >
                    <div className='flex items-center'>
                      <Tag className='mr-2 h-4 w-4' />
                      {category.name}
                    </div>
                    <span className='text-xs bg-muted px-2 py-0.5 rounded-full'>
                      {category.count}
                    </span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8 ml-1'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                      <Edit className='mr-2 h-4 w-4' />
                      Renommer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingCategoryId(category.id)}
                      className='text-destructive focus:text-destructive'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <div className='flex items-center gap-2 mt-2'>
              <input
                type='text'
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder='Nouvelle catégorie'
                className='flex-1 px-2 py-1 text-sm rounded border bg-background'
                onKeyPress={(e) => e.key === "Enter" && handleCreateCategory()}
              />
              <Button
                variant='ghost'
                size='sm'
                className='text-primary'
                onClick={handleCreateCategory}
                disabled={isCreating || !newCategoryName.trim()}
              >
                {isCreating ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <PlusCircle className='h-4 w-4' />
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className='mt-auto space-y-1'>
        <NavItem to='/settings' icon={Settings} label='Paramètres' />
        <Button variant='ghost' className='w-full justify-start' onClick={handleLogout}>
          <LogOut className='mr-2 h-5 w-5' />
          Déconnexion
        </Button>
      </div>

      {/* Modal de modification de catégorie */}
      <Dialog
        open={editingCategory !== null}
        onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Renommer la catégorie</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <Input
              value={editingCategory?.name || ""}
              onChange={(e) =>
                setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              placeholder='Nom de la catégorie'
              className='w-full'
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateCategory} disabled={!editingCategory?.name.trim()}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression de catégorie */}
      <AlertDialog
        open={deletingCategoryId !== null}
        onOpenChange={(isOpen) => !isOpen && setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement cette catégorie. Les
              tâches associées à cette catégorie ne seront pas supprimées, mais elles perdront leur
              association avec cette catégorie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sidebar;
