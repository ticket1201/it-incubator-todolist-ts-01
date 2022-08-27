import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import ButtonAppBar from '../components/ButtonAppBar/ButtonAppBar';
import {Container, Grid} from '@mui/material';
import {addTodolistsTC} from '../features/Todolists/todolistReducer';
import {useDispatch} from 'react-redux';
import Todolists from '../features/Todolists/Todolists';


function App() {
    const dispatch = useDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistsTC(title))
    }, [dispatch])

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{margin: '30px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Todolists/>
            </Container>
        </div>
    );
}

export default App;
