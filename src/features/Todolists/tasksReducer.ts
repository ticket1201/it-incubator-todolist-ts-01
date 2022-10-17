import {
    addTodolistAC,
    addTodolistACType, clearDataAC,
    clearDataACType, removeTodolistAC,
    removeTodolistACType,
    setTodolistsAC,
    setTodolistsActionType
} from './todolistReducer';
import {resultCodes, TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {RootStateType, RootThunkType} from '../../app/store';
import {appActionsType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

//INIT STATE

const initialState: TasksStateType = {
    /*"todolistId1": [
       { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
   ],
   "todolistId2": [
       { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
   ]*/
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    try {
        let res = await tasksAPI.getTasks(todolistId)
        dispatch(setAppStatusAC({status: 'idle'}))
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

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        updateTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string, model: modelTaskType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
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
            .addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach((tl: TodolistType) => state[tl.id] = [])
            })
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
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

    }
})

export const tasksReducer = slice.reducer
export const {updateTaskAC, updateTaskStatusAC} = slice.actions


//THUNK

export const updateTaskTC = (todolistId: string, taskId: string, model: modelTaskType): RootThunkType =>
    (dispatch, getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: true}))
        const task = getState().tasks[todolistId].find(t => t.id === taskId);
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        tasksAPI.updateTask(todolistId, taskId, {
            ...task, ...model
        })
            .then((res) => {
                if (res.data.resultCode === resultCodes.success) {
                    dispatch(updateTaskAC({taskId, todolistId, model: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: false}))
                } else {
                    handleServerAppError<{ item: TaskType }>(res.data, dispatch)
                    dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: false}))
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
                dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: false}))
            })
    }


//TYPES

export type tasksACType =
    | setTodolistsActionType
    | addTodolistACType
    | removeTodolistACType
    | ReturnType<typeof updateTaskAC>
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
