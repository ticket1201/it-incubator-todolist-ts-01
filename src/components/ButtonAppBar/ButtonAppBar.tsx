import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {logoutTC} from '../../features/Login/authReducer';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import LinearProgress from '@mui/material/LinearProgress';

export default function ButtonAppBar() {
    let dispatch = useAppDispatch()
    const status = useAppSelector( state => state.app.status)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <Box sx={{ flexGrow: 1, position: 'fixed', width: `100%`, zIndex: 2}}>
            <AppBar position="relative">
                <Toolbar sx={{ justifyContent: `flex-end` }}>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color="info" sx={{position: 'absolute', bottom: '-4px', left: 0, right: 0,}}/>}
            </AppBar>
        </Box>
    );
}