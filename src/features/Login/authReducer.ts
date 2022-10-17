import {AxiosError} from 'axios';
import {authAPI, FieldsErrorsType, LoginParamsType, resultCodes} from '../../api/todolist-api';
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {clearDataAC, clearDataACType} from '../Todolists/todolistReducer';
import {RootThunkType} from '../../app/store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';


export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, {rejectValue: {errors:Array<string>, fieldsErrors?: Array<FieldsErrorsType>}}>('auth/login', async (param, {dispatch, rejectWithValue}) => {
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === resultCodes.success) {
           return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            debugger
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

// thunks


export const logoutTC = (): RootThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === resultCodes.success) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(clearDataAC())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export type authActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | clearDataACType