// src/components/todos/TodoItem.tsx
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Calendar, Edit, MoreVertical, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/stores/useTodoStore";
import { format, isToday, isPast, parseISO, isBefore } from "date-fns";
import { EditTodoForm } from "./EditTodoForm";

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  project?: string;
}

export function TodoItem({ 
  id, 
  title, 
  description, 
  dueDate, 
  dueTime,
  priority, 
  completed, 
  project = "Default" 
}: TodoItemProps) {
  const { toggleTodo, deleteTodo, loading } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    high: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  const priorityBorders = {
    low: "border-l-blue-500",
    medium: "border-l-yellow-500",
    high: "border-l-red-500",
  };

  // Helper function to combine date and time for accurate status
  const combineDateAndTime = (dateStr: string, timeStr?: string): Date => {
    const date = parseISO(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      // Default to end of day if no time specified (23:59)
      date.setHours(23, 59, 59, 999);
    }
    return date;
  };

  // Date and time status
  const dateTimeStatus = dueDate ? (() => {
    try {
      const dueDateTime = combineDateAndTime(dueDate, dueTime);
      const now = new Date();
      
      if (isToday(parseISO(dueDate))) {
        if (dueTime && isBefore(dueDateTime, now) && !completed) {
          return { text: `Overdue (${format(dueDateTime, "h:mm a")})`, variant: "destructive" as const, urgent: true };
        }
        return { 
          text: dueTime ? `Due today at ${format(dueDateTime, "h:mm a")}` : "Due today", 
          variant: "default" as const, 
          urgent: true 
        };
      }
      
      if (isBefore(dueDateTime, now) && !completed) {
        return { 
          text: dueTime ? `Overdue (${format(parseISO(dueDate), "MMM dd")} ${format(dueDateTime, "h:mm a")})` : "Overdue", 
          variant: "destructive" as const, 
          urgent: true 
        };
      }
      
      return { 
        text: dueTime ? `${format(parseISO(dueDate), "MMM dd")} at ${format(dueDateTime, "h:mm a")}` : format(parseISO(dueDate), "MMM dd"), 
        variant: "secondary" as const, 
        urgent: false 
      };
    } catch {
      return null;
    }
  })() : null;

  if (isEditing) {
    return (
      <EditTodoForm
        todo={{ id, title, description, dueDate, dueTime, priority, completed }}
        onSave={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div 
      className={cn(
        "group flex items-start space-x-3 rounded-lg border-l-4 border bg-card p-3 md:p-4 transition-all hover:shadow-sm",
        priorityBorders[priority],
        completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={() => toggleTodo(id)}
        disabled={loading}
        className="mt-1 shrink-0"
      />
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <p className={cn(
              "font-medium break-words",
              completed && "line-through text-muted-foreground"
            )}>
              {title}
            </p>
            
            {description && (
              <p className={cn(
                "text-sm text-muted-foreground break-words",
                completed && "line-through"
              )}>
                {description}
              </p>
            )}
          </div>
          
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => deleteTodo(id)}
              disabled={loading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteTodo(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Priority badge */}
          <Badge 
            variant="secondary" 
            className={cn("text-xs", priorityColors[priority])}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
          
          {/* Due date/time */}
          {dateTimeStatus && (
            <Badge 
              variant={dateTimeStatus.variant} 
              className={cn(
                "text-xs flex items-center gap-1",
                dateTimeStatus.urgent && "animate-pulse"
              )}
            >
              {dateTimeStatus.urgent ? (
                <Clock className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              {dateTimeStatus.text}
            </Badge>
          )}
          
          {/* Project */}
          {project && project !== "Default" && (
            <Badge variant="outline" className="text-xs">
              {project}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}