
import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AllMessagesTable from 'src/views/message';
import TableCollapsible from 'src/views/tables/TableCollapsible';
import AboutUsTable from 'src/views/about-us';
import ServiceRateView from 'src/views/service-rate';


const ServiceRate = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
           Service Rate

        </Typography>
        <Typography variant='body2'>Content about the company service business rate </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Trading Rate' titleTypographyProps={{ variant: 'h6' }} />
          <ServiceRateView />
          {/* <TableCollapsible /> */}
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

export default ServiceRate
