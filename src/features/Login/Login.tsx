import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';
import {loginTC} from './authReducer';
import {Navigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}


export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            }
            else if (values.password.length < 4) {
                errors.password = 'More that 3 symbols required'
            }
            return errors
        },
        onSubmit: async (values, formikHelpers) => {
            const res = await dispatch(loginTC(values))
            if(loginTC.rejected.match(res)){
                if (res.payload?.fieldsErrors?.length) {
                    const error = res.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        },
    });

    if(isLoggedIn){
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>If you are using Safari</p>
                    <p>please disable Cross-Origin Restrictions</p>
                    <p>{`Preferences >> Advanced, and select`}</p>
                    <p>'Disable Cross-Origin Restrictions'</p>
                    <p>To log in use common test account credentials:</p>
                    <p><b>Email: </b>free@samuraijs.com</p>
                    <p><b>Password:</b> free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField label="Email" margin="normal"
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ? <div style={{color:'red'}}>{formik.errors.email}</div> : null}
                        <TextField type="password" label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        />
                       {formik.touched.password && formik.errors.password ? <div style={{color:'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'} control={<Checkbox checked={formik.values.rememberMe}/>}
                                          {...formik.getFieldProps('rememberMe')}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>

            </FormControl>
        </Grid>
    </Grid>
}