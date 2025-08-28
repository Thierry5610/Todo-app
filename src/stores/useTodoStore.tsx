// src/stores/useTodoStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isToday, isThisWeek, parseISO } from 'date-fns'
import { toast } from 'sonner'

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string 
  priority: 'low' | 'medium' | 'high'
  project: string
  createdAt: string
  updatedAt: string
}

interface TodoStore {
  todos: Todo[]
  loading: boolean
  error: string | null
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  
  // Selectors
  getTodayTodos: () => Todo[]
  getWeekTodos: () => Todo[]
  getOverdueTodos: () => Todo[]
  getCompletedTodos: () => Todo[]
  
  // Utility
  setError: (error: string | null) => void
  clearError: () => void
}

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      loading: false,
      error: null,

      addTodo: async (todo) => {
        set({ loading: true, error: null })
        
        try {
          await simulateDelay()
          
          const newTodo: Todo = {
            ...todo,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set((state) => ({ 
            todos: [...state.todos, newTodo],
            loading: false 
          }))
          
          toast.success("Task added successfully!")
        } catch (error) {
          set({ error: "Failed to add task", loading: false })
          toast.error("Failed to add task")
        }
      },

      toggleTodo: async (id) => {
        set({ loading: true, error: null })
        
        try {
          await simulateDelay()
          
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id 
                ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
                : todo
            ),
            loading: false
          }))
          
          const todo = get().todos.find(t => t.id === id)
          toast.success(todo?.completed ? "Task marked as incomplete" : "Task completed!")
        } catch (error) {
          set({ error: "Failed to update task", loading: false })
          toast.error("Failed to update task")
        }
      },

      deleteTodo: async (id) => {
        set({ loading: true, error: null })
        
        try {
          await simulateDelay()
          
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
            loading: false
          }))
          
          toast.success("Task deleted successfully!")
        } catch (error) {
          set({ error: "Failed to delete task", loading: false })
          toast.error("Failed to delete task")
        }
      },

      updateTodo: async (id, updates) => {
        set({ loading: true, error: null })
        
        try {
          await simulateDelay()
          
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id 
                ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
                : todo
            ),
            loading: false
          }))
          
          toast.success("Task updated successfully!")
        } catch (error) {
          set({ error: "Failed to update task", loading: false })
          toast.error("Failed to update task")
        }
      },

      getTodayTodos: () => {
        return get().todos.filter(todo => {
          if (!todo.dueDate) return false
          try {
            return isToday(parseISO(todo.dueDate))
          } catch {
            return false
          }
        })
      },

      getWeekTodos: () => {
        return get().todos.filter(todo => {
          if (!todo.dueDate) return false
          try {
            return isThisWeek(parseISO(todo.dueDate), { weekStartsOn: 1 })
          } catch {
            return false
          }
        })
      },

      getOverdueTodos: () => {
        const now = new Date()
        return get().todos.filter(todo => {
          if (!todo.dueDate || todo.completed) return false
          try {
            return parseISO(todo.dueDate) < now
          } catch {
            return false
          }
        })
      },

      getCompletedTodos: () => {
        return get().todos.filter(todo => todo.completed)
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'todo-storage',
    }
  )
)