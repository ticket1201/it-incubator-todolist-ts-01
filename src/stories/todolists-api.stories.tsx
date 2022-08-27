import React, {useEffect, useState} from 'react'
import {tasksAPI, todolistAPI} from '../api/todolist-api';

export default {
    title: 'TODOLIST/API'
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
    const [title, setTitle] = useState<any>('')

    const onclickHandler = () => {
        todolistAPI.creteTodolist(title)
            .then(res => {
                setState(res.data.data.item)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <label>
                Todolist Name
                <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState('')


    const onclickHandler = () => {
        todolistAPI.deleteTodolist(todolistID)
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [todolistID, setTodolistID] = useState('3a3ce113-f239-4ad6-b113-df498bfbd130')
    const [newTitle, setNewTitle] = useState<any>('')
    const [state, setState] = useState<any>(null)


    const onclickHandler = () => {
        todolistAPI.updateTodolist(todolistID, 'changed title2')
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <label>
                New Title
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>
    </div>
}
export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<any>('f1fb5db1-415f-496e-879b-72999109c30d')

    const onclickHandler = () => {
        tasksAPI.getTasks(todolistID)
            .then(res => {
                setState(res.data.items)
            })
            .catch((error) => {
                setState(error.message)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>
    </div>
}
export const CreateTask = () => {

    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<any>('')
    const [todolistID, setTodolistID] = useState<any>('f1fb5db1-415f-496e-879b-72999109c30d')

    const onclickHandler = () => {
        tasksAPI.createTask(todolistID, title)
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }

    return <div>
        {JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <label>
                new Title
                <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>

    </div>
}
export const UpdateTask = () => {
    const [todolistID, setTodolistID] = useState('f1fb5db1-415f-496e-879b-72999109c30d')
    const [taskID, setTaskID] = useState('')
    const [title, setTitle] = useState('')
    const [state, setState] = useState<any>(null)

    const onclickHandler = () => {
        tasksAPI.updateTask(todolistID, taskID, {title})
            .then(res => {
                setState(res.data.data.item)
            })
            .catch((error) => {
                setState(error.message)
            })
    }

    return <div>
        {JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <label>
                Task ID
                <input type="text" value={taskID} onChange={(e) => setTaskID(e.currentTarget.value)}/>
            </label>
            <label>
                New Title
                <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>

    </div>
}
export const DeleteTask = () => {
    const [todolistID, setTodolistID] = useState('f1fb5db1-415f-496e-879b-72999109c30d')
    const [taskID, setTaskID] = useState('')
    const [state, setState] = useState<any>(null)

    const onclickHandler = () => {
        tasksAPI.deleteTask(todolistID, taskID)
            .then(res => {
                setState(res.data)
            })
            .catch((error) => {
                setState(error.message)
            })
    }

    return <div>
        {JSON.stringify(state)}
        <div>
            <label>
                Todolist ID
                <input type="text" value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            </label>
            <label>
                Task ID
                <input type="text" value={taskID} onChange={(e) => setTaskID(e.currentTarget.value)}/>
            </label>
            <button onClick={onclickHandler}>Send</button>
        </div>

    </div>
}