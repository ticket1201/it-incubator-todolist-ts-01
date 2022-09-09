import React, {ChangeEvent, memo} from 'react';
import {useDispatch} from 'react-redux';
import {deleteTaskTC, TaskDomainType, updateTaskTC} from '../../tasksReducer';
import {TaskStatuses} from '../../../../api/todolist-api';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type TaskPropsType = {
    task: TaskDomainType
    todolistID: string
}


export const Task = memo(({task, todolistID}: TaskPropsType) => {
    const dispatch = useDispatch()
    const onClickHandler = () => dispatch(deleteTaskTC(todolistID, task.id))
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTaskTC(todolistID, task.id, {status}));
    }
    const onTitleChangeHandler = (title: string) => {
        dispatch(updateTaskTC(todolistID, task.id, {title}));
    }


    return (
        <li className={task.status === TaskStatuses.Completed ? `is-done task` : 'task'}>
            <Checkbox onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed} size={'small'}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={task.isTaskChanging}/>
            <IconButton aria-label="delete" onClick={onClickHandler} color={'primary'}>
                <HighlightOffIcon fontSize={'small'}/>
            </IconButton>
        </li>
    );
});

