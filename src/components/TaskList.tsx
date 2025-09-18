import { useState } from "react";
import TaskItem from "./TaskItem";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import TaskForm from "./TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useCategories";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (
    taskData: Pick<Task, "title" | "category"> &
      Partial<Omit<Task, "id" | "completed" | "createdAt">>
  ) => void;
  onUpdate: (task: Task) => void;
  isLoading?: boolean;
}

const TaskList = ({
  tasks,
  onToggleComplete,
  onDelete,
  onAdd,
  onUpdate,
  isLoading,
}: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const { categories, isLoading: categoriesLoading } = useCategories();

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsAddDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task || !task.title) return false;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : task.category === selectedCategory;
    const matchesCompleted = showCompleted ? true : !task.completed;

    return matchesSearch && matchesCategory && matchesCompleted;
  });

  const handleAddOrUpdate = (
    taskData: Pick<Task, "title" | "category"> &
      Partial<Omit<Task, "id" | "completed" | "createdAt">>
  ) => {
    if (taskToEdit) {
      onUpdate({ ...taskToEdit, ...taskData, id: taskToEdit.id });
    } else {
      onAdd(taskData);
    }
    setIsAddDialogOpen(false);
    setTaskToEdit(null);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>Chargement des tâches...</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
        <div className='relative w-full lg:w-96'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Rechercher une tâche (par contenu)...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto'>
          <div className='flex space-x-2'>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-[160px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Catégorie' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='all'>Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant='outline'
            onClick={() => setShowCompleted(!showCompleted)}
            className='w-full sm:w-auto'
          >
            {showCompleted ? "Masquer terminées" : "Afficher terminées"}
          </Button>

          <Button
            onClick={() => {
              setTaskToEdit(null);
              setIsAddDialogOpen(true);
            }}
            className='w-full sm:w-auto'
          >
            <Plus className='mr-2 h-4 w-4' />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      <div className='space-y-3'>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>
              {tasks.length === 0 && !isLoading
                ? "Vous n'avez aucune tâche pour le moment. Ajoutez-en une !"
                : "Aucune tâche ne correspond à vos critères"}
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(isOpen) => {
          setIsAddDialogOpen(isOpen);
          if (!isOpen) setTaskToEdit(null);
        }}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {taskToEdit ? "Modifier la tâche" : "Ajouter une nouvelle tâche"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            initialData={taskToEdit || undefined}
            onSubmit={handleAddOrUpdate}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setTaskToEdit(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
