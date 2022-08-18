import React, {useEffect, useState} from 'react'
import {todolistAPI} from '../../api/todolist-api';

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then(res => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.creteTodolist('new todo')
            .then(res => {
                setState(res.data.data.item)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    let todolistID = '061eb7b6-4308-43d3-9102-ccad63b2ccc4'
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID)
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    let todolistID = '3a3ce113-f239-4ad6-b113-df498bfbd130'
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.updateTodolist(todolistID, 'changed title2')
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}