// src/pages/Dashboard.tsx
import { useTodoStore } from "@/stores/useTodoStore"
import { TodoItem } from "@/components/todos/TodoItem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const Dashboard = () => {
  const { todos, getTodayTodos, getWeekTodos, getOverdueTodos, getCompletedTodos, loading } = useTodoStore()

  const todayTodos = getTodayTodos()
  const weekTodos = getWeekTodos()
  const overdueTodos = getOverdueTodos()
  const completedTodos = getCompletedTodos()
  const allTodos = todos.filter(todo => !todo.completed)

  const stats = [
    {
      title: "Total Tasks",
      value: allTodos.length,
      icon: CalendarDays,
      description: "Active tasks"
    },
    {
      title: "Due Today",
      value: todayTodos.filter(t => !t.completed).length,
      icon: Clock,
      description: "Tasks due today"
    },
    {
      title: "Overdue",
      value: overdueTodos.length,
      icon: AlertTriangle,
      description: "Past due date",
      variant: "destructive" as const
    },
    {
      title: "Completed",
      value: completedTodos.length,
      icon: CheckCircle,
      description: "Tasks completed",
      variant: "secondary" as const
    }
  ]

  if (loading && todos.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid gap-4 md:gap-6">
          {/* Loading skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tasks and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.variant && stat.value > 0 && (
                    <Badge variant={stat.variant} className="text-xs">
                      {stat.variant === "destructive" ? "!" : "✓"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Due Today
            </CardTitle>
            <CardDescription>
              Tasks that are due today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayTodos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tasks due today
                </p>
              ) : (
                todayTodos.slice(0, 3).map((todo) => (
                  <TodoItem key={todo.id} {...todo} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Overdue Tasks
            </CardTitle>
            <CardDescription>
              Tasks that are past their due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueTodos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No overdue tasks
                </p>
              ) : (
                overdueTodos.slice(0, 3).map((todo) => (
                  <TodoItem key={todo.id} {...todo} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Active Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>All Active Tasks</CardTitle>
          <CardDescription>
            All your current tasks ({allTodos.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTodos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active tasks</p>
                <p className="text-sm text-muted-foreground">
                  Click the + button to add your first task
                </p>
              </div>
            ) : (
              allTodos.map((todo) => (
                <TodoItem key={todo.id} {...todo} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard