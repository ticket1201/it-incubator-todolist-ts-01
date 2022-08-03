import {v1} from 'uuid';

export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>

type summaryACType = removeTodolistACType | changeTodolistTitleACType | changeTodolistFilterACType | addTodolistACType


export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

const initialState:Array<TodolistType> = [
    {
        id:'todolist1',
        title: 'What to learn',
        filter: 'all'
    }
]

export const todolistReducer = (state=initialState, action: summaryACType): Array<TodolistType> => {
    switch (action.type) {
        case 'ADD-TODOLIST': {
            let newTodolist: TodolistType = {
                id: action.payload.newTodolistId,
                title: action.payload.title,
                filter: 'all'
            };

            return [newTodolist, ...state]
        }

        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.id)
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }

        default:
            return state
    }
}

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {newTodolistId: v1(), title}
    } as const
}
export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {id}
    } as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {id, title}
    } as const
}
export const changeTodolistFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {todolistId, value}
    } as const
}
