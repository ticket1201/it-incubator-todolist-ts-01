import {applyMiddleware, combineReducers, createStore} from 'redux';
import {todolistReducer} from '../features/Todolists/todolistReducer';
import {tasksReducer} from '../features/Todolists/tasksReducer';
import thunk from 'redux-thunk';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {appReducer} from './app-reducer';


const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer
})


export const store = createStore(rootReducer, applyMiddleware(thunk))
export type AppRootStateType = ReturnType<typeof rootReducer>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store;