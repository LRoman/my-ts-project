import { Status } from './status'
import { Priority } from './priority'

export type Task = {
    id: number
    title: string
    description: string
    createdAt: Date
    status?: Status
    priority?: Priority
    deadline: Date
}