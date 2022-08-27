import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from '../features/Todolists/Todolist/Task/Task';
import ReduxStoreProviderDecorator from './decorators/ReduxStoreProviderDecorator';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../app/store';
import {TaskType} from '../api/todolist-api';

export default {
    title: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;


const TaskWithRedux = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
    return(
        <Task task={task} todolistID={'todolistId1'}/>
    )
}

const Template: ComponentStory<typeof TaskWithRedux> = () => <TaskWithRedux/>

export const TaskStory = Template.bind({});

