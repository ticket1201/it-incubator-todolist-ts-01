import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton} from '@mui/material';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import {Delete} from '@material-ui/icons';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from '../../state/tasksReducer';
import {useDispatch} from 'react-redux';

type TaskPropsType = {
    task: TaskType
    todolistID: string
}


export const Task = memo(({task, todolistID}: TaskPropsType) => {
    const dispatch = useDispatch()

    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistID))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(task.id, newIsDoneValue, todolistID));
    }

    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, todolistID));
    }

    return (
        <li className={task.isDone ? 'is-done' : ''}>
            <Checkbox onChange={onChangeHandler} checked={task.isDone} size={'small'}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={onClickHandler} color={'primary'}>
                <Delete/>
            </IconButton>
        </li>
    );
});

