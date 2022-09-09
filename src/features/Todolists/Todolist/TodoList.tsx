import React, {memo, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../../app/store';
import {TaskStatuses} from '../../../api/todolist-api';
import {creteTasksTC, fetchTasksTC, TaskDomainType} from '../tasksReducer';
import {
    changeTodolistFilterAC,
    changeTodolistTitleTC, deleteTodolistTC,
    TodolistDomainType,
} from '../todolistReducer';
import {Task} from './Task/Task';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Delete from '@material-ui/icons/Delete';


type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = memo(({todolist}: PropsType) => {

    const {title, id, filter, entityStatus} = todolist

    let tasks = useSelector<AppRootStateType, TaskDomainType[]>(state => state.tasks[id])

    const tasksPlaceHolder = `No tasks here...`

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
        dispatch(fetchTasksTC(id))
    }, [id, dispatch])


    return (
        <Paper elevation={5} className={'Paper'} style={{ borderRadius:'10px'}}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitle} disabled={entityStatus === 'loading'}/>
                <IconButton aria-label="delete"
                            onClick={removeTodolist}
                            disabled={entityStatus === 'loading'}
                >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} label={'New task'} disabled={entityStatus === 'loading'}/>
            <ol>
                {tasks.length
                    ? tasks.map(t => {
                        return <Task key={t.id} task={t} todolistID={id}/>
                    })
                    : <span>{tasksPlaceHolder}</span>
                }
            </ol>
            <div>
                <Button variant={filter === 'all' ? 'contained' : 'text'}  size={'small'}
                        onClick={onAllClickHandler} style={{margin: '0 5px'}}>All</Button>
                <Button variant={filter === 'active' ? 'contained' : 'text'} color="success" size={'small'}
                        onClick={onActiveClickHandler} style={{margin: '0 5px'}}>Active</Button>
                <Button variant={filter === 'completed' ? 'contained' : 'text'} color="secondary" size={'small'}
                        onClick={onCompletedClickHandler} style={{margin: '0 5px'}}>Completed</Button>
            </div>
        </Paper>)
})


