import {todolistAPI, TodolistType} from '../../api/todolist-api';
import {appActionsType, RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {fetchTasksTC, setTasksAC} from './tasksReducer';
import {RootThunkType} from '../../app/store';

//INIT STATE

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
   {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistReducer = (state = initialState, action: todoACType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.todolists.map(el => ({
                ...el, filter: 'all', entityStatus: 'idle'
            }))
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
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
        case 'TODO/CHANGE-ENTITY':
            return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.entityStatus} : tl)
        case 'TODO/CLEAR-DATA':
            return []
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
    todolist
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
export const changeEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: 'TODO/CHANGE-ENTITY',
    payload: {
        id,
        entityStatus
    }
}) as const
export const clearDataAC = () => ({type: 'TODO/CLEAR-DATA'}) as const
//THUNK

export const fetchTodolistsTC = ():RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            return res.data
        })
        .then(todolists => {
            todolists.forEach(todo => dispatch(fetchTasksTC(todo.id)))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const addTodolistsTC = (title: string):RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.creteTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TodolistType }>(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const deleteTodolistTC = (id: string):RootThunkType => (dispatch) => {
    dispatch(changeEntityStatusAC(id, 'loading'))
    dispatch(setAppStatusAC('loading'))
    todolistAPI.deleteTodolist(id)
        .then(() => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusAC(id, 'failed'))
        })
}
export const changeTodolistTitleTC = (id: string, title: string):RootThunkType => (dispatch) => {
    dispatch(changeEntityStatusAC(id, 'loading'))
    dispatch(setAppStatusAC('loading'))
    todolistAPI.updateTodolist(id, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeEntityStatusAC(id, 'succeeded'))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusAC(id, 'failed'))
        })
}


//TYPES

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type setTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export type setTasksACType = ReturnType<typeof setTasksAC>
export type clearDataACType = ReturnType<typeof clearDataAC>

export type todoACType =
    | setTodolistsActionType
    | addTodolistACType
    | removeTodolistACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | setTasksACType
    | clearDataACType
    | appActionsType
