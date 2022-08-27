import {addTodolistACType, removeTodolistACType, setTodolistsActionType} from './todolistReducer';
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';

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
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'ADD-TASK': {
            return {...state, [action.todolistId]: [...state[action.todolistId], action.task]}
        }
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.id)
            }
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t) => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl: TodolistType) => stateCopy[tl.id] = [])
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.payload.id]: []}
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
    payload: {
        id, todolistId
    }
}) as const
export const updateTaskAC = (taskId: string, todolistId: string, model: modeTaskType) => ({
    type: 'UPDATE-TASK',
    model, taskId, todolistId
}) as const


//THUNK

export const setTasksTC = (todolistsId: string) => (dispatch: Dispatch<tasksACType>) => {
    tasksAPI.getTasks(todolistsId)
        .then(res => {
            dispatch(setTasksAC(todolistsId, res.data.items))
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<tasksACType>) => {
    tasksAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todolistId, taskId))
        })
}
export const creteTasksTC = (todolistsId: string, title: string) => (dispatch: Dispatch<tasksACType>) => {
    tasksAPI.createTask(todolistsId, title)
        .then((res) => {
            dispatch(addTaskAC(todolistsId, res.data.data.item))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: modeTaskType) =>
    (dispatch: Dispatch<tasksACType>, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find(t => t.id === taskId);
        if (task) {
            tasksAPI.updateTask(todolistId, taskId, {
                ...task, ...model
            }).then((res) => {
                dispatch(updateTaskAC(taskId, todolistId, res.data.data.item))
            })
        }

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

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type modeTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}