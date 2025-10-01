import { User } from './user_data'

const start = () => {
    printUserData("11111", "Ivan", new Date('2001-01-19'), 111122222)
}

function printUserData(id: string | number, firstName: string, dateofBirth: Date, phone: number): void {
    const user: User = {
        id,
        firstName,
        dateofBirth,
        phone
    }

    console.log(`User Data:
    ID: ${user.id}
    Name: ${user.firstName}
    Date of Birth: ${user.dateofBirth.toLocaleDateString()}
    Phone number: ${user.phone}
    Sex: ${user.sex || "No information available"}
    Address: ${user.address || "No address provided"}`)
}
start();