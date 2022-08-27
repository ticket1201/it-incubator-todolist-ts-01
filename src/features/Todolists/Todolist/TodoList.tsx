import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton, Paper} from '@mui/material';
import {Delete} from '@material-ui/icons';
import {
    changeTodolistFilterAC,
    changeTodolistTitleTC, deleteTodolistTC,
    TodolistDomainType,
} from '../todolistReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../../app/store';
import {creteTasksTC, setTasksTC} from '../tasksReducer';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType} from '../../../api/todolist-api';


type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = memo(({todolist}: PropsType) => {

    const {title, id, filter} = todolist

    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])

    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch((creteTasksTC(id, title)));
    }

    const removeTodolist = () => {
        dispatch(deleteTodolistTC(id));
    }
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC(id, title));
    }, [dispatch, id])

    const onAllClickHandler = () => dispatch(changeTodolistFilterAC('all', id));
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC('active', id));
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC('completed', id));


    if (filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    useEffect(() => {
        dispatch(setTasksTC(id))
    }, [id, dispatch])


    return (
        <Paper style={{padding: '20px', borderRadius: '10px', maxWidth: '275px'}} elevation={5}>
            <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
                <IconButton aria-label="delete"
                            onClick={removeTodolist}>
                    <Delete/>
                </IconButton>

            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {
                    tasks.map(t => {
                        return <Task key={t.id} task={t} todolistID={id}/>
                    })
                }
            </ul>
            <div>
                <Button variant={filter === 'all' ? 'contained' : 'text'} color="secondary" size={'small'}
                        onClick={onAllClickHandler} style={{margin: '0 5px'}}>All</Button>
                <Button variant={filter === 'active' ? 'contained' : 'text'} color="success" size={'small'}
                        onClick={onActiveClickHandler} style={{margin: '0 5px'}}>Active</Button>
                <Button variant={filter === 'completed' ? 'contained' : 'text'} color="error" size={'small'}
                        onClick={onCompletedClickHandler} style={{margin: '0 5px'}}>Completed</Button>
            </div>
        </Paper>)
})


