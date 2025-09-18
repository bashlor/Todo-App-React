import { Task } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import DashboardStats from "@/components/DashboardStats";
import TaskList from "@/components/TaskList";
import { useTodos } from "@/hooks/useTodos";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const {
    todos: tasks,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
  } = useTodos();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "today" | "overdue">("all");

  useEffect(() => {
    if (!tasks) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "today") {
      setFilteredTasks(
        tasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        }),
      );
    } else if (filter === "overdue") {
      setFilteredTasks(
        tasks.filter((task) => {
          if (!task.dueDate || task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() < today.getTime();
        }),
      );
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, filter]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleToggleComplete = async (id: string) => {
    await toggleTodoComplete(id);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const handleAdd = async (
    taskData: Pick<Task, "title" | "category"> &
      Partial<Omit<Task, "id" | "completed" | "createdAt">>,
  ) => {
    await addTodo(taskData.title, taskData.category, taskData.dueDate);
  };

  const handleUpdate = async (updatedTask: Task) => {
    await updateTodo({
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.completed,
      dueDate: updatedTask.dueDate,
      priority: updatedTask.priority,
      category: updatedTask.category,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

          <DashboardStats tasks={tasks} />

          <div className="flex justify-between items-center mt-10 mb-4">
            <h2 className="text-xl font-semibold">Tâches</h2>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                onClick={() => setFilter("all")}
              >
                Toutes
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "today"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                onClick={() => setFilter("today")}
              >
                Aujourd'hui
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "overdue"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                onClick={() => setFilter("overdue")}
              >
                En retard
              </button>
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
