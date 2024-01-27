
import React, {useContext, useEffect, useState, CSSProperties } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AdminDeletedUserView from 'src/views/admin-users/deleted'


const AdminDeletedUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
          <Link href='/'>
            Admin Users Deleted
          </Link>
        </Typography>
        <Typography variant='body2'>All current admin deleted user in the system details </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Admin User Details' titleTypographyProps={{ variant: 'h6' }} />
          <AdminDeletedUserView />
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='Dense Table' titleTypographyProps={{ variant: 'h6' }} />

        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Sticky Header' titleTypographyProps={{ variant: 'h6' }} />

        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Collapsible Table' titleTypographyProps={{ variant: 'h6' }} />

        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Spanning Table' titleTypographyProps={{ variant: 'h6' }} />

        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Customized Table' titleTypographyProps={{ variant: 'h6' }} />

        </Card>
      </Grid> */}
    </Grid>
  )
}

export default AdminDeletedUser
