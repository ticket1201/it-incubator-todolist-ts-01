import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import Input from './components/Input';
import EditableSpan from './components/EditableSpan';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    editTodolist: (todolistId: string, newTitle: string) => void
    editTask: (todolistId: string, taskID: string, newTitle: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    filter: FilterValuesType
}

export function Todolist(props: PropsType) {

    const removeTodolist = () => props.removeTodolist(props.id)
    const onAllClickHandler = () => props.changeFilter('all', props.id);
    const onActiveClickHandler = () => props.changeFilter('active', props.id);
    const onCompletedClickHandler = () => props.changeFilter('completed', props.id);

    function addTaskTypeHandler(newTitle: string) {
        props.addTask(newTitle, props.id)
    }

    function editTaskTitle(taskId: string, newTitle: string) {
        props.editTask(props.id, taskId, newTitle)
    }

    function editTodoListTitle(newTitle: string) {
        props.editTodolist(props.id, newTitle)
    }

    // const addTaskHandler = (props.)
    return <div>

        <h3>
            <EditableSpan title={props.title} callback={(newTitle) => editTodoListTitle(newTitle)}/>
            <button onClick={removeTodolist}>x</button>
        </h3>
        <Input callback={addTaskTypeHandler}/>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }

                    return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                        <button onClick={onClickHandler}>x</button>
                        <EditableSpan title={t.title} callback={(newTitle) => editTaskTitle(t.id, newTitle)}/>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}


