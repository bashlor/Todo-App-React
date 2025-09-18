import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { toast } from "sonner";

import dbService from "../services/database/db";
import { Task } from "@/types/task";
import authService, { User } from "../services/auth/auth";
import { useCategories } from "@/hooks/useCategories";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { updateCategoryCounts } = useCategories();

  useEffect(() => {
    authService
      .getUser()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          dbService
            .getTasks(user.id)
            .then((fetchedTasks) => {
              setTasks(fetchedTasks);
            })
            .catch((error) => {
              console.error("Error fetching tasks:", error);
              toast.error("Erreur lors de la récupération des tâches.");
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          console.warn("No current user found for TasksPage.");
          toast.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        toast.error("Erreur lors de la récupération de l'utilisateur.");
        setIsLoading(false);
      });
  }, []);

  // Fonction utilitaire pour mettre à jour les compteurs après une opération sur les tâches
  const updateCategoryCountsAfterOperation = async () => {
    try {
      await updateCategoryCounts();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des compteurs:", error);
      // On ne montre pas d'erreur à l'utilisateur car c'est une opération en arrière-plan
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!currentUser) return toast.error("Utilisateur non identifié.");
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return toast.error("Tâche non trouvée.");

    setIsLoading(true);
    try {
      const updatedTask = await dbService.updateTask(currentUser.id, {
        id,
        completed: !taskToToggle.completed,
      });
      if (updatedTask) {
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
        toast.success("Statut de la tâche mis à jour");
      } else {
        toast.error("Échec de la mise à jour de la tâche.");
      }
    } catch (error) {
      console.error("Error toggling task complete:", error);
      toast.error("Erreur lors de la mise à jour du statut.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentUser) return toast.error("Utilisateur non identifié.");
    setIsLoading(true);
    try {
      const success = await dbService.deleteTask(currentUser.id, id);
      if (success) {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success("Tâche supprimée");

        // Mettre à jour les compteurs de catégories
        await updateCategoryCountsAfterOperation();
      } else {
        toast.error("Échec de la suppression de la tâche.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Erreur lors de la suppression de la tâche.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (
    newTaskData: Pick<Task, "title" | "category"> &
      Partial<Omit<Task, "id" | "completed" | "createdAt">>
  ) => {
    if (!currentUser) return toast.error("Utilisateur non identifié.");
    if (!newTaskData.title || newTaskData.title.trim() === "") {
      return toast.error("Le titre de la tâche ne peut pas être vide.");
    }
    setIsLoading(true);
    try {
      const addedTask = await dbService.addTask(
        currentUser.id,
        newTaskData.title,
        newTaskData.category
      );
      setTasks([addedTask, ...tasks]);
      toast.success("Tâche ajoutée");

      // Mettre à jour les compteurs de catégories
      await updateCategoryCountsAfterOperation();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Erreur lors de l'ajout de la tâche.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedTaskData: Task) => {
    if (!currentUser) return toast.error("Utilisateur non identifié.");
    setIsLoading(true);
    try {
      const resultTask = await dbService.updateTask(currentUser.id, updatedTaskData);
      if (resultTask) {
        setTasks(tasks.map((task) => (task.id === updatedTaskData.id ? resultTask : task)));
        toast.success("Tâche mise à jour");

        // Mettre à jour les compteurs de catégories
        await updateCategoryCountsAfterOperation();
      } else {
        toast.error("Échec de la mise à jour de la tâche (non trouvée ou inchangée).");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Erreur lors de la mise à jour de la tâche.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && tasks.length === 0 && !currentUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Chargement des informations utilisateur et des tâches...</p>
      </div>
    );
  }

  if (!currentUser && !isLoading) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <p className='mb-4'>Vous devez être connecté pour voir cette page.</p>
      </div>
    );
  }

  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='w-64 flex-shrink-0'>
        <Sidebar />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-6 max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>
            Toutes les tâches{" "}
            {currentUser
              ? `de ${currentUser.name || currentUser.email?.split("@")[0] || "Utilisateur"}`
              : ""}
          </h1>

          {isLoading && tasks.length === 0 && currentUser && (
            <div className='text-center py-4'>
              <p>Chargement des tâches...</p>
            </div>
          )}
          {!isLoading && tasks.length === 0 && currentUser && (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-500 mb-2'>Vous n'avez aucune tâche pour le moment.</p>
              <p className='text-gray-400'>Commencez par en ajouter une !</p>
            </div>
          )}

          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
