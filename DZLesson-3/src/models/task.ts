export type Task = {
    id: number
    title: string
    description: string
    createdAt: Date
    status?: Status
    priority?: Priority
    deadline: Date
}

export enum Status {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}