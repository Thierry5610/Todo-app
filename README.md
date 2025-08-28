# Pro Todo App

The **Pro Todo App** is a modern, responsive task management application designed to help users organize their daily and weekly tasks efficiently. With a clean and intuitive interface, it allows you to easily add, manage, and track your to-do items, ensuring you stay on top of your schedule.

## ✨ Features

* **Task Management**: Add, edit, delete, and toggle the completion status of your tasks.

* **Prioritization**: Assign priorities (low, medium, high) to tasks to manage your workload effectively.

* **Time-Based Views**: Organize your tasks with dedicated pages for a daily and a weekly overview.

* **Dashboard**: Get a quick snapshot of your progress with an overview of total tasks, tasks due today, overdue tasks, and completed tasks.

* **Responsive Design**: The application is fully responsive and optimized for seamless use on both desktop and mobile devices.

* **Theme Toggle**: Switch between a light and a dark theme to suit your preference.

* **State Management**: Tasks are managed in a central store, providing a smooth and consistent user experience.

## 🚀 Technology Stack

* **React**: A JavaScript library for building user interfaces.

* **Zustand**: A lightweight and fast state management solution for React.

* **TypeScript**: A typed superset of JavaScript that improves code quality and developer experience.

* **Tailwind CSS**: A utility-first CSS framework for rapid and customizable styling.

* **shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS.

* **`date-fns`**: A comprehensive library for handling and formatting dates and times.

* **`react-router-dom`**: For declarative routing within the application.

* **Zod**: A TypeScript-first schema declaration and validation library for form data.

## 📁 Project Structure

* `src/components/`: Contains all reusable UI components, such as forms (`AddTodoForm`, `EditTodoForm`), individual todo items (`TodoItem`, `CalendarTodoItem`), and layout elements (`Layout`, `Sidebar`).

* `src/pages/`: Holds the main page components of the application, including `Dashboard.tsx`, `DailyTodos.tsx`, and `WeeklyTodos.tsx`.

* `src/stores/`: Houses the Zustand store (`useTodoStore.ts`) that manages the global application state and business logic for tasks.

* `src/lib/`: Includes utility files, such as the Zod schema for task validation (`validations/todo.ts`) and theme provider context (`theme-provider.tsx`).

* `src/App.tsx`: The entry point of the application, responsible for setting up routing and global providers.

## 🛠️ Usage

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone [https://github.com/your-username/pro-todo-app.git](https://github.com/your-username/pro-todo-app.git)
   cd pro-todo-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Run the application:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).
