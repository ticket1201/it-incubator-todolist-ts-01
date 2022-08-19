import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType} from './store';
import {combineReducers, createStore} from 'redux';
import {tasksReducer} from './tasksReducer';
import {todolistReducer} from './todolistReducer';
import {v1} from 'uuid';
import {StatusPriorities, TaskStatuses} from '../api/todolist-api';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', order: 0, addedDate: ''},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', order: 0, addedDate: ''}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: StatusPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1'
            },
            {
                id: v1(), title: 'JS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: StatusPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: StatusPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2'
            },
            {
                id: v1(), title: 'React Book',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: StatusPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2'
            }
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);


const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return (
        <Provider store={storyBookStore}>{storyFn()}</Provider>
    );
};

export default ReduxStoreProviderDecorator;