// src/pages/DailyTodos.tsx
import { useTodoStore } from "@/stores/useTodoStore"
import { TodoItem } from "@/components/todos/TodoItem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"

const DailyTodos = () => {
  const { getTodayTodos, loading } = useTodoStore()
  const todayTodos = getTodayTodos()
  const completedToday = todayTodos.filter(todo => todo.completed)
  const pendingToday = todayTodos.filter(todo => !todo.completed)

  if (loading && todayTodos.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Today</h1>
          </div>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {completedToday.length} completed
          </Badge>
          <Badge variant={pendingToday.length > 0 ? "default" : "secondary"}>
            {pendingToday.length} pending
          </Badge>
        </div>
      </div>

      {/* Progress Summary */}
      {todayTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Progress</CardTitle>
            <CardDescription>
              {completedToday.length} of {todayTodos.length} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${todayTodos.length > 0 ? (completedToday.length / todayTodos.length) * 100 : 0}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Tasks */}
      {pendingToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>
              Tasks due today that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingToday.map((todo) => (
                <TodoItem key={todo.id} {...todo} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Today</CardTitle>
            <CardDescription>
              Tasks you've finished today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedToday.map((todo) => (
                <TodoItem key={todo.id} {...todo} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {todayTodos.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No tasks for today</h3>
              <p className="text-muted-foreground">
                You don't have any tasks due today. Enjoy your day!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DailyTodos