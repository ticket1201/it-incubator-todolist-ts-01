import {Dispatch} from 'redux';
import {setIsLoggedInAC} from '../features/Login/authReducer';
import {handleServerAppError, handleServerNetworkError} from '../components/utils/error-utils';
import {authAPI} from '../api/todolist-api';
import axios from 'axios';



const initialState = {
    status: 'idle' as RequestStatusType,
    isInitialized: false as boolean,
    error: null as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: appActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/INITIALIZE':
            return {...state, isInitialized: action.isInitialized}
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppStatusAC = (status:RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)

export const setAppErrorAC = (error:null | string) => ({
    type: 'APP/SET-ERROR',
    error
} as const)
export const setIsInitialized = (isInitialized: boolean) => ({type: 'APP/INITIALIZE', isInitialized} as const)


export const initAppTC = () => async (dispatch: Dispatch<appActionsType>) => {
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setIsInitialized(true))
    }
}

export type appActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsInitialized>

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'