import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar/ButtonAppBar';
import Todolists from '../features/Todolists/Todolists';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import {CustomizedSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {initApp} from './app-reducer';
import {Login} from '../features/Login/Login';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';


function App() {
    let dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)

    useEffect(()=>{
        dispatch(initApp())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%', height: '100vh'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ButtonAppBar/>
            <CustomizedSnackbar/>

            <Container fixed className={'main'}>
               <Routes>
                   <Route path={'/'} element={<Todolists/>}/>
                   <Route path={'/login'} element={<Login/>}/>
                   <Route path='*' element={<Navigate to={'/'}/>}/>
               </Routes>
            </Container>
        </div>
    );
}

export default App;
