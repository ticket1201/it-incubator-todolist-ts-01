import axios, {AxiosResponse} from 'axios'
import {modelTaskType} from '../features/Todolists/tasksReducer';

//AXIOS INSTANCE

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '18ee2a7f-5b8a-4b8b-9bc7-75b99a20fd9c'
    },
})

//API
export const authAPI = {
    login(data:LoginParamsType){
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>('auth/login', data)
    },
    logout(){
        return instance.delete<ResponseType>(`auth/login`);
    },
    me(){
        return instance.get<ResponseType<MeResponseType>>('auth/me')
    }
}

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
    updateTask(todolistId: string, taskId: string, model: modelTaskType) {
        return instance.put<modelTaskType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    }
}


//TYPES
export type MeResponseType ={
    id: number
    email: string
    login: string
}

export type LoginParamsType ={
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<T = object> = {
    data: T
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: resultCodes
}
export type GetTasksResponseType<T = []> = {
    items: T[]
    totalCount: number
    error: string | null
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

//enum

export enum resultCodes{
    success = 0,
    error = 1,
    captcha = 10
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}