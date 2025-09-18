import { Task } from "@/types/task";

// Define the interface for the Database Service
export interface DbService {
  getTasks(userId: string): Promise<Task[]>;
  addTask(userId: string, title: string, category?: string): Promise<Task>;
  updateTask(userId: string, task: Partial<Task> & { id: string }): Promise<Task | null>;
  deleteTask(userId: string, taskId: string): Promise<boolean>;
}

// Mock implementation using localStorage
class LocalStorageDbService implements DbService {
  private getStorageKey(userId: string): string {
    return `tasks_${userId}`;
  }

  async getTasks(userId: string): Promise<Task[]> {
    const key = this.getStorageKey(userId);
    const itemsJson = localStorage.getItem(key);
    if (itemsJson) {
      try {
        const items = JSON.parse(itemsJson) as Task[];
        // Ensure createdAt is a Date object
        return items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }));
      } catch (error) {
        console.error("Error parsing tasks from localStorage", error);
        return [];
      }
    }
    return [];
  }

  async addTask(userId: string, title: string, category?: string): Promise<Task> {
    const tasks = await this.getTasks(userId);
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
      category,
    };
    tasks.push(newTask);
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(tasks));
    return newTask;
  }

  async updateTask(
    userId: string,
    taskUpdate: Partial<Task> & { id: string }
  ): Promise<Task | null> {
    const tasks = await this.getTasks(userId);
    const taskIndex = tasks.findIndex((t) => t.id === taskUpdate.id);
    if (taskIndex === -1) {
      console.warn(`Task with id ${taskUpdate.id} not found for user ${userId}`);
      return null;
    }
    const updatedTask = { ...tasks[taskIndex], ...taskUpdate };
    tasks[taskIndex] = updatedTask;
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(tasks));
    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    let tasks = await this.getTasks(userId);
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== taskId);
    if (tasks.length < initialLength) {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(tasks));
      return true;
    }
    return false;
  }
}

const dbService = new LocalStorageDbService();
export default dbService;
