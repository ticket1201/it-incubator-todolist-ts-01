import React, {ChangeEvent, memo} from 'react';
import {deleteTask, TaskDomainType, updateTask} from '../../tasksReducer';
import {TaskStatuses} from '../../../../api/todolist-api';
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useAppDispatch} from '../../../../hooks/hooks';

type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
}


export const Task = memo(({task, todolistId}: TaskPropsType) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => dispatch(deleteTask({todolistId, taskId: task.id}))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        dispatch(updateTask({todolistId, taskId: task.id, model: {status}}));
    }
    const onTitleChangeHandler = (title: string) => {
        dispatch(updateTask({todolistId, taskId: task.id, model: {title}}));
    }

    return (
        <li className={task.status === TaskStatuses.Completed ? `is-done task` : 'task'}>
            <Checkbox onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed} size={'small'}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={task.isTaskChanging}/>
            <IconButton aria-label="delete" onClick={onClickHandler} color={'primary'} disabled={task.isTaskChanging}>
                <HighlightOffIcon fontSize={'small'}/>
            </IconButton>
        </li>
    );
});

