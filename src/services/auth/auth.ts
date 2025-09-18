// Basic User interface
export interface User {
  id: string;
  email?: string;
  name?: string;
  // Add other user-specific fields here, e.g., avatarUrl
}

// Basic Login Credentials interface
export interface LoginCredentials {
  email?: string;
  password?: string;
  name?: string;
  // Allow for other properties for different auth providers
  [key: string]: string | undefined;
}

// Storage data structure
interface StorageData {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: Array<{ id: string; email: string; password: string; name?: string }>;
}

// Define the interface for the Authentication Service
export interface AuthService {
  isAuthenticated(): Promise<boolean>;
  login(credentials: LoginCredentials): Promise<User | null>;
  signup(credentials: LoginCredentials): Promise<User | null>;
  logout(): Promise<void>;
  getUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  deleteAccount(): Promise<void>;
  updateProfile(data: Partial<User>): Promise<User | null>;
  updatePassword(currentPassword: string, newPassword: string): Promise<boolean>;
}

import initialDataService from "../database/initialData";

class MockAuthService implements AuthService {
  private readonly STORAGE_KEY = "mock_auth_data";
  private authStateListeners: ((user: User | null) => void)[] = [];

  private getStorageData(): StorageData {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data) as StorageData;
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
    return {
      isAuthenticated: false,
      currentUser: null,
      users: [],
    };
  }

  private setStorageData(data: StorageData): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving auth data:", error);
      return false;
    }
  }

  private notifyAuthStateChange(user: User | null) {
    this.authStateListeners.forEach((listener) => listener(user));
  }

  async isAuthenticated(): Promise<boolean> {
    const storage = this.getStorageData();
    return storage.isAuthenticated;
  }

  async signup(credentials: LoginCredentials): Promise<User | null> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email et mot de passe requis");
    }

    console.log("Signup attempt with:", credentials.email);
    const storage = this.getStorageData();
    console.log("Current storage before signup:", storage);

    if (storage.users.some((user) => user.email === credentials.email)) {
      throw new Error("Un compte existe déjà avec cet email");
    }

    const newUser = {
      id: crypto.randomUUID(),
      email: credentials.email,
      password: credentials.password,
      name: credentials.name || credentials.email?.split("@")[0] || "Utilisateur",
    };

    // Créer une nouvelle copie du storage
    const updatedStorage: StorageData = {
      isAuthenticated: true,
      currentUser: { id: newUser.id, email: newUser.email, name: newUser.name },
      users: [...storage.users, newUser],
    };

    console.log("Attempting to save storage:", updatedStorage);

    // Forcer la sauvegarde et vérifier
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStorage));

      // Vérifier immédiatement que les données ont été sauvegardées
      const verifyStorage = localStorage.getItem(this.STORAGE_KEY);
      const parsedStorage = verifyStorage ? (JSON.parse(verifyStorage) as StorageData) : null;

      console.log("Verification - Storage after save:", parsedStorage);

      if (!parsedStorage || parsedStorage.users.length === 0) {
        throw new Error("La vérification du stockage a échoué");
      }

      // Stocker l'ID utilisateur pour les autres services
      localStorage.setItem("userId", newUser.id);

      // Créer les données initiales pour le nouvel utilisateur
      await initialDataService.saveInitialTasks(newUser.id);

      this.notifyAuthStateChange(updatedStorage.currentUser);
      console.log("User registered successfully:", newUser);
      return updatedStorage.currentUser;
    } catch (error) {
      console.error("Error during storage verification:", error);
      throw new Error("Erreur lors de l'enregistrement des données");
    }
  }

  async login(credentials: LoginCredentials): Promise<User | null> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email et mot de passe requis");
    }

    console.log("Login attempt with:", credentials.email);
    const storage = this.getStorageData();
    console.log("Current storage state:", storage);

    if (!storage.users || storage.users.length === 0) {
      console.log("No users found in storage");
      throw new Error("Aucun utilisateur enregistré. Veuillez vous inscrire.");
    }

    const user = storage.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      console.log("No matching user found");
      throw new Error("Email ou mot de passe incorrect");
    }

    const updatedStorage: StorageData = {
      ...storage,
      isAuthenticated: true,
      currentUser: { id: user.id, email: user.email, name: user.name },
    };

    if (this.setStorageData(updatedStorage)) {
      console.log("User logged in successfully:", updatedStorage.currentUser);

      // Stocker l'ID utilisateur pour les autres services
      localStorage.setItem("userId", user.id);

      this.notifyAuthStateChange(updatedStorage.currentUser);
      return updatedStorage.currentUser;
    } else {
      throw new Error("Erreur lors de la connexion");
    }
  }

  async logout(): Promise<void> {
    const storage = this.getStorageData();
    const updatedStorage: StorageData = {
      ...storage,
      isAuthenticated: false,
      currentUser: null,
    };
    if (this.setStorageData(updatedStorage)) {
      // Supprimer l'ID utilisateur du localStorage
      localStorage.removeItem("userId");

      this.notifyAuthStateChange(null);
    } else {
      throw new Error("Erreur lors de la déconnexion");
    }
  }

  async getUser(): Promise<User | null> {
    const storage = this.getStorageData();
    return storage.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    return () => {
      this.authStateListeners = this.authStateListeners.filter((listener) => listener !== callback);
    };
  }

  async deleteAccount(): Promise<void> {
    const storage = this.getStorageData();

    if (!storage.currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    const userId = storage.currentUser.id;

    // Supprimer l'utilisateur de la liste des utilisateurs
    const updatedUsers = storage.users.filter((user) => user.id !== userId);

    // Mettre à jour le stockage
    const updatedStorage: StorageData = {
      isAuthenticated: false,
      currentUser: null,
      users: updatedUsers,
    };

    if (this.setStorageData(updatedStorage)) {
      // Supprimer les données associées à l'utilisateur (tâches, catégories, etc.)
      localStorage.removeItem(`tasks_${userId}`);
      localStorage.removeItem(`categories_${userId}`);

      // Notifier le changement d'état d'authentification
      this.notifyAuthStateChange(null);
    } else {
      throw new Error("Erreur lors de la suppression du compte");
    }
  }

  async updateProfile(data: Partial<User>): Promise<User | null> {
    const storage = this.getStorageData();

    if (!storage.currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    const userId = storage.currentUser.id;
    const userIndex = storage.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    // Mettre à jour les données de l'utilisateur
    const updatedUser = {
      ...storage.users[userIndex],
      ...data,
    };

    const updatedUsers = [...storage.users];
    updatedUsers[userIndex] = updatedUser;

    // Mettre à jour le stockage
    const updatedStorage: StorageData = {
      ...storage,
      currentUser: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
      users: updatedUsers,
    };

    if (this.setStorageData(updatedStorage)) {
      this.notifyAuthStateChange(updatedStorage.currentUser);
      return updatedStorage.currentUser;
    } else {
      throw new Error("Erreur lors de la mise à jour du profil");
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    const storage = this.getStorageData();

    if (!storage.currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    const userId = storage.currentUser.id;
    const userIndex = storage.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier le mot de passe actuel
    if (storage.users[userIndex].password !== currentPassword) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Mettre à jour le mot de passe
    const updatedUser = {
      ...storage.users[userIndex],
      password: newPassword,
    };

    const updatedUsers = [...storage.users];
    updatedUsers[userIndex] = updatedUser;

    // Mettre à jour le stockage
    const updatedStorage: StorageData = {
      ...storage,
      users: updatedUsers,
    };

    if (this.setStorageData(updatedStorage)) {
      return true;
    } else {
      throw new Error("Erreur lors de la mise à jour du mot de passe");
    }
  }
}

const authService = new MockAuthService();
export default authService;
