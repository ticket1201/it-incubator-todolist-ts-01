import React, {useCallback, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {Todolist} from './Todolist/TodoList';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {addTodolistsTC, fetchTodolistsT, TodolistDomainType} from './todolistReducer';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';

const Todolists = () => {
    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistsTC(title))
    }, [dispatch])


    useEffect(() => {
        dispatch(fetchTodolistsT)
    }, [dispatch])

    return (
        <>
            <Grid container style={{margin: '30px'}}>
                <AddItemForm addItem={addTodolist} label={'Add todolist'}/>
            </Grid>
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
        </>
    );
};

export default Todolists;