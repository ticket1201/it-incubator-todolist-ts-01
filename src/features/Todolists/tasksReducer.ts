import {addTodolistACType, removeTodolistACType, setTodolistsActionType} from './todolistReducer';
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {appActionsType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';

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

export const tasksReducer = (state = initialState, action: tasksACType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks.map((el) => ({...el, isTaskChanging: false}))}
        }
        case 'ADD-TASK': {
            return {...state, [action.todolistId]: [...state[action.todolistId], {...action.task, isTaskChanging: false}]}
        }
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.id)
            }
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t) => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case 'UPDATE-TASK-STATUS':{
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t) => t.id === action.taskId ? {...t, isTaskChanging: action.isTaskChanging} : t)
            }
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl: TodolistType) => stateCopy[tl.id] = [])
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            delete state[action.payload.id]
            return {...state}
        }
        default:
            return state;
    }
}

//ACTIONS

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({
    type: 'SET-TASKS', todolistId, tasks
}) as const
export const addTaskAC = (todolistId: string, task: TaskType) => ({
    type: 'ADD-TASK', task, todolistId
}) as const
export const removeTaskAC = (todolistId: string, id: string) => ({
    type: 'REMOVE-TASK',
        id, todolistId
}) as const
export const updateTaskAC = (taskId: string, todolistId: string, model: modelTaskType) => ({
    type: 'UPDATE-TASK',
    model, taskId, todolistId
}) as const
export const updateTaskStatusAC = (taskId: string, todolistId: string, isTaskChanging: boolean) => ({
    type: 'UPDATE-TASK-STATUS',
    taskId, todolistId, isTaskChanging
}) as const


//THUNK

export const fetchTasksTC = (todolistsId: string) => (dispatch: Dispatch<tasksACType>) => {
    tasksAPI.getTasks(todolistsId)
        .then(res => {
            dispatch(setTasksAC(todolistsId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<tasksACType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(updateTaskStatusAC(taskId, todolistId, true))
    tasksAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(updateTaskStatusAC(taskId, todolistId, false))
        })
}
export const creteTasksTC = (todolistsId: string, title: string) => (dispatch: Dispatch<tasksACType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksAPI.createTask(todolistsId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(todolistsId, res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: modelTaskType) =>
    (dispatch: Dispatch<tasksACType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(updateTaskStatusAC(taskId, todolistId, true))
        const task = getState().tasks[todolistId].find(t => t.id === taskId);
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        tasksAPI.updateTask(todolistId, taskId, {
            ...task, ...model
        })
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, todolistId, res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                    dispatch(updateTaskStatusAC(taskId, todolistId, false))
                } else {
                    handleServerAppError<{ item: TaskType }>(res.data, dispatch)
                    dispatch(updateTaskStatusAC(taskId, todolistId, false))
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
                dispatch(updateTaskStatusAC(taskId, todolistId, false))
            })
    }


//TYPES

type tasksACType =
    | setTodolistsActionType
    | addTodolistACType
    | removeTodolistACType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof updateTaskStatusAC>
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
