import axios from 'axios'

type getTodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}

type ResponseType<T = object> = {
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
    data: T
}



const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '06a5051c-4a76-4b4c-b1bc-63ff9bd7a4be',
    },
})


export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<getTodolistType>>('todo-lists')
    },
    creteTodolist(title: string) {
        return instance.post<ResponseType<{item: getTodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todoListID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListID}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{item: getTodolistType }>>(
            `todo-lists/${todolistId}`,
            {title}
        )
    },

}