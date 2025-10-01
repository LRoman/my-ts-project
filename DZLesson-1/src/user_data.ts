export type User = {
    readonly id: string | number
    firstName: string
    lastName: string
    age: number
    sex: "male" | "female",
    address?: string | undefined
}