import {setIsLoggedInAC} from '../features/Login/authReducer';
import {handleServerAppError, handleServerNetworkError} from '../components/utils/error-utils';
import axios from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authAPI, resultCodes} from '../api/todolist-api';


export const initApp = createAsyncThunk('app/initialize', async (param, {dispatch}) => {
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
    }
});

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        isInitialized: false as boolean,
        error: null as null | string
    },
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(initApp.fulfilled, (state)  => {
            state.isInitialized = true
        })
    }
})


export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC} = slice.actions


export type appActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ReturnType<typeof setIsLoggedInAC>

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'