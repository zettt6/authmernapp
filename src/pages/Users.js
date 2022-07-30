import { Button, Grid, SvgIcon } from '@mui/material'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getFormattedDate } from '../utils/formatingDate'

import { ReactComponent as block } from '../icons/block.svg'
import { ReactComponent as unblock } from '../icons/unblock.svg'
import { ReactComponent as bin } from '../icons/bin.svg'

export default function Users() {
  const [usersData, setUsersData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:4000/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsersData(response.data)
    } catch (err) {
      navigate('/')
      toast.error(err.response.data.message)
    }
  }

  async function deleteUsers() {
    // удаленный юзер не разлогинивается
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((selectedUser) => {
      try {
        return axios.delete(
          `http://localhost:4000/auth/users/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // добавить логику если список юзеров пуст
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function blockUsers() {
    const token = localStorage.getItem('token')
    // заблокированный юзер разлогинивается и не имеет доступ к регистрации
    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(`http://localhost:4000/auth/block/${user._id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  async function unblockUsers() {
    const token = localStorage.getItem('token')

    const requests = selectedUsers.map((user) => {
      try {
        return axios.put(
          `http://localhost:4000/auth/unblock/${user._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } catch (err) {
        toast.error(err.response.data.message)
      }
    })
    Promise.all(requests).then(() => {
      getUsers()
    })
  }

  const columns = [
    { field: '_id', headerName: 'ID' },
    { field: 'username', headerName: 'username', width: 200 },
    { field: 'email', headerName: 'email', width: 200 },
    {
      field: 'createdAt',
      headerName: 'registration date',
      width: 150,
      valueGetter: getFormattedDate,
    },
    {
      field: 'lastActivity',
      headerName: 'last activity',
      width: 150,
      valueGetter: getFormattedDate,
    },
    { field: 'status', headerName: 'status', width: 150 },
  ]

  const logoutUser = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  function handleRowSelection(id) {
    const selectedIDs = new Set(id)
    const selectedRowData = usersData.filter((row) => selectedIDs.has(row._id))
    setSelectedUsers(selectedRowData)
  }

  const GridToolBar = () => {
    return (
      <GridToolbarContainer>
        <SvgIcon
          component={block}
          inheritViewBox
          sx={{
            m: 1,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#ebebeb82', borderRadius: '5px' },
          }}
          onClick={blockUsers}
        />
        <SvgIcon
          component={unblock}
          inheritViewBox
          sx={{
            m: 1,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#ebebeb82', borderRadius: '5px' },
          }}
          onClick={unblockUsers}
        />
        <SvgIcon
          component={bin}
          inheritViewBox
          sx={{
            m: 1,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#ebebeb82', borderRadius: '5px' },
          }}
          onClick={deleteUsers}
        />
      </GridToolbarContainer>
    )
  }

  return (
    <Grid align='center'>
      <Grid align='right'>
        <Button
          onClick={logoutUser}
          type='submit'
          color='primary'
          variant='contained'
          sx={{
            m: 1,
            width: 150,
          }}
          fullWidth
        >
          Log Out
        </Button>
      </Grid>
      <DataGrid
        onSelectionModelChange={handleRowSelection}
        components={{
          Toolbar: GridToolBar,
        }}
        sx={{
          height: '60vh',
          width: '70vw',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
          my: 4,
        }}
        rowsPerPageOptions={[10]}
        rows={usersData}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </Grid>
  )
}
