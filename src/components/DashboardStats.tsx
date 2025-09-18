import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { Task } from "@/types/task";
import { Progress } from "@/components/ui/progress";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryDisplay } from "@/hooks/useCategoryDisplay";

interface DashboardStatsProps {
  tasks: Task[];
}

const DashboardStats = ({ tasks }: DashboardStatsProps) => {
  const { categories } = useCategories();
  const { getCategoryDisplay } = useCategoryDisplay();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && !task.completed;
  }).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() < today.getTime();
  }).length;

  const tasksByCategory = tasks.reduce<Record<string, number>>((acc, task) => {
    const category = task.category || "none";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Préparer les données des catégories pour l'affichage
  const categoriesWithDisplay = [
    { id: "none", name: "Sans catégorie", color: "bg-gray-500" },
    ...categories.map((cat) => {
      const display = getCategoryDisplay(cat.id);
      // Extraire la couleur de fond du format "bg-color-100 text-color-800"
      const bgClass = display.color.split(" ")[0];
      // Convertir de "bg-color-100" à "bg-color-500" pour les statistiques
      const color = bgClass.replace("-100", "-500");
      return {
        id: cat.id,
        name: cat.name,
        color,
      };
    }),
  ];

  // Fallback pour les anciennes catégories codées en dur qui pourraient encore être présentes dans les tâches
  const legacyCategories = [
    { id: "work", name: "Travail", color: "bg-blue-500" },
    { id: "personal", name: "Personnel", color: "bg-purple-500" },
    { id: "shopping", name: "Courses", color: "bg-green-500" },
    { id: "study", name: "Études", color: "bg-yellow-500" },
    { id: "health", name: "Santé", color: "bg-pink-500" },
  ];

  // Fusionner toutes les catégories tout en évitant les doublons
  const allCategoryIds = [
    ...new Set([
      ...categoriesWithDisplay.map((c) => c.id),
      ...Object.keys(tasksByCategory).filter((id) => id !== "none"),
    ]),
  ];

  // Créer la liste finale des catégories avec le nombre de tâches
  const categoryStats = allCategoryIds.map((id) => {
    const existingCategory = categoriesWithDisplay.find((c) => c.id === id);
    if (existingCategory) {
      return {
        ...existingCategory,
        count: tasksByCategory[id] || 0,
      };
    }
    // Si c'est une ancienne catégorie codée en dur
    const legacyCategory = legacyCategories.find((c) => c.id === id);
    if (legacyCategory) {
      return {
        ...legacyCategory,
        count: tasksByCategory[id] || 0,
      };
    }
    // Fallback si on ne trouve pas la catégorie
    return {
      id,
      name: id,
      color: "bg-gray-500",
      count: tasksByCategory[id] || 0,
    };
  });

  // Trier par nombre de tâches décroissant
  categoryStats.sort((a, b) => b.count - a.count);

  // Limiter à 5 catégories maximum pour l'affichage
  const displayCategories = categoryStats.slice(0, 5);

  return (
    <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Tâches complétées</CardTitle>
          <CheckCircle2 className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {completedTasks} / {totalTasks}
          </div>
          <Progress value={completionRate} className='h-2 mt-2' />
          <CardDescription className='text-xs mt-1'>
            Taux de complétion: {completionRate}%
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Pour aujourd'hui</CardTitle>
          <Clock className='h-4 w-4 text-blue-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{dueTodayTasks}</div>
          <CardDescription className='text-xs mt-1'>Tâches à faire aujourd'hui</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>En retard</CardTitle>
          <AlertTriangle className='h-4 w-4 text-red-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{overdueTasks}</div>
          <CardDescription className='text-xs mt-1'>Tâches en retard</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Par catégorie</CardTitle>
          <BarChart3 className='h-4 w-4 text-purple-500' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {displayCategories.map((category) => (
              <div key={category.id} className='flex items-center text-sm'>
                <div className={`w-2 h-2 rounded-full mr-2 ${category.color}`}></div>
                <span className='flex-1'>{category.name}</span>
                <span className='font-medium'>{category.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
