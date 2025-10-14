import tasks from '../data/tasks.json'
import { z } from 'zod'
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from '../constants/constants'

const TaskSchema = z.object({
    id: z.number(),
    title: z.string().min(1),
    description: z.string().min(1),
    createdAt: z.coerce.date(),
    status: z.enum(["todo", "in_progress", "done"]).default(DEFAULT_STATUS),
    priority: z.enum(["low", "medium", "high"]).default(DEFAULT_PRIORITY),
    deadline: z.coerce.date()
})
type Task = z.infer<typeof TaskSchema>

const TasksSchema = z.array(TaskSchema)

export const parsedTasks: Task[] = TasksSchema.parse(tasks)