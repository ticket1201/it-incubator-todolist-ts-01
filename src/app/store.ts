import {applyMiddleware, combineReducers, createStore} from 'redux';
import {todolistReducer} from '../features/Todolists/todolistReducer';
import {tasksReducer} from '../features/Todolists/tasksReducer';
import thunk from 'redux-thunk';

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer
})



export const store = createStore(rootReducer, applyMiddleware(thunk))