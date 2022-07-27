import React, {ChangeEvent} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from '@mui/material';
import {Delete} from '@material-ui/icons';
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC, TodolistType} from './state/todolistReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasksReducer';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export function Todolist({todolist}: PropsType) {
    const {title, id, filter} = todolist
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch((addTaskAC(title, id)));
    }

    const removeTodolist = () => {
        dispatch(removeTodolistAC(id));
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleAC(id, title));
    }

    const onAllClickHandler = () => dispatch(changeTodolistFilterAC('all', id));
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC('active', id));
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC('completed', id));


    if (filter === 'active') {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.isDone);
    }


    return <div>
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
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, id));
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, id));
                    }


                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <Checkbox onChange={onChangeHandler} checked={t.isDone} size={'small'}/>
                        {/*<input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>*/}
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton aria-label="delete" onClick={onClickHandler} color={'primary'}>
                            <Delete/>
                        </IconButton>
                    </li>
                })
            }
        </ul>
        <div>

            <Button variant={filter === 'all' ? 'contained' : 'outlined'} color="secondary" size={'small'}
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={filter === 'active' ? 'contained' : 'outlined'} color="success" size={'small'}
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={filter === 'completed' ? 'contained' : 'outlined'} color="error" size={'small'}
                    onClick={onCompletedClickHandler}>Completed</Button>
        </div>
    </div>
}


