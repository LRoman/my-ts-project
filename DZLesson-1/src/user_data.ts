export type User = {
    readonly id: string | number
    firstName: string
    dateofBirth: Date
    phone: string | number
    sex?: "male" | "female"
    address?: string | undefined
}