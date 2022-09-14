import {
    addTodolistAC,
    addTodolistACType, clearDataAC,
    clearDataACType, removeTodolistAC,
    removeTodolistACType,
    setTasksACType, setTodolistsAC,
    setTodolistsActionType
} from './todolistReducer';
import {resultCodes, TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {RootStateType, RootThunkType} from '../../app/store';
import {appActionsType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.tasks.map((el )=> ({...el, isTaskChanging: false}))
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, isTaskChanging: false})
        },
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, id: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
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
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((tl: TodolistType) => state[tl.id] = [])
        });
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(clearDataAC, () => ({}));
    }
})

export const tasksReducer = slice.reducer
export const {setTasksAC, addTaskAC, removeTaskAC, updateTaskAC, updateTaskStatusAC} = slice.actions


//THUNK

export const fetchTasksTC = (todolistId: string): RootThunkType => (dispatch) => {
    tasksAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC({todolistId, tasks: res.data.items}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string): RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: true}))
    tasksAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === resultCodes.success) {
                dispatch(removeTaskAC({todolistId, id: taskId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(updateTaskStatusAC({taskId, todolistId, isTaskChanging: false}))
        })
}
export const creteTasksTC = (todolistsId: string, title: string): RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    tasksAPI.createTask(todolistsId, title)
        .then((res) => {
            if (res.data.resultCode === resultCodes.success) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
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
    | setTasksACType
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
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
