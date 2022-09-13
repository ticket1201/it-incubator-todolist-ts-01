import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ReduxStoreProviderDecorator from './decorators/ReduxStoreProviderDecorator';
import {useSelector} from 'react-redux';
import {RootStateType} from '../app/store';
import {Todolist} from '../features/Todolists/Todolist/TodoList';
import {TodolistDomainType} from '../features/Todolists/todolistReducer';

export default {
    title: 'TODOLIST/TodoList',
    component: Todolist,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Todolist>;


const TodolistWithRedux = () => {
    const todoListState = useSelector<RootStateType, TodolistDomainType>(state => state.todolists[0])
    return(
        <Todolist todolist={todoListState}/>
    )
}

const Template: ComponentStory<typeof TodolistWithRedux> = () => <TodolistWithRedux/>


export const TodolistStory = Template.bind({});

