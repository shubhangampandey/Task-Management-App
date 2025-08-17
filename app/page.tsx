"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Calendar, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  createdAt: string
}

export default function TaskManagementApp() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Draft and finalize the Q4 project proposal for client review",
      completed: false,
      priority: "high",
      dueDate: "2024-12-20",
      createdAt: "2024-12-15",
    },
    {
      id: "2",
      title: "Review team feedback",
      description: "Go through all team member feedback from last sprint",
      completed: true,
      priority: "medium",
      createdAt: "2024-12-14",
    },
    {
      id: "3",
      title: "Update documentation",
      completed: false,
      priority: "low",
      dueDate: "2024-12-25",
      createdAt: "2024-12-13",
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: "medium",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTasks([newTask, ...tasks])
      setNewTaskTitle("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length
  const totalCount = tasks.length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground glow-text">⚡ Task Manager</h1>
              <p className="text-muted-foreground">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Add Task Form */}
        <Card className="mb-8 glow-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1 bg-input/50 backdrop-blur-sm"
              />
              <Button onClick={addTask} disabled={!newTaskTitle.trim()}>
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_oklch(0.7_0.2_200_/_0.5)]"
                style={{
                  width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">
                  {filter === "all" && "No tasks yet. Add your first task above!"}
                  {filter === "active" && "No active tasks. Great job!"}
                  {filter === "completed" && "No completed tasks yet."}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-lg hover:glow-border bg-card/80 backdrop-blur-sm border-border/50",
                  task.completed && "opacity-75",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>

                      {task.description && (
                        <p className={cn("text-sm text-muted-foreground mb-2", task.completed && "line-through")}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {task.createdAt}</span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
