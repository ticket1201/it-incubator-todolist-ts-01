import {combineReducers} from 'redux';
import {todoACType, todolistReducer} from '../features/Todolists/todolistReducer';
import {tasksACType, tasksReducer} from '../features/Todolists/tasksReducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appActionsType, appReducer} from './app-reducer';
import {authActionsType, authReducer} from '../features/Login/authReducer';
import {configureStore} from '@reduxjs/toolkit';


const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export type RootStateType = ReturnType<typeof store.getState>
export type RootActionsType = todoACType | tasksACType | appActionsType | authActionsType
export type RootDispatchType = ThunkDispatch<RootStateType, unknown, RootActionsType>
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, RootActionsType>


// @ts-ignore
window.store = store;