import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Users from './pages/Users'
import Register from './pages/Register'
import { Toaster } from 'react-hot-toast'

import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#af52bf',
      contrastText: '#fff',
    },
    secondary: {
      main: '#af52bf',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster
        position='bottom-right'
        containerStyle={{ fontFamily: 'Lato' }}
      />
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/users' element={<Users />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
