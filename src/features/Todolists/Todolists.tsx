import React, {useCallback, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {Todolist} from './Todolist/TodoList';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../app/store';
import {addTodolistsTC, fetchTodolistsT} from './todolistReducer';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Navigate} from 'react-router-dom';

const Todolists = () => {
    const dispatch = useDispatch()
    const todoLists = useAppSelector(state => state.todolists)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistsTC(title))
    }, [dispatch])



    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsT)
    }, [dispatch, isLoggedIn])


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container className={'addTodo'}>
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