import React from 'react';
import {useAppSelector} from './store';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar/ButtonAppBar';
import Todolists from '../features/Todolists/Todolists';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {CustomizedSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';


function App() {
    const status = useAppSelector( state => state.app.status)

    return (
        <div className="App">
            <ButtonAppBar/>
            <CustomizedSnackbar/>
            {status === 'loading' &&  <LinearProgress color="secondary"/>}
            <Container fixed>
                <Todolists/>
            </Container>

        </div>
    );
}

export default App;
