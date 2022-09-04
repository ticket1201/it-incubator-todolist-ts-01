import { Dispatch } from 'redux';
import {appActionsType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';
import {ResponseType} from '../../api/todolist-api';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<appActionsType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch<appActionsType>) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}


/*
generic returns type that comes

const  identity = <T>(arg: T): T => {
    return arg;
}

const result = test(['wefge','fawfawffaw','awfawfawf'])

const reslt2 = identity<string[]>(['wefge','fawfawffaw','awfawfawf'])
const reslt3 = identity({name: 'test', age: 23})


*/
