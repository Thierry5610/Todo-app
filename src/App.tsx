// src/App.tsx
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/layout/Layout"
import Dashboard from "@/pages/Dashboard"
import DailyTodos from "@/pages/DailyTodos"
import WeeklyTodos from "@/pages/WeeklyTodos"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="todo-app-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily" element={<DailyTodos />} />
            <Route path="/weekly" element={<WeeklyTodos />} />
          </Routes>
        </Layout>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
          }}
          theme="system"
          richColors
        />
      </Router>
    </ThemeProvider>
  )
}

export default App