import React, {useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import BeatLoader from "react-spinners/BeatLoader";

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import client from 'src/@core/context/client'
import { NumberDollarValueFormat } from 'src/@core/function/formatDollarNumber'
import { NumberValueFormat } from 'src/@core/function/formatNumberValue'
import { Account, AccountAlert, AccountCancel, AccountCheck, AccountGroup } from 'mdi-material-ui'


const TotalEarning = () => {
  const [todaySale, setTodaySale] = useState('');
  const [newFundData, setNewFundData] = useState([]);
  const userTokenId = localStorage.getItem('userToken')
  const userInfo = localStorage.getItem('userInfo')

  const [show, setShow] = useState(false)
    useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 3000)

    return () => clearTimeout(timeout)

  }, [show])


  // get daily user funding stats here
  const userFundingStats = async() =>{
    try {
      const res = await client.get(`/api/daily_fundingReport`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

  // console.log(res.data);
  if(res.data.msg =='201'){
    setTodaySale(res.data)
    setNewFundData(res.data.feedCurrentFund)

    }
    } catch (error) {
      console.log(error.message)
    }
  }

    const verifyUserLogin = async ()=>{
  try {
    const res = await client.get(`/api/checkUserLogin/${userInfo.userData._id}`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          }
        })

    //console.log(res.data);
    if(res.data.msg =='200'){
      //console.log('Authenticated User ID ' , res.data);
      }
    else if(res.data.status == '401') {
      //router.replace(handleRedirect)
     // console.log('Login required ' , res.data);
      localStorage.clear();

      return
        }
      else if(res.data.status == '402') {
        //router.replace(handleRedirect)
        console.log('Session expired! Login again ' ,res.data);
        localStorage.clear();

        return
          }
      } catch (error) {
      //console.log(error.message)
      if(error.message == 'Network Error'){
        console.log('Login required ' ,error.message + ' occurred');
        }
    }

    }

useEffect(() => {
// get local storage details
const userLocal = localStorage.getItem('userToken')
verifyUserLogin()
userFundingStats()

}, [])

  return (
    <Card>
      <CardHeader
        title='Daily Funding'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            {/* <DotsVertical /> */}
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
              {!show ?
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={5}
                  margin={5}
                />
              </Box> :
              <NumberValueFormat value={todaySale.feedAcctFund} />
              }
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
              10%
            </Typography>
          </Box>
        </Box>

        <Typography component='p' variant='caption' sx={{ mb: 10 }}>
          All daily user's funding overview will show here
        </Typography>

        {newFundData.map((item, index) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== newFundData.length - 1 ? { mb: 8.5 } : {})
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                }}
              >
                {/* <img src={item.imgSrc} alt={item.title} height={item.imgHeight} /> */}
                <Account/>
              </Avatar>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {item.fund_name}
                  </Typography>
                  <Typography variant='caption'>{item.fund_type}</Typography>
                </Box>

                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    <NumberValueFormat value={item.amount} />
                  </Typography>
                  <LinearProgress color={'secondary'} value={20} variant='determinate' />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TotalEarning
