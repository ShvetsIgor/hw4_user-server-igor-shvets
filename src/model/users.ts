
export type User = {
    id: number,
    userName: string
}

const users: User[] = [
    {id: 7, userName: "Bond"}
]

export const addUser = (user: User): boolean => {
    if (users.findIndex(item => item.id === user.id) !== -1) //почему по индексу??????? откуда -1??
        return false;
    users.push(user);
    return true;
}

export const getAllUsers = () => [...users];

export const getUser = (id: number) => {
    return users.find(item => item.id === id) || null;
}

export const removeUser = (id: number) => {
    const index = users.findIndex(item => item.id === id);
    if (index !== -1) {
        const [deletedUser] = users.splice(index, 1);
        return deletedUser;
    }
    return null;
}

export const updateUser = (newName: string, id: number): boolean => {
    const user = getUser(id);
    if (!user)
        return false;
    else {
        user.userName = newName;
        return true;
    }
}


///////////   надо доделать эндпоинты в апп - апдейт и удаление - что там юзаем гет или пост???