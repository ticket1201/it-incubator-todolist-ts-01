import {
    addTodolist,
    clearDataAC,
    clearDataACType, deleteTodolist, fetchTodolists,
} from './todolistReducer';
import {resultCodes, TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {appActionsType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {RootStateType} from '../../app/store';


export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    try {
        let res = await tasksAPI.getTasks(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        const error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (param: { todolistId: string, taskId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: true}))
    try {
        let res = await tasksAPI.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId: param.todolistId, id: param.taskId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: false}))
    }
})

export const createTask = createAsyncThunk('tasks/createTask', async (param: { todolistsId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    let res = await tasksAPI.createTask(param.todolistsId, param.title)
    try {
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListId: param.todolistsId, task: res.data.data.item}
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, model: modelTaskType }, {
    dispatch,
    getState,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: true}))
    const state = getState() as RootStateType
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task) {
        console.warn('task not found in the state')
        return rejectWithValue(null)
    }
    try {
        let res = await tasksAPI.updateTask(param.todolistId, param.taskId, {
            ...task, ...param.model
        })
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: false}))
            return {taskId: param.taskId, todolistId: param.todolistId, model: res.data.data.item}
        } else {
            handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: false}))
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        dispatch(updateTaskStatusAC({taskId: param.taskId, todolistId: param.todolistId, isTaskChanging: false}))
        return rejectWithValue(null)
    }
})


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        updateTaskStatusAC(state, action: PayloadAction<{ taskId: string, todolistId: string, isTaskChanging: boolean }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index].isTaskChanging = action.payload.isTaskChanging
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl: TodolistType) => state[tl.id] = [])
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(deleteTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(clearDataAC, () => ({}))
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map((el) => ({...el, isTaskChanging: false}))
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(el => el.id === action.payload.id)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({...action.payload.task, isTaskChanging: false})
            })
            .addCase(updateTask.fulfilled, (state,action) =>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(el => el.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
    }
})

export const tasksReducer = slice.reducer
export const {updateTaskStatusAC} = slice.actions

export type tasksACType =
    | ReturnType<typeof updateTaskStatusAC>
    | clearDataACType
    | appActionsType

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type modelTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TaskDomainType = TaskType & {
    isTaskChanging: boolean
}
