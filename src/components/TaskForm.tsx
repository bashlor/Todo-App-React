import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/task";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryDisplay } from "@/hooks/useCategoryDisplay";

export type TaskFormData = Pick<Task, "title" | "category"> &
  Partial<Omit<Task, "id" | "completed" | "createdAt">>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (taskData: TaskFormData) => void;
  onCancel: () => void;
}

const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const { categories } = useCategories();
  const { convertLegacyCategoryId } = useCategoryDisplay();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");

      // Convertir l'ancienne catégorie si nécessaire
      const convertedCategory = initialData.category
        ? convertLegacyCategoryId(initialData.category)
        : undefined;
      setCategory(convertedCategory);

      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : undefined);
    } else {
      setTitle("");
      setCategory(undefined);
      setDueDate(undefined);
    }
  }, [initialData, convertLegacyCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Le titre de la tâche ne peut pas être vide.");
      return;
    }

    // S'assurer que la catégorie est un ID valide
    const validCategory =
      category && category !== "none" ? convertLegacyCategoryId(category) : undefined;

    const taskData: TaskFormData = {
      title,
      category: validCategory,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };
    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Titre de la tâche *</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder='Que devez-vous faire ?'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>Catégorie</Label>
        <Select
          value={category || "none"}
          onValueChange={(value) => setCategory(value === "none" ? undefined : value)}
        >
          <SelectTrigger id='category'>
            <SelectValue placeholder='Sélectionner une catégorie' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='none'>Aucune catégorie</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='dueDate'>Date d'échéance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {dueDate ? format(dueDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
        {dueDate && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='mt-1'
            onClick={() => setDueDate(undefined)}
          >
            Effacer la date
          </Button>
        )}
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Annuler
        </Button>
        <Button type='submit'>{initialData ? "Mettre à jour la tâche" : "Créer la tâche"}</Button>
      </div>
    </form>
  );
};

export default TaskForm;
