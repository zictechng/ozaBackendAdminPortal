import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import ScaleLoader from "react-spinners/ScaleLoader";

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import { AccountAlert, AccountCancel, AccountCheck, AccountGroup } from 'mdi-material-ui'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AuthContext } from 'src/@core/context/authContext';
import { AuthenticateUser, AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import client from 'src/@core/context/client';

import 'react-toastify/dist/ReactToastify.css';

const useUser = () => ({ user: null, loading: false })

const Dashboard = () => {

  // ** States
  const [anchorEl, setAnchorEl] = useState(true);
  const [todaySale, setTodaySale] = useState('');
  const [accountFund, setAccountFund] = useState('');
  const [payPalSale, setPayPalSale] = useState('');
  const [payoneerSale, setPayoneerSale] = useState('');
  const [bitcoinSale, setBitcoinSale] = useState('');

  const [allUsers, setAllUsers] = useState('');
  const [activeUsers, setActiveUsers] = useState('');
  const [pendingUsers, setPendingUsers] = useState('');
  const [suspendedUsers, setSuspendedUsers] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);


  // ** Hook
  //const theme = useTheme()
  const router = useRouter()
  const {test, loading, isAuthenticated, userToken} = useContext(AuthContext)

  const userTokenId = localStorage.getItem('userToken')
  const userPro = localStorage.getItem('userInfo')

  const override = {
    display: "block",
    margin: "0 auto",

    //borderColor: "red",
  };

  const handleRedirect = PageRedirect('/pages/login')


  // check user login authorization if valid
  const CheckUserLogin = () =>{
    AuthenticateUserCheck(userTokenId).then((res)=>
        {
          if(res.status == '401'){
            router.replace(handleRedirect)
            localStorage.clear()
          }
          else if(res.status == '402'){
            router.replace(handleRedirect)
            localStorage.clear()
          }
        });
      }

  // get daily sales stats here
  const dailySalesStats = async() =>{
    setLoadingFetch(true)
      try {
        const res = await client.get(`/api/dashboard_salesReport`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          }
        })

      //console.log(res.data);
      if(res.data.msg =='201'){
      //console.log('Daily Sales ' ,res.data);
      setTodaySale(res.data)
      setPayPalSale(res.data.feedPaypal)
      setPayoneerSale(res.data.feedPayoneer)
      setBitcoinSale(res.data.feedBitcoin)
      setAccountFund(res.data.feedAcctFund)
      }
      } catch (error) {
        console.log(error.message)
      }
      finally{
        setLoadingFetch(false)
      }
  }

 // get daily sales stats here
 const getUserStats = async() =>{
  try {
    const res = await client.get(`/api/dashboard_userReport`, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      }
    })

  //console.log(res.data);
  if(res.data.msg =='201'){
  //console.log('Daily Sales ' ,res.data);
  setAllUsers(res.data.feedAll)
  setActiveUsers(res.data.feedActive)
  setPendingUsers(res.data.feedPending)
  setSuspendedUsers(res.data.feedSuspended)
  }
  } catch (error) {
    console.log(error.message)
  }
}

  useEffect(() => {
      const userInfo = localStorage.getItem('userInfo')
      const userToken = localStorage.getItem('userToken')

    // get local storage details
    const userLocal = localStorage.getItem('userToken')
    CheckUserLogin()

    dailySalesStats()
    getUserStats()

    //payPalSalesStats()

    if (userLocal == null) {
      router.push(handleRedirect)
      }
    else{
      console.log('User authenticated');
    }

  }, [])

  return (
    <ApexChartWrapper>
      {/* {anchorEl ?
      <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ScaleLoader
          color={'#1D2667'}
          cssOverride={override}
          size={80}
      />
      </Box>
      : ''} */}

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy data={todaySale.feedback}
          loading={loadingFetch}/>
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard
          payPalSales={payPalSale}
          payoneerSales={payoneerSale}
          bitcoinSales={bitcoinSale}
          acctFund={accountFund}/>
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
                stats={allUsers}
                icon={<AccountGroup />}
                color='secondary'
                trendNumber='+42%'
                title='All Users'
                subtitle='Total users signup for the platform'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={activeUsers}
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
                stats={pendingUsers}
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
                stats={suspendedUsers}
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
