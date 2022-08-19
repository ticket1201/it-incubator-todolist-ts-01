import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ReduxStoreProviderDecorator from '../state/ReduxStoreProviderDecorator';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {Todolist} from '../components/TodoList/TodoList';
import {TodolistDomainType} from '../state/todolistReducer';

export default {
    title: 'TODOLIST/TodoList',
    component: Todolist,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Todolist>;


const TodolistWithRedux = () => {
    const todoListState = useSelector<AppRootStateType, TodolistDomainType>(state => state.todolists[0])
    return(
        <Todolist todolist={todoListState}/>
    )
}

const Template: ComponentStory<typeof TodolistWithRedux> = () => <TodolistWithRedux/>


export const TodolistStory = Template.bind({});

