
import React, {} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AppSettingsView from 'src/views/app-setting'
import AppStatusView from 'src/views/app-setting/appStatus'
import AppLandPageView from 'src/views/app-setting/appLandPage'
import CompanyBankDetails from 'src/views/app-setting/bankDetails'
import AppLogoView from 'src/views/app-setting/appLogo'


const AppSetting = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}

            System Setting

        </Typography>
        <Typography variant='body2'>Manage the application setting and display content in the app </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='App Name and Short Description' titleTypographyProps={{ variant: 'h6' }} />
          <AppSettingsView />
          {/* <TableCollapsible /> */}
        </Card>
      </Grid>

      <Grid item xs={12} marginTop={10}>
        <Card>
          <CardHeader title='App Status' titleTypographyProps={{ variant: 'h6' }} />
          <AppStatusView/>
        </Card>
      </Grid>
      <Grid item xs={12} marginTop={10}>
        <Card>
          <CardHeader title='App Landing Page Description' titleTypographyProps={{ variant: 'h6' }} />
          <AppLandPageView/>
        </Card>
      </Grid>

      <Grid item xs={12} marginTop={10}>
        <Card>
          <CardHeader title='Manage Application Images/Logo' titleTypographyProps={{ variant: 'h6' }} />
          <AppLogoView/>
        </Card>
      </Grid>

      <Grid item xs={12} marginTop={10}>
        <Card>
          <CardHeader title='Company Bank Info' titleTypographyProps={{ variant: 'h6' }} />
          <CompanyBankDetails/>
        </Card>
      </Grid>

      {/* <Grid item xs={12}>
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

export default AppSetting
