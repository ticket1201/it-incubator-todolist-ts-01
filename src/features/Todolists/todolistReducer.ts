import {resultCodes, todolistAPI, TodolistType} from '../../api/todolist-api';
import {appActionsType, RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {fetchTasks} from './tasksReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

export const fetchTodolists = createAsyncThunk('todo/fetchTodos', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await todolistAPI.getTodolists()
        res.data.forEach(todo => dispatch(fetchTasks(todo.id)))
        return {todolists: res.data}
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolist = createAsyncThunk('todo/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await todolistAPI.creteTodolist(title)
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError<{ item: TodolistType }>(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const deleteTodolist = createAsyncThunk('todo/deleteTodolist', async (id: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(changeEntityStatusAC({id, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await todolistAPI.deleteTodolist(id)
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        dispatch(changeEntityStatusAC({id, entityStatus: 'failed'}))
        return rejectWithValue(null)
    }
})
export const changeTodolistTitle = createAsyncThunk('todo/changeTodolistTitle', async (param: { id: string, title: string }, thunkAPI) => {
    let {dispatch, rejectWithValue} = thunkAPI
    let {id, title} = param
    dispatch(changeEntityStatusAC({id, entityStatus: 'loading'}))
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await todolistAPI.updateTodolist(id, title)
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(changeEntityStatusAC({id, entityStatus: 'succeeded'}))
            return param
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        dispatch(changeEntityStatusAC({id, entityStatus: 'failed'}))
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todo',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
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
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(el => ({
                    ...el, filter: 'all', entityStatus: 'idle'
                }))
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(deleteTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(el => el.id === action.payload.id)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(el => el.id === action.payload.id)
                state[index].title = action.payload.title
            })
    }
})


export const {
    changeTodolistFilterAC,
    changeEntityStatusAC,
    clearDataAC
} = slice.actions
export const todolistReducer = slice.reducer

//TYPES

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type clearDataACType = ReturnType<typeof clearDataAC>

export type todoACType =
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | clearDataACType
    | appActionsType
