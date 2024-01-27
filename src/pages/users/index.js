
import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import UserTableData from 'src/views/users/UsersTable';


const ActiveUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
            Active Users
        </Typography>
        <Typography variant='body2'>All current active user in the system details </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <UserTableData />
        </Card>
      </Grid>

    </Grid>
  )
}

export default ActiveUser
