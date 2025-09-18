# Todo App Monorepo

A modern todo application built with React, TypeScript, and Turborepo for efficient development and build management.

## 🚀 Features

- **Modern React Frontend**: Built with React 18, TypeScript, and Vite
- **Beautiful UI**: Styled with Tailwind CSS and Radix UI components
- **State Management**: Redux Toolkit with React Query for server state
- **Authentication**: Integrated with Appwrite for user management
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Monorepo Architecture**: Turborepo for efficient builds and development

## 📁 Project Structure

This Turborepo includes the following apps:

### Apps

- **`todo-react`**: Main React application with modern UI components
- **`todo-app-adonis`**: Backend API (AdonisJS) - *In Development*
- **`todo-client-app`**: Additional client application - *In Development*

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **State Management**: Redux Toolkit, React Query
- **Backend**: Appwrite (Authentication & Database)
- **Build Tool**: Turborepo, PNPM
- **Development**: ESLint, Prettier, Vitest

## 🛠️ Prerequisites

- **Node.js**: >= 24.0.0
- **PNPM**: >= 9.0.0

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app-monorepo
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy environment template in the React app
cp apps/todo-react/.env.example apps/todo-react/.env.local
```

## 🚀 Development

To start the development server:

```bash
pnpm dev
```

This will start all applications in development mode.

To develop only the React app:
```bash
cd apps/todo-react
pnpm dev
```

## 🏗️ Build

To build all apps and packages:

```bash
pnpm build
```

To build only the React app:
```bash
cd apps/todo-react
pnpm build
```

## 🧪 Testing & Linting

Run linting across all apps:
```bash
pnpm lint
```

Format code:
```bash
pnpm format
```

Type checking:
```bash
pnpm check-types
```

## 🔧 Configuration

### Environment Variables

The React app requires environment variables for Appwrite integration. Create a `.env.local` file in `apps/todo-react/`:

```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

### Turborepo Remote Caching

Turborepo can use [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines:

```bash
npx turbo login
npx turbo link
```

## 📱 Application Features

- ✅ **Task Management**: Create, edit, delete, and organize todos
- 🏷️ **Categories**: Organize tasks by categories
- 📊 **Dashboard**: View task statistics and progress
- 🔐 **Authentication**: Secure user registration and login
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Useful Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Appwrite Documentation](https://appwrite.io/docs)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
