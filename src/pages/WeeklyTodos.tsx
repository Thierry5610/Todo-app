// src/pages/WeeklyTodos.tsx
import { useTodoStore } from "@/stores/useTodoStore"
import { CalendarTodoItem } from "@/components/todos/CalendarTodoItem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  isToday, 
  parseISO, 
  eachDayOfInterval,
  isSameDay 
} from "date-fns"

const WeeklyTodos = () => {
  const { getWeekTodos, loading } = useTodoStore()
  const weekTodos = getWeekTodos()
  const completedThisWeek = weekTodos.filter(todo => todo.completed)
  const pendingThisWeek = weekTodos.filter(todo => !todo.completed)
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  
  // Get all days of the week
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  // Group todos by day
  const todosByDay = weekDays.reduce((acc, day) => {
    const dayKey = format(day, "yyyy-MM-dd")
    const todosForDay = weekTodos.filter(todo => {
      if (!todo.dueDate) return false
      try {
        const dueDate = parseISO(todo.dueDate)
        return isSameDay(dueDate, day)
      } catch {
        return false
      }
    })
    
    acc[dayKey] = {
      date: day,
      todos: todosForDay,
      isToday: isToday(day)
    }
    return acc
  }, {} as Record<string, { date: Date; todos: typeof weekTodos; isToday: boolean }>)

  if (loading && weekTodos.length === 0) {
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
            <Calendar className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-bold">This Week</h1>
          </div>
          <p className="text-muted-foreground">
            {format(weekStart, "MMM do")} - {format(weekEnd, "MMM do, yyyy")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {completedThisWeek.length} completed
          </Badge>
          <Badge variant={pendingThisWeek.length > 0 ? "default" : "secondary"}>
            {pendingThisWeek.length} pending
          </Badge>
        </div>
      </div>

      {/* Week Progress */}
      {weekTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Week Progress</CardTitle>
            <CardDescription>
              {completedThisWeek.length} of {weekTodos.length} tasks completed this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${weekTodos.length > 0 ? (completedThisWeek.length / weekTodos.length) * 100 : 0}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Calendar View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div 
                  key={format(day, "yyyy-MM-dd")}
                  className={`p-4 border-r last:border-r-0 text-center ${
                    isToday(day) ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="font-medium text-sm">
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${
                    isToday(day) ? 'text-primary' : ''
                  }`}>
                    {format(day, "d")}
                  </div>
                  {isToday(day) && (
                    <Badge variant="default" className="text-xs mt-1">
                      Today
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {/* Calendar Body */}
            <div className="grid grid-cols-7 min-h-[400px]">
              {weekDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd")
                const dayData = todosByDay[dayKey]
                
                return (
                  <div 
                    key={dayKey}
                    className="border-r last:border-r-0 p-2 space-y-2 bg-background"
                  >
                    {/* Pending todos first */}
                    {dayData.todos
                      .filter(todo => !todo.completed)
                      .map((todo) => (
                        <CalendarTodoItem key={todo.id} {...todo} />
                      ))}
                    
                    {/* Completed todos */}
                    {dayData.todos
                      .filter(todo => todo.completed)
                      .map((todo) => (
                        <CalendarTodoItem key={todo.id} {...todo} />
                      ))}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile/Tablet View - Keep the current card-based layout */}
      <div className="md:hidden space-y-4">
        {weekDays.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd")
          const dayData = todosByDay[dayKey]
          
          if (dayData.todos.length === 0) return null
          
          return (
            <Card key={dayKey} className={dayData.isToday ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {format(day, "EEEE, MMM do")}
                  {dayData.isToday && (
                    <Badge variant="default" className="text-xs">Today</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {dayData.todos.filter(t => t.completed).length} of {dayData.todos.length} tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Pending tasks first */}
                  {dayData.todos
                    .filter(todo => !todo.completed)
                    .map((todo) => (
                      <CalendarTodoItem key={todo.id} {...todo} compact />
                    ))}
                  {/* Then completed tasks */}
                  {dayData.todos
                    .filter(todo => todo.completed)
                    .map((todo) => (
                      <CalendarTodoItem key={todo.id} {...todo} compact />
                    ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {weekTodos.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No tasks this week</h3>
              <p className="text-muted-foreground">
                You don't have any tasks scheduled for this week.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WeeklyTodos