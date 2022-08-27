import {todolistAPI, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';

//INIT STATE

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
   {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistReducer = (state = initialState, action: summaryACType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.todolists.map(el => ({
                ...el, filter: 'all'
            }))
        }
        case 'ADD-TODOLIST': {
            return [
                {
                    id: action.payload.id,
                    title: action.payload.title,
                    filter: 'all',
                    addedDate: '',
                    order: 0
                },
                ...state
            ]
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


//ACTIONS

export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: 'SET-TODOLISTS',
    todolists
}) as const
export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    payload: todolist
}) as const
export const removeTodolistAC = (id: string) => ({
    type: 'REMOVE-TODOLIST',
    payload: {id}
}) as const
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {id, title}
}) as const
export const changeTodolistFilterAC = (value: FilterValuesType, todolistId: string) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {todolistId, value}
}) as const


//THUNK

export const getTodolistsT = (dispatch: Dispatch<summaryACType>) => {
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const addTodolistsTC = (title: string) => (dispatch: Dispatch<summaryACType>) => {
    todolistAPI.creteTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const deleteTodolistTC = (id: string) => (dispatch: Dispatch<summaryACType>) => {
    todolistAPI.deleteTodolist(id)
        .then(() => {
            dispatch(removeTodolistAC(id))
        })
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch<summaryACType>) => {
    todolistAPI.updateTodolist(id, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(id, title))
        })
}


//TYPES

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export type setTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>

type summaryACType =
    | setTodolistsActionType
    | addTodolistACType
    | removeTodolistACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
