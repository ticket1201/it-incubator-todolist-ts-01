import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AddItemForm} from './components/AddItemForm/AddItemForm';
import {Todolist} from './components/TodoList/TodoList';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';
import {Container, Grid} from '@mui/material';
import {addTodolistsTC, getTodolistsT, TodolistDomainType} from './state/todolistReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';


function App() {

    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)

    const dispatch = useDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistsTC(title))
    }, [dispatch])

    useEffect(() => {
        dispatch(getTodolistsT)
    }, [dispatch])


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{margin: '30px'}}>
                    <AddItemForm addItem={addTodolist}/>
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
            </Container>
        </div>
    );
}

export default App;
