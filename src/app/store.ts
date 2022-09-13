import {applyMiddleware, combineReducers, createStore} from 'redux';
import {todoACType, todolistReducer} from '../features/Todolists/todolistReducer';
import {tasksACType, tasksReducer} from '../features/Todolists/tasksReducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appActionsType, appReducer} from './app-reducer';
import {authActionsType, authReducer} from '../features/Login/authReducer';


const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})


export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof store.getState>
export type RootActionsType = todoACType | tasksACType | appActionsType | authActionsType

export type RootDispatchType = ThunkDispatch<RootStateType, unknown, RootActionsType>
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, RootActionsType>


// @ts-ignore
window.store = store;