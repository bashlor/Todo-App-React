# Todo App Monorepo

A modern todo application built with React, TypeScript, and Turborepo for efficient development and build management.

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


## 🚀 Development

To start the development server:

```bash
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

## 📱 Application Features

- ✅ **Task Management**: Create, edit, delete, and organize todos
- 🏷️ **Categories**: Organize tasks by categories
- 📊 **Dashboard**: View task statistics and progress

## 📚 Useful Links

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

