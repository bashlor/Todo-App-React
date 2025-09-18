import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CalendarCheck2,
  CalendarClock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCategoryDisplay } from "@/hooks/useCategoryDisplay";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getCategoryDisplay } = useCategoryDisplay();

  const isDueDatePassed = () => {
    if (!task.dueDate) return false;
    const today = startOfDay(new Date());
    const dueDate = startOfDay(new Date(task.dueDate));
    return isBefore(dueDate, today);
  };

  const isDueToday = () => {
    if (!task.dueDate) return false;
    const today = startOfDay(new Date());
    const dueDate = startOfDay(new Date(task.dueDate));
    return isEqual(dueDate, today);
  };

  const getDueDateClass = () => {
    if (task.completed) return "text-muted-foreground";
    if (isDueDatePassed()) return "text-destructive font-medium";
    if (isDueToday()) return "text-amber-600 font-medium";
    return "text-emerald-600";
  };

  const getDueDateIcon = () => {
    if (task.completed) return CalendarClock;
    if (isDueDatePassed()) return AlertCircle;
    return CalendarClock;
  };

  const DueDateIcon = getDueDateIcon();
  const categoryDisplay = getCategoryDisplay(task.category);

  return (
    <div
      className={cn(
        "flex items-center p-3 border rounded-lg transition-all group",
        task.completed ? "bg-muted" : "bg-card hover:shadow-md",
        isHovered && "ring-1 ring-primary/30",
        !task.completed && isDueDatePassed() && "border-destructive/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='mr-4'>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className={task.completed ? "opacity-50" : ""}
        />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between'>
          <h3
            className={cn(
              "text-base font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
        </div>

        <div className='flex items-center mt-2 gap-2 flex-wrap'>
          {task.createdAt && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center text-xs text-muted-foreground'>
                    <CalendarCheck2 className='h-3 w-3 mr-1' />
                    {format(task.createdAt, "d MMM yyyy", { locale: fr })}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Date de création</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {task.dueDate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("flex items-center text-xs", getDueDateClass())}>
                    <DueDateIcon className='h-3 w-3 mr-1' />
                    {format(new Date(task.dueDate), "d MMM yyyy", { locale: fr })}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isDueDatePassed()
                      ? "En retard"
                      : isDueToday()
                      ? "À faire aujourd'hui"
                      : "Date d'échéance"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {task.category && (
            <Badge variant='outline' className={cn("text-xs", categoryDisplay.color)}>
              {categoryDisplay.name}
            </Badge>
          )}
        </div>
      </div>

      <div className='ml-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='opacity-0 group-hover:opacity-100'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className='h-4 w-4 mr-2' />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className='text-destructive'>
              <Trash2 className='h-4 w-4 mr-2' />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskItem;
