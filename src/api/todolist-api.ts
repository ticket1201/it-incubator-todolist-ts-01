import axios from 'axios'

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
type ResponseType<T = object> = {
    data: T
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
}

export type GetTasksResponseType<T = []> = {
    items: T[]
    totalCount: number
    error: string | null
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum StatusPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4

}

export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: number
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
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
        return instance.get<TodolistType[]>('todo-lists')
    },
    creteTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todoListID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListID}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{ item: TodolistType }>>(
            `todo-lists/${todolistId}`,
            {title}
        )
    },

}
export const tasksAPI = {
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponseType<TaskType>>(`todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`,
            {title})
    },
    updateTask(todolistID: string, taskID: string, newTitle: string) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks/${taskID}`,
            {
                title: newTitle,
                description: 'none',
                completed: false,
                status: 0,
                priority: 1,
                startDate: new Date('19.08.2022'),
                deadline: new Date('19.09.2022'),
            })
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    }
}

