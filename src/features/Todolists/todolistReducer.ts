import {resultCodes, todolistAPI, TodolistType} from '../../api/todolist-api';
import {appActionsType, RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {fetchTasksTC, setTasksAC} from './tasksReducer';
import {RootThunkType} from '../../app/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//INIT STATE

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
   {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(el => ({
                ...el, filter: 'all', entityStatus: 'idle'
            }))
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
           const index = state.findIndex(el => el.id === action.payload.id)
            if(index > -1){
                state.splice(index, 1)
            }
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ value: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].filter = action.payload.value
        },
        changeEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
        clearDataAC() {
            return []
        }
    }
})


export const {
    setTodolistsAC,
    addTodolistAC,
    removeTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeEntityStatusAC,
    clearDataAC
} = slice.actions
export const todolistReducer = slice.reducer

//THUNK

export const fetchTodolistsTC = (): RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC({todolists: res.data}))
            return res.data
        })
        .then(todolists => {
            todolists.forEach(todo => dispatch(fetchTasksTC(todo.id)))

        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatusAC({status: 'succeeded'})))
}
export const addTodolistsTC = (title: string): RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.creteTodolist(title)
        .then(res => {
            if (res.data.resultCode === resultCodes.success) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError<{ item: TodolistType }>(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const deleteTodolistTC = (id: string): RootThunkType => (dispatch) => {
    dispatch(changeEntityStatusAC({id, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.deleteTodolist(id)
        .then(() => {
            dispatch(removeTodolistAC({id}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusAC({id, entityStatus: 'failed'}))
        })
}
export const changeTodolistTitleTC = (id: string, title: string): RootThunkType => (dispatch) => {
    dispatch(changeEntityStatusAC({id, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.updateTodolist(id, title)
        .then(() => {
            dispatch(changeTodolistTitleAC({id, title}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(changeEntityStatusAC({id, entityStatus: 'succeeded'}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatusAC({id, entityStatus: 'failed'}))
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
