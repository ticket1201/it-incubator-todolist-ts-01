import React, {useEffect} from 'react';
import {Grid} from '@mui/material';
import {Todolist} from './Todolist/TodoList';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {getTodolistsT, TodolistDomainType} from './todolistReducer';

const Todolists = () => {
    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)

    useEffect(() => {
        dispatch(getTodolistsT)
    }, [dispatch])

    return (
        <Grid container spacing={5} columns={3} justifyContent={'space-evenly'}>
            {
                todoLists.map(tl => {
                    return <Grid item lg={1} key={tl.id}>
                        <Todolist
                            todolist={tl}
                        />
                    </Grid>
                })
            }
        </Grid>
    );
};

export default Todolists;