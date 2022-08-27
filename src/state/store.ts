import {applyMiddleware, combineReducers, createStore} from 'redux';
import {todolistReducer} from './todolistReducer';
import {tasksReducer} from './tasksReducer';
import thunk from 'redux-thunk';

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer
})



export const store = createStore(rootReducer, applyMiddleware(thunk))