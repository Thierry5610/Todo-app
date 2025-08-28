// src/components/todos/CalendarTodoItem.tsx
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/stores/useTodoStore";
import { EditTodoForm } from "./EditTodoForm";

interface CalendarTodoItemProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  project?: string;
  compact?: boolean; // For mobile view
}

export function CalendarTodoItem({ 
  id, 
  title, 
  description, 
  dueDate, 
  priority, 
  completed, 
  project = "Default",
  compact = false
}: CalendarTodoItemProps) {
  const { toggleTodo, deleteTodo, loading } = useTodoStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const priorityBgColors = {
    low: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    medium: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
    high: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  };

  // Truncate title for calendar view
  const displayTitle = title.length > (compact ? 30 : 20) ? `${title.slice(0, compact ? 30 : 20)}...` : title;

  const handleEditSave = () => {
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  // Edit Modal Component
  const EditModal = () => (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details and due date.
          </DialogDescription>
        </DialogHeader>
        <EditTodoForm
          todo={{ id, title, description, dueDate, priority, completed }}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      </DialogContent>
    </Dialog>
  );

  if (compact) {
    // Mobile/tablet view - similar to original TodoItem but more compact
    return (
      <>
        <div 
          className={cn(
            "group flex items-start space-x-2 rounded-md border p-2 transition-all hover:shadow-sm",
            priorityBgColors[priority],
            completed && "opacity-60"
          )}
        >
          <Checkbox
            checked={completed}
            onCheckedChange={() => toggleTodo(id)}
            disabled={loading}
            className="mt-0.5 shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-medium break-words leading-tight",
                  completed && "line-through text-muted-foreground"
                )}>
                  {title}
                </p>
                
                {description && (
                  <p className={cn(
                    "text-xs text-muted-foreground break-words mt-1",
                    completed && "line-through"
                  )}>
                    {description}
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTodo(id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Priority indicator */}
            <div className="flex items-center gap-1 mt-1">
              <div className={cn("w-2 h-2 rounded-full", priorityColors[priority])} />
              <span className="text-xs text-muted-foreground capitalize">{priority}</span>
            </div>
          </div>
        </div>
        <EditModal />
      </>
    );
  }

  // Desktop calendar view - compact card style
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "group relative rounded-md border p-2 text-xs transition-all hover:shadow-sm cursor-pointer",
              priorityBgColors[priority],
              completed && "opacity-60"
            )}
          >
            {/* Priority indicator bar */}
            <div 
              className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-md", priorityColors[priority])}
            />
            
            <div className="pl-2">
              <div className="flex items-start justify-between gap-1 mb-1">
                <Checkbox
                  checked={completed}
                  onCheckedChange={() => toggleTodo(id)}
                  disabled={loading}
                  className="h-3 w-3 mt-0.5 shrink-0"
                />
                
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-2.5 w-2.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteTodo(id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className={cn(
                "font-medium break-words leading-tight mb-1",
                completed && "line-through text-muted-foreground"
              )}>
                {displayTitle}
              </p>
              
              {/* Priority badge - only show for high priority */}
              {priority === 'high' && !completed && (
                <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                  High
                </Badge>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-1">
            <p className="font-medium">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full", priorityColors[priority])} />
                <span className="capitalize">{priority} priority</span>
              </div>
              {project !== "Default" && (
                <Badge variant="outline" className="text-xs">
                  {project}
                </Badge>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      <EditModal />
    </TooltipProvider>
  );
}