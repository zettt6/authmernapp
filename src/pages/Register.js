import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Grid, Paper, TextField, Button, Typography } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { emailRegex } from '../utils/validation'

export default function Register() {
  const navigate = useNavigate()

  async function registerUser(values) {
    try {
      const response = await axios.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      })

      localStorage.setItem('token', response.data.token)
      navigate('/users')
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required().matches(emailRegex, 'Invalid email'),
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit: registerUser,
  })

  return (
    <Grid>
      <Paper
        elevation={15}
        sx={{
          padding: 3,
          height: 'max-content',
          width: 280,
          margin: '30px auto',
          borderTop: '10px solid #af52bf',
          borderRadius: '15px',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
        }}
      >
        <TextField
          sx={{ my: 1 }}
          name='username'
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Username'
          placeholder='Enter username'
          fullWidth
          required
          error={!!formik.errors.username && !!formik.touched.username}
          helperText={!!formik.touched.username && formik.errors.username}
        />
        <TextField
          sx={{ my: 1 }}
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Email'
          placeholder='Enter email'
          type='email'
          fullWidth
          required
          error={!!formik.errors.email && !!formik.touched.email}
          helperText={!!formik.touched.email && formik.errors.email}
        />
        <TextField
          sx={{ my: 1 }}
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label='Password'
          placeholder='Enter password'
          type='password'
          fullWidth
          required
          error={!!formik.errors.password && !!formik.touched.password}
          helperText={!!formik.touched.password && formik.errors.password}
        />
        <Button
          onClick={formik.handleSubmit}
          color='primary'
          variant='contained'
          sx={{
            my: 2,
          }}
          fullWidth
        >
          Sign up
        </Button>

        <Grid align='center'>
          <Typography>
            Do you have an account?
            <br /> <Link to='/'>Sign In</Link>
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  )
}
