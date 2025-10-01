import { User } from './user_data'

const start = () => {
    printUserData("11111", "Ivan", "Ivanovich", 34)
}

function printUserData(id: string | number, firstName: string, lastName: string, age: number): void {
    const user: User = {
        id,
        firstName,
        lastName,
        age,
        sex: age > 18 ? "male" : "female"
    }

    console.log(`User Data:
    ID: ${user.id}
    Name: ${user.firstName} ${user.lastName}
    Age: ${user.age}
    Sex: ${user.sex}
    Address: ${user.address || "No address provided"}`)
}
start();