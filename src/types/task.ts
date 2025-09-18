export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: string;
  category?: string;
  createdAt: Date;
}
