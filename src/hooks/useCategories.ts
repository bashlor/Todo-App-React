import { useState, useEffect, useCallback } from "react";
import { Category, categoryService } from "@/services/categoryService";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();

      // Vérifier si les données ont changé avant de mettre à jour l'état
      const hasChanges =
        categories.length !== data.length ||
        data.some(
          (cat, index) =>
            !categories[index] ||
            categories[index].id !== cat.id ||
            categories[index].count !== cat.count
        );

      if (hasChanges) {
        setCategories(data);
        setLastUpdated(new Date());
        // Log uniquement en cas de changement
        console.log("Catégories mises à jour");
      }

      return data;
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categories]);

  const createCategory = useCallback(async (name: string) => {
    try {
      const newCategory = await categoryService.createCategory(name);
      setCategories((prev) => [...prev, newCategory]);
      setLastUpdated(new Date());
      return newCategory;
    } catch (err) {
      console.error("Erreur lors de la création de la catégorie:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la catégorie");
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression de la catégorie"
      );
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, name: string) => {
    try {
      const updatedCategory = await categoryService.updateCategory(id, name);
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? updatedCategory : category))
      );
      setLastUpdated(new Date());
      return updatedCategory;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la catégorie:", err);
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour de la catégorie"
      );
      throw err;
    }
  }, []);

  const updateCategoryCounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedCategories = await categoryService.updateCategoryCounts();

      // Vérifier si les données ont changé avant de mettre à jour l'état
      const hasChanges =
        categories.length !== updatedCategories.length ||
        updatedCategories.some(
          (cat, index) => !categories[index] || categories[index].count !== cat.count
        );

      if (hasChanges) {
        setCategories(updatedCategories);
        setLastUpdated(new Date());
      }

      return updatedCategories;
    } catch (err) {
      console.error("Erreur lors de la mise à jour des compteurs:", err);
      // On ne définit pas l'erreur ici car c'est souvent appelé en arrière-plan
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    // Charger les catégories au montage
    fetchCategories().catch((err) => {
      toast.error("Erreur lors du chargement des catégories");
      console.error("Erreur initiale lors du chargement des catégories:", err);
    });
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    lastUpdated,
    createCategory,
    deleteCategory,
    updateCategory,
    updateCategoryCounts,
    refreshCategories: fetchCategories,
  };
};
