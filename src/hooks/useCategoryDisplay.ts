import { useCallback } from "react";
import { useCategories } from "./useCategories";

export interface CategoryDisplay {
  name: string;
  color: string;
}

const DEFAULT_COLORS: Record<string, string> = {
  default: "bg-stone-100 text-stone-800",
  none: "bg-gray-100 text-gray-800",
  "0": "bg-blue-100 text-blue-800",
  "1": "bg-purple-100 text-purple-800",
  "2": "bg-green-100 text-green-800",
  "3": "bg-yellow-100 text-yellow-800",
  "4": "bg-pink-100 text-pink-800",
  "5": "bg-indigo-100 text-indigo-800",
  "6": "bg-teal-100 text-teal-800",
  "7": "bg-amber-100 text-amber-800",
  "8": "bg-red-100 text-red-800",
  "9": "bg-sky-100 text-sky-800",
};

// Table de correspondance pour les anciennes catégories
export const LEGACY_CATEGORY_MAPPING: Record<string, string> = {
  work: "Travail",
  personal: "Personnel",
  shopping: "Courses",
  study: "Études",
  health: "Santé",
};

export const useCategoryDisplay = () => {
  const { categories } = useCategories();

  const getCategoryDisplay = useCallback(
    (categoryId?: string): CategoryDisplay => {
      if (!categoryId) {
        return { name: "Sans catégorie", color: DEFAULT_COLORS.none };
      }

      // Chercher la catégorie par ID
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        // Si trouvé, utiliser son nom et lui attribuer une couleur basée sur sa position
        const colorIndex = categories.indexOf(category) % Object.keys(DEFAULT_COLORS).length;
        return {
          name: category.name,
          color: DEFAULT_COLORS[colorIndex.toString()] || DEFAULT_COLORS.default,
        };
      }

      // Fallback pour les anciennes catégories codées en dur
      switch (categoryId) {
        case "work":
          return { name: "Travail", color: DEFAULT_COLORS["0"] };
        case "personal":
          return { name: "Personnel", color: DEFAULT_COLORS["1"] };
        case "shopping":
          return { name: "Courses", color: DEFAULT_COLORS["2"] };
        case "study":
          return { name: "Études", color: DEFAULT_COLORS["3"] };
        case "health":
          return { name: "Santé", color: DEFAULT_COLORS["4"] };
        default:
          return { name: categoryId, color: DEFAULT_COLORS.default };
      }
    },
    [categories]
  );

  // Nouvelle fonction pour obtenir l'ID d'une catégorie par son nom
  const getCategoryIdByName = useCallback(
    (name: string): string | undefined => {
      // Recherche insensible à la casse
      const category = categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());

      if (category) {
        return category.id;
      }

      // Si c'est un ancien ID de catégorie, chercher par nom mappé
      if (LEGACY_CATEGORY_MAPPING[name]) {
        const mappedName = LEGACY_CATEGORY_MAPPING[name];
        const mappedCategory = categories.find(
          (cat) => cat.name.toLowerCase() === mappedName.toLowerCase()
        );
        if (mappedCategory) {
          return mappedCategory.id;
        }
      }

      return undefined;
    },
    [categories]
  );

  // Fonction pour convertir les anciens IDs vers les nouveaux
  const convertLegacyCategoryId = useCallback(
    (categoryId?: string): string | undefined => {
      if (!categoryId) return undefined;

      // Si l'ID existe déjà dans les catégories, le retourner tel quel
      if (categories.some((cat) => cat.id === categoryId)) {
        return categoryId;
      }

      // Si c'est un ancien ID, chercher le nouvel ID correspondant
      if (LEGACY_CATEGORY_MAPPING[categoryId]) {
        return getCategoryIdByName(LEGACY_CATEGORY_MAPPING[categoryId]);
      }

      return categoryId;
    },
    [categories, getCategoryIdByName]
  );

  return {
    getCategoryDisplay,
    getCategoryIdByName,
    convertLegacyCategoryId,
  };
};
