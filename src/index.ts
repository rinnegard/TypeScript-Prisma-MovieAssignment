import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import type { User } from "@prisma/client";


// Whitout try and catch block
// async function createUser(name: string, email: string) {
//     const user = await prisma.user.create({
//         data: {
//             name: name,
//             email: email
//         },
//     });
//     console.log(user);
// }

type createUserProps = Omit<User, "id">;

async function createUser(data : createUserProps) {
    try {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email
            },
        });
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}

async function listUsers() {
    const users = await prisma.user.findMany();
    console.log(users);
}

async function getUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    console.log(user);
}

async function updateUser(id: number, name: string) {
    const user = await prisma.user.update({
        where: { id },
        data: { name: name }
        // or email
    });
    console.log(user);
}

async function deleteUser(id: number) {
    const user = await prisma.user.delete({
        where: { id }
    });
    console.log(user);
}

const data = {
    name: "Alexander",
    email: "alexander@test.se"
}

const data2 : createUserProps = {
    name: "Alexander",
    email: "alexander@test.se"
}

createUser(data);
listUsers();
getUserById(1);
updateUser(1, "Alexander");
deleteUser(1);
