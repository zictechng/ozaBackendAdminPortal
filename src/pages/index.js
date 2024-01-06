import React, {useEffect} from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import CardContent from '@mui/material/CardContent'
import { AccountAlert, AccountCancel, AccountCheck, AccountGroup } from 'mdi-material-ui'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Dashboard = () => {
  // const navigate = useNavigate()

  // // ** Hook
  // //const theme = useTheme()
  // const router = useRouter()
  //   const user = '';

  // useEffect(() => {
  //   if(user == '') {
  //     navigate('/pages/login')
  //   }
  // }, [user])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview />
        </Grid> */}
        <Grid item xs={12} md={6} lg={4}>
          <TotalEarning />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='10,000,000'
                icon={<AccountGroup />}
                color='secondary'
                trendNumber='+42%'
                title='All Users'
                subtitle='Total users signup for the platform'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='9,500,000'
                title='Active Users'
                trend='negative'
                color='success'

                //trendNumber='-15%'
                subtitle='Total active users in the platform'
                icon={<AccountCheck />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='300,000'
                trend='negative'
                color='warning'

                //trendNumber='-18%'
                title='Pending Users'
                subtitle='Total users accounts that is not yet activated/approved'
                icon={<AccountAlert />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='200,000'
                color='error'
                trend='negative'
                trendNumber='-18%'
                subtitle='Total users accounts that was suspended in the platform'
                title='Users Suspended'
                icon={<AccountCancel />}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <SalesByCountries />
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          <DepositWithdraw />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={12}>
          <Grid container spacing={6}>
            <Grid item xs={3}>
              <CardStatisticsVerticalComponent
                stats='$25.6k'
                icon={<Poll />}
                color='success'
                trendNumber='+42%'
                title='Total Profit'
                subtitle='Weekly Profit'
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticsVerticalComponent
                stats='$78'
                title='Refunds'
                trend='negative'
                color='secondary'
                trendNumber='-15%'
                subtitle='Past Month'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticsVerticalComponent
                stats='862'
                trend='negative'
                trendNumber='-18%'
                title='New Project'
                subtitle='Yearly Project'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={3}>
              <CardStatisticsVerticalComponent
                stats='15'
                color='warning'
                trend='negative'
                trendNumber='-18%'
                subtitle='Last Week'
                title='Sales Queries'
                icon={<HelpCircleOutline />}
              />
            </Grid>
          </Grid>
        </Grid> */}
        {' '}
        {/* <CardContent>

        </CardContent> */}
        <Grid item xs={12}>
        {/* <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            MUI Tables
          </Link>
        </Typography> */}

        <Grid item xs={12} >
        <Typography variant='body2'
        style={{
          height: "5vh",
          paddingTop: "12px"
        }}
      >
        Recent transaction</Typography>
        </Grid>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
