import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {tasksReducer} from '../../features/Todolists/tasksReducer';
import {todolistReducer} from '../../features/Todolists/todolistReducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';
import thunk from 'redux-thunk';
import {appReducer, RequestStatusType} from '../../app/app-reducer';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    app: {
        status: 'idle' as RequestStatusType,
        error: null as null | string
    },
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                isTaskChanging: false
            },
            {
                id: v1(), title: 'JS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                isTaskChanging: false
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                isTaskChanging: false
            },
            {
                id: v1(), title: 'React Book',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                isTaskChanging: false
            }
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));


const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return (
        <Provider store={storyBookStore}>{storyFn()}</Provider>
    );
};

export default ReduxStoreProviderDecorator;