import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import dbService from "../services/database/db";
import authService from "../services/auth/auth";
import { Task } from "@/types/task";
import { categoryService } from "@/services/categoryService";

interface UseTodosState {
  todos: Task[];
  isLoading: boolean;
  error: string | null;
}

export const useTodos = () => {
  const [state, setState] = useState<UseTodosState>({
    todos: [],
    isLoading: true,
    error: null,
  });

  // Fonction utilitaire pour mettre à jour les compteurs de catégories
  const updateCategoryCounts = async () => {
    try {
      await categoryService.updateCategoryCounts();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des compteurs de catégories:", error);
      // On ne notifie pas l'utilisateur car c'est une opération en arrière-plan
    }
  };

  // Charger les todos
  const fetchTodos = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.getUser();

      if (!user) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Utilisateur non connecté",
        }));
        return;
      }

      const fetchedTodos = await dbService.getTasks(user.id);
      setState((prev) => ({
        ...prev,
        todos: fetchedTodos,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching todos:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors du chargement des todos",
      }));
      toast.error("Erreur lors du chargement des todos");
    }
  }, []);

  // Charger les todos au montage du composant
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Ajouter un todo
  const addTodo = async (title: string, category?: string, dueDate?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.getUser();

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const newTodo = await dbService.addTask(user.id, title, category);

      // Si une date d'échéance est fournie, mettre à jour la tâche avec cette date
      let finalTodo = newTodo;
      if (dueDate) {
        finalTodo =
          (await dbService.updateTask(user.id, {
            id: newTodo.id,
            dueDate,
          })) || newTodo;
      }

      setState((prev) => ({
        ...prev,
        todos: [finalTodo, ...prev.todos],
        isLoading: false,
      }));

      // Mettre à jour les compteurs de catégories UNIQUEMENT si une catégorie est définie
      if (category) {
        await updateCategoryCounts();
      }

      toast.success("Todo ajouté avec succès");
      return finalTodo;
    } catch (error) {
      console.error("Error adding todo:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de l'ajout du todo",
      }));
      toast.error("Erreur lors de l'ajout du todo");
      return null;
    }
  };

  // Mettre à jour un todo
  const updateTodo = async (taskUpdate: Partial<Task> & { id: string }) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.getUser();

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Récupérer la tâche originale pour comparer les catégories
      const originalTodo = state.todos.find((todo) => todo.id === taskUpdate.id);
      const categoryChanged =
        originalTodo && "category" in taskUpdate && originalTodo.category !== taskUpdate.category;

      const updatedTodo = await dbService.updateTask(user.id, taskUpdate);
      if (updatedTodo) {
        setState((prev) => ({
          ...prev,
          todos: prev.todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
          isLoading: false,
        }));

        // Mettre à jour les compteurs de catégories UNIQUEMENT si la catégorie a changé
        if (categoryChanged) {
          await updateCategoryCounts();
        }

        toast.success("Todo mis à jour avec succès");
        return updatedTodo;
      }
      throw new Error("La mise à jour a échoué");
    } catch (error) {
      console.error("Error updating todo:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de la mise à jour du todo",
      }));
      toast.error("Erreur lors de la mise à jour du todo");
      return null;
    }
  };

  // Supprimer un todo
  const deleteTodo = async (todoId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.getUser();

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Vérifier si la tâche à supprimer a une catégorie
      const todoToDelete = state.todos.find((todo) => todo.id === todoId);
      const hasCategory = todoToDelete && todoToDelete.category;

      const success = await dbService.deleteTask(user.id, todoId);
      if (success) {
        setState((prev) => ({
          ...prev,
          todos: prev.todos.filter((todo) => todo.id !== todoId),
          isLoading: false,
        }));

        // Mettre à jour les compteurs de catégories UNIQUEMENT si la tâche supprimée avait une catégorie
        if (hasCategory) {
          await updateCategoryCounts();
        }

        toast.success("Todo supprimé avec succès");
        return true;
      }
      throw new Error("La suppression a échoué");
    } catch (error) {
      console.error("Error deleting todo:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de la suppression du todo",
      }));
      toast.error("Erreur lors de la suppression du todo");
      return false;
    }
  };

  // Toggle le statut completed d'un todo
  const toggleTodoComplete = async (todoId: string) => {
    const todoToToggle = state.todos.find((todo) => todo.id === todoId);
    if (!todoToToggle) {
      toast.error("Todo non trouvé");
      return null;
    }

    return updateTodo({
      id: todoId,
      completed: !todoToToggle.completed,
    });
  };

  return {
    ...state,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    refreshTodos: fetchTodos,
  };
};
