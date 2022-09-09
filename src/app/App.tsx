import React, {useEffect} from 'react';
import {useAppSelector} from './store';
import './App.css';
import ButtonAppBar from '../components/ButtonAppBar/ButtonAppBar';
import Todolists from '../features/Todolists/Todolists';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import {CustomizedSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {initAppTC} from './app-reducer';
import {Login} from '../features/Login/Login';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useDispatch} from 'react-redux';


function App() {
    let dispatch = useDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const status = useAppSelector( state => state.app.status)


    useEffect(()=>{
        dispatch(initAppTC())
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
            {status === 'loading' &&  <LinearProgress color="secondary"/>}
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
