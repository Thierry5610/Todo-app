// src/components/layout/Sidebar.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, Home, Calendar, CalendarDays } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTodoStore } from "@/stores/useTodoStore";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const { getTodayTodos, getWeekTodos, getOverdueTodos, todos } = useTodoStore();
  
  const todayTodos = getTodayTodos().filter(t => !t.completed);
  const weekTodos = getWeekTodos().filter(t => !t.completed);
  const overdueTodos = getOverdueTodos();
  const activeTodos = todos.filter(t => !t.completed);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigationItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: Home,
      count: activeTodos.length,
      description: "Overview"
    },
    { 
      path: "/daily", 
      label: "Today", 
      icon: Calendar,
      count: todayTodos.length,
      description: "Due today"
    },
    { 
      path: "/weekly", 
      label: "This Week", 
      icon: CalendarDays,
      count: weekTodos.length,
      description: "Weekly view"
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">todo.</h1>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Navigation */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Views</h2>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start font-normal h-auto p-3",
                    isActive && "bg-secondary"
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {item.count > 0 && (
                      <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h2>
          <div className="space-y-2">
            {overdueTodos.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-destructive">Overdue</span>
                <Badge variant="destructive" className="text-xs">
                  {overdueTodos.length}
                </Badge>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <Badge variant="secondary" className="text-xs">
                {todos.filter(t => t.completed).length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 border-r bg-background h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-40 lg:hidden bg-background/80 backdrop-blur-sm border shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;