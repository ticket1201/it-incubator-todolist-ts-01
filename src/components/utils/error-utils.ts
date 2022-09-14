import {Dispatch} from 'redux';
import {
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from '../../app/app-reducer';
import {ResponseType} from '../../api/todolist-api';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
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
