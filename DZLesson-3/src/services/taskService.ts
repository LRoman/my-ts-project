import { Task, Priority, Status } from '../models/task'
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
      ? toDate(updates.deadline)
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
  status?: Status
  priority?: Priority
  createdAfter?: Date
  createdBefore?: Date
  completedBeforeDeadline?: boolean
}

export const isTaskDoneBeforeDeadline = (task: Task): boolean => {
  return task.status === 'done' && task.createdAt <= task.deadline
}

export const filterTasks = (filter: TaskFilter): Task[] => {
  const {
    status,
    priority,
    createdAfter,
    createdBefore,
    completedBeforeDeadline
  } = filter

  return tasks.filter((t) => {
    if (status && t.status !== status) return false
    if (priority && t.priority !== priority) return false
    if (createdAfter && t.createdAt < createdAfter) return false
    if (createdBefore && t.createdAt > createdBefore) return false

    //logic for deadline = "done"
    if (completedBeforeDeadline !== undefined) {
      const isBeforeDeadline = isTaskDoneBeforeDeadline(t)

      //if filter true -> getting only those that are done in time
      //if filter false -> getting only those that are not done in time or not done at all
      if (completedBeforeDeadline && !isBeforeDeadline) return false
      if (!completedBeforeDeadline && isBeforeDeadline) return false
    }

    return true
  })
}

//to check by id, just left as separate function
export const isTaskCompletedBeforeDeadline = (id: number): boolean => {
  const task = getTaskById(id)
  if (!task) {
    return false
  }
  if (task.status !== 'done') {
    console.log(`Task with id: '${id}' is not marked as done.`)
    return false
  }
  const completedBeforeDeadline = task.createdAt <= task.deadline

  if (completedBeforeDeadline) {
    console.log(`Task with id: '${id}' was completed before the deadline.`)
  } else {
    console.log(`Task with id: '${id}' missed the deadline.`)
  }

  return completedBeforeDeadline

}