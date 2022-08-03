import React, {useCallback} from 'react';
import './App.css';

import {AddItemForm} from './components/AddItemForm/AddItemForm';
import {Todolist} from './components/TodoList/TodoList';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';
import {Container, Grid, Paper} from '@mui/material';
import {addTodolistAC, TodolistType} from './state/todolistReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';




function App() {

    const todoLists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useDispatch()

    const addTodolist = useCallback((title: string) => {
        let action = addTodolistAC(title)
        dispatch(action)
    },[dispatch])


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={5} columns={3}>
                    {
                        todoLists.map(tl => {
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

export default App;
