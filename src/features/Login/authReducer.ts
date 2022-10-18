import {AxiosError} from 'axios';
import {authAPI, FieldsErrorsType, LoginParamsType, resultCodes} from '../../api/todolist-api';
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../components/utils/error-utils';
import {clearDataAC, clearDataACType} from '../Todolists/todolistReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';


export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldsErrorsType> } }>('auth/login', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === resultCodes.success) {
            return
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        console.log(res)
        if (res.data.resultCode === resultCodes.success) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(clearDataAC())
            return
        } else {
            return rejectWithValue(null)
        }
    } catch (e) {
        let error = e as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
});

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
            .addCase(loginTC.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logoutTC.fulfilled, (state) => {
                state.isLoggedIn = false;
            })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;
export type authActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | clearDataACType