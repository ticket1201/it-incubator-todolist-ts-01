import React from 'react';
import './App.css';

import {AddItemForm} from './AddItemForm';
import {Todolist} from './TodoList';
import ButtonAppBar from './components/ButtonAppBar';
import {Container, Grid, Paper} from '@mui/material';
import {addTodolistAC, TodolistType} from './state/todolistReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';

export type FilterValuesType = 'all' | 'active' | 'completed';


function AppWithRedux() {

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useDispatch()

    function addTodolist(title: string) {
        let action = addTodolistAC(title)
        dispatch(action)
    }


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={5} columns={3}>
                    {
                        todolists.map(tl => {
                            return <Grid item lg={1} key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        todolist={tl}
                                    />
                                </Paper>

                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
