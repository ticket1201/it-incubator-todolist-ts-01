import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {useAppSelector} from '../../app/store';
import {useDispatch} from 'react-redux';
import {logoutTC} from '../../features/Login/authReducer';

export default function ButtonAppBar() {
    let dispatch = useDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: `flex-end` }}>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}