import {v1} from 'uuid';
import {addTodolistACType, removeTodolistACType} from './todolistReducer';


type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

type tsarACType =
    removeTaskACType
    | addTaskACType
    | changeTaskTitleACType
    | changeTaskStatusACType
    | addTodolistACType
    | removeTodolistACType;

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {
    ['todolist1']: [
        {
            id: '1',
            title: 'HTML',
            isDone: true,
        },
        {
            id: '2',
            title: 'CSS',
            isDone: true,
        },
        {
            id: '3',
            title: 'JS',
            isDone: false,
        }
    ]
}

export const tasksReducer = (state = initialState, action: tsarACType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.id)
            }
        }
        case 'ADD-TASK': {
            let newTask = {id: v1(), title: action.payload.title, isDone: false};
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.id ? {
                    ...el, title: action.payload.newTitle
                } : el)
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.id ? {
                    ...el, isDone: action.payload.isDone
                } : el)
            }
        }

        case 'ADD-TODOLIST': {
            return {...state, [action.payload.newTodolistId]: []}
        }
        case 'REMOVE-TODOLIST': {
            delete state[action.payload.id]
            return {...state}
        }
        default:
            return state;
    }

}

export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {title, todolistId}
    } as const
}
export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id, todolistId
        }
    } as const
}
export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {id, newTitle, todolistId}
    } as const
}
export const changeTaskStatusAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {id, isDone, todolistId}
    } as const
}

