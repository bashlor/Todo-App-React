export interface Category {
  id: string;
  name: string;
  count: number;
}

// Import du service de base de données pour accéder aux tâches
import dbService from "./database/db";
import authService from "./auth/auth";

class LocalStorageCategoryService {
  private async getCurrentUserId(): Promise<string> {
    // Essayer d'obtenir l'utilisateur actuel depuis le service d'authentification
    try {
      const user = await authService.getUser();
      if (user && user.id) {
        return user.id;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur actuel:", error);
    }

    // Fallback: utiliser l'ID stocké localement
    return localStorage.getItem("userId") || "default";
  }

  private async getStorageKey(): Promise<string> {
    const userId = await this.getCurrentUserId();
    return `categories_${userId}`;
  }

  private getInitialCategories(): Category[] {
    return [
      { id: crypto.randomUUID(), name: "Personnel", count: 0 },
      { id: crypto.randomUUID(), name: "Travail", count: 0 },
      { id: crypto.randomUUID(), name: "Courses", count: 0 },
    ];
  }

  async getCategories(): Promise<Category[]> {
    const key = await this.getStorageKey();
    const categoriesJson = localStorage.getItem(key);
    if (!categoriesJson) {
      const initialCategories = this.getInitialCategories();
      localStorage.setItem(key, JSON.stringify(initialCategories));
      return initialCategories;
    }
    try {
      return JSON.parse(categoriesJson);
    } catch (error) {
      console.error("Error parsing categories from localStorage", error);
      return [];
    }
  }

  async createCategory(name: string): Promise<Category> {
    const categories = await this.getCategories();
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      count: 0,
    };
    categories.push(newCategory);
    const key = await this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(categories));
    return newCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    let categories = await this.getCategories();
    categories = categories.filter((c) => c.id !== id);
    const key = await this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(categories));
  }

  async updateCategory(id: string, name: string): Promise<Category> {
    const categories = await this.getCategories();
    const categoryIndex = categories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updatedCategory = { ...categories[categoryIndex], name };
    categories[categoryIndex] = updatedCategory;
    const key = await this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(categories));
    return updatedCategory;
  }

  async updateCategoryCount(id: string, count: number): Promise<Category> {
    const categories = await this.getCategories();
    const categoryIndex = categories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updatedCategory = { ...categories[categoryIndex], count };
    categories[categoryIndex] = updatedCategory;
    const key = await this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(categories));
    return updatedCategory;
  }

  // Méthode pour mettre à jour tous les compteurs de catégories
  async updateCategoryCounts(): Promise<Category[]> {
    const userId = await this.getCurrentUserId();
    const categories = await this.getCategories();
    const tasks = await dbService.getTasks(userId);

    // Créer un mappage des anciennes catégories vers les nouvelles
    const legacyMapping: Record<string, string> = {};
    categories.forEach((cat) => {
      // Associer les catégories par nom (insensible à la casse)
      if (cat.name.toLowerCase() === "travail") legacyMapping["work"] = cat.id;
      if (cat.name.toLowerCase() === "personnel") legacyMapping["personal"] = cat.id;
      if (cat.name.toLowerCase() === "courses") legacyMapping["shopping"] = cat.id;
      if (cat.name.toLowerCase() === "études") legacyMapping["study"] = cat.id;
      if (cat.name.toLowerCase() === "santé") legacyMapping["health"] = cat.id;
    });

    // Calculer le nombre de tâches par catégorie
    const tasksByCategory: Record<string, number> = {};
    tasks.forEach((task) => {
      if (task.category) {
        let categoryId = task.category;

        // Si c'est une ancienne catégorie, utiliser le mappage
        if (legacyMapping[categoryId]) {
          categoryId = legacyMapping[categoryId];
        }

        tasksByCategory[categoryId] = (tasksByCategory[categoryId] || 0) + 1;
      }
    });

    // Vérifier si les compteurs ont changé avant de mettre à jour
    let hasChanges = false;
    for (const category of categories) {
      const newCount = tasksByCategory[category.id] || 0;
      if (category.count !== newCount) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      // Si aucun changement, retourner les catégories existantes sans logs
      return categories;
    }

    // Mettre à jour les compteurs et sauvegarder
    const updatedCategories = categories.map((category) => ({
      ...category,
      count: tasksByCategory[category.id] || 0,
    }));

    const key = await this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(updatedCategories));

    // Log uniquement en cas de changements réels
    console.log("Compteurs de catégories mis à jour");

    return updatedCategories;
  }
}

export const categoryService = new LocalStorageCategoryService();
