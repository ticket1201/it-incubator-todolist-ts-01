import {Dispatch} from 'redux';
import {setIsLoggedInAC} from '../features/Login/authReducer';
import {handleServerAppError, handleServerNetworkError} from '../components/utils/error-utils';
import {authAPI, resultCodes} from '../api/todolist-api';
import axios from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = {
    status: 'idle' as RequestStatusType,
    isInitialized: false as boolean,
    error: null as null | string
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})


export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC, setIsInitialized} = slice.actions


export const initAppTC = () => async (dispatch: Dispatch<appActionsType>) => {
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setIsInitialized({isInitialized: true}))
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