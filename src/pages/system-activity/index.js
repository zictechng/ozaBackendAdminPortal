
import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import SalesOrderTable from 'src/views/sale';
import SystemLogTable from 'src/views/logs';
import SystemActivityLogTable from 'src/views/system-activity';


const SystemActivityLog = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
            System Activities
        </Typography>
        <Typography variant='body2'>Preview of users activities in the system </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <SystemActivityLogTable />
        </Card>
      </Grid>

    </Grid>
  )
}

export default SystemActivityLog
