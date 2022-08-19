import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton} from '@mui/material';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import {Delete} from '@material-ui/icons';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../../state/tasksReducer';
import {useDispatch} from 'react-redux';
import {TaskStatuses, TaskType} from '../../api/todolist-api';

type TaskPropsType = {
    task: TaskType
    todolistID: string
}


export const Task = memo(({task, todolistID}: TaskPropsType) => {
    const dispatch = useDispatch()

    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistID))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(changeTaskStatusAC(task.id, newIsDoneValue, todolistID));
    }

    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, todolistID));
    }

    return (
        <li className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed} size={'small'}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={onClickHandler} color={'primary'}>
                <Delete/>
            </IconButton>
        </li>
    );
});

