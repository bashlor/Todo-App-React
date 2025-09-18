import { Task } from "@/types/task";

const generateInitialTasks = (userId: string): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: crypto.randomUUID(),
      title: "Bienvenue sur TaskFlow ! 👋",
      description: "Découvrez votre nouvelle application de gestion de tâches",
      completed: false,
      createdAt: now,
      category: "personal",
      priority: "medium",
    },
    {
      id: crypto.randomUUID(),
      title: "Personnaliser mon profil",
      description: "Ajoutez vos informations personnelles et une photo de profil",
      completed: false,
      createdAt: now,
      category: "personal",
      priority: "low",
    },
    {
      id: crypto.randomUUID(),
      title: "Explorer les fonctionnalités de l'application",
      description: "Découvrez comment ajouter, modifier et organiser vos tâches",
      completed: false,
      createdAt: now,
      category: "personal",
      priority: "high",
    },
    {
      id: crypto.randomUUID(),
      title: "Créer ma première tâche importante",
      description: "Ajoutez une tâche avec une date d'échéance et une priorité",
      completed: false,
      createdAt: tomorrow,
      category: "work",
      priority: "high",
      dueDate: tomorrow.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Organiser mes catégories",
      description: "Créez des catégories pour mieux organiser vos tâches",
      completed: false,
      createdAt: nextWeek,
      category: "personal",
      priority: "medium",
      dueDate: nextWeek.toISOString(),
    },
  ];
};

const saveInitialTasks = (userId: string) => {
  const tasks = generateInitialTasks(userId);
  const key = `tasks_${userId}`;
  localStorage.setItem(key, JSON.stringify(tasks));
  return tasks;
};

export default {
  generateInitialTasks,
  saveInitialTasks,
};
