// src/components/layout/Layout.tsx
import Sidebar from "./Sidebar";
import { TodoDialog } from "@/components/todos/TodoDialog";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto relative lg:ml-0">
        <div className="min-h-full pt-12 md:pt-0">
          {children}
        </div>
        <TodoDialog />
      </main>
    </div>
  );
};

export default Layout;