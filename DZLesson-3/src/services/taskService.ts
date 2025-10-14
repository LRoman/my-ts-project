import { Task } from '../models/task'
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from '../constants/constants'

let tasks: Task[] = []

export const setTasks = (newTasks: Task[]) => {
  tasks = newTasks
}

export const getTaskById = (id: number): Task | undefined => {
  const task = tasks.find(t => t.id === id)
  //removed throwing error on purpose to not having to handle it in isTaskCompletedBeforeDeadline
  //and to have more soft version of the function
  //for production code, I would keep the error throwing
  //and handle it properly in the calling function
  if (!task) {
    console.warn(`Task with id: '${id}' not found`)
    return
  }
  return task
}

type CreateTaskInput = {
  title: string
  description: string
  status?: Task['status']
  priority?: Task['priority']
  deadline: Date | string
}

const nextId = (): number => {
  const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0)
  return maxId + 1
}

const toDate = (value: string | Date): Date => {
  const d = value instanceof Date ? value : new Date(value)
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date provided: ${value}`)
  }
  return d
}

export const createTask = (input: CreateTaskInput): Task => {

  if (!input.title.trim()) {
    throw new Error('Title cannot be empty')
  }

  if (!input.deadline) {
    throw new Error('Deadline is required')
  }
  const newTask: Task = {
    id: nextId(),
    title: input.title.trim(),
    description: input.description.trim(),
    createdAt: new Date(),
    status: input.status ?? DEFAULT_STATUS,
    priority: input.priority ?? DEFAULT_PRIORITY,
    deadline: toDate(input.deadline)
  }
  tasks.push(newTask)
  return newTask
}

export const updateTask = (
  id: number,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>,
): Task => {
  const taskIndex = tasks.findIndex((t) => t.id === id)
  if (taskIndex === -1) throw new Error(`Task with id ${id} not found`)

  const existingTask = tasks[taskIndex]!

  const updatedTask: Task = {
    ...existingTask,
    ...updates,
    id: existingTask.id,
    createdAt: existingTask.createdAt,
    title: updates.title ?? existingTask.title,
    deadline: updates.deadline
      ? toDate(updates.deadline as any)
      : existingTask.deadline,
  }

  tasks[taskIndex] = updatedTask
  return updatedTask
}

export const deleteTask = (id: number): boolean => {
  const taskIndex = tasks.findIndex((t) => t.id === id)
  if (taskIndex === -1) {
    console.warn(`Task with id ${id} not found`)
    return false
  }

  tasks.splice(taskIndex, 1)
  return true
}

export type TaskFilter = {
  status?: Task['status']
  priority?: Task['priority']
  createdAfter?: Date | string
  createdBefore?: Date | string
}

export const filterTasks = (filter: TaskFilter): Task[] => {
  let result = [...tasks]

  if (filter.status) {
    result = result.filter((t) => t.status === filter.status)
  }

  if (filter.priority) {
    result = result.filter((t) => t.priority === filter.priority)
  }

  if (filter.createdAfter) {
    const afterDate = toDate(filter.createdAfter)
    result = result.filter((t) => t.createdAt > afterDate)
  }

  if (filter.createdBefore) {
    const beforeDate = toDate(filter.createdBefore)
    result = result.filter((t) => t.createdAt < beforeDate)
  }

  return result
}

export const isTaskCompletedBeforeDeadline = (id: number): boolean => {
  const task = getTaskById(id)
  if (!task) {   
    return false
  }
  if (task.status !== 'done') {
    console.log(`Task with id: '${id}' is not marked as done.`)
    return false
  }
  const completedOn = task.createdAt
  const deadline = task.deadline

  const completedBeforeDeadline = completedOn <= deadline

  if (completedBeforeDeadline) {
    console.log(`Task with id: '${id}' was completed before the deadline.`)
  } else {
    console.log(`Task with id: '${id}' missed the deadline.`)
  }

  return completedBeforeDeadline

}