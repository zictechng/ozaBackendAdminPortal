import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import client from 'src/@core/context/client'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import BeatLoader from "react-spinners/BeatLoader";
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import { Bounce, ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';
import Select from '@mui/material/Select'

const AppStatusView = () => {
  const router = useRouter()
  const [loadingData, setLoadingData] = useState(false);
  const [updateLoadingData, setUpdateLoadingData] = useState(false);
  const userTokenId = localStorage.getItem('userToken')

    // check user login authentication

    const userAuthCheck = () =>{
      const handleRedirect = PageRedirect('/pages/login')

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

   // get current user transaction stats here

  const [paypalSaleStatus, setPaypalSaleStatus] = useState("")
  const [payoneerSaleStatus, setPayoneerSaleStatus] = useState("")
  const [bitcoinSaleStatus, setBitcoinSaleStatus] = useState("")
  const [paypalBuyStatus, setPaypalBuyStatus] = useState("")
  const [payoneerBuyStatus, setPayoneerBuyStatus] = useState("")
  const [bitcoinBuyStatus, setBitcoinBuyStatus] = useState("")
  const [appStatus, setAppStatus] = useState("")
  const [payPayKey, setPayPayKey] = useState("")
  const [appBaseUrl, setAppBaseUrl] = useState("")
  const [appMiniFunding, setAppMiniFunding] = useState("")
  const [appMaximumFunding, setAppMaximumFunding] = useState("")
  const [payStackAction, setPayStackAction] = useState("")
  const [payPalAction, setPayPalAction] = useState("")
  const [referralBonusState, setReferralBonusState] = useState("")
  const [signupBonusState, setSignupBonusState] = useState("")
  const [appMode, setAppMode] = useState("")
  const [stopNewSignup, setStopNewSignup] = useState("")
  const [stopUserLogin, setStopUserLogin] = useState("")
  const [appModeMessage, setAppModeMessage] = useState("")



useEffect(() => {
  userAuthCheck()

  const getAppSetting = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/app_setting`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    setPaypalSaleStatus(res.data.feedAll[0]?.app_paypal_sale)
    setPayoneerSaleStatus(res.data.feedAll[0]?.app_payoneer_sale)
    setBitcoinSaleStatus(res.data.feedAll[0]?.app_bitcoin_sale)
    setPaypalBuyStatus(res.data.feedAll[0]?.app_paypal_buy)
    setPayoneerBuyStatus(res.data.feedAll[0]?.app_payoneer_buy)
    setBitcoinBuyStatus(res.data.feedAll[0]?.app_bitcoin_buy)
    setAppStatus(res.data.feedAll[0]?.app_state)
    setPayPayKey(res.data.feedAll[0]?.app_paypayKey)
    setAppBaseUrl(res.data.feedAll[0]?.app_baseurl)
    setAppMiniFunding(res.data.feedAll[0]?.app_minim_funding)
    setAppMaximumFunding(res.data.feedAll[0]?.app_maxi_funding)
    setPayPalAction(res.data.feedAll[0]?.app_paypal_bnt)
    setPayStackAction(res.data.feedAll[0]?.app_payStack_btn)
    setReferralBonusState(res.data.feedAll[0]?.app_referral_bonus)
    setSignupBonusState(res.data.feedAll[0]?.app_signup_bonus)
    setStopNewSignup(res.data.feedAll[0]?.app_new_signup_status)
    setAppMode(res.data.feedAll[0]?.app_operation_status)
    setStopUserLogin(res.data.feedAll[0]?.app_stop_login_status)
    setAppModeMessage(res.data.feedAll[0]?.app_mode_message)
    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
}
getAppSetting()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      "paypalSale" : paypalSaleStatus,
      "payoneerSale" : payoneerSaleStatus,
      "bitcoinSale" : bitcoinSaleStatus,
      "paypalBuy" : paypalBuyStatus,
      "payoneerBuy" : payoneerBuyStatus,
      "bitcoinBuy" : bitcoinBuyStatus,
      "appStatus" : appStatus,
      "payPayToken" : payPayKey,
      "baseUrl" : appBaseUrl,
      "mini_funding" : appMiniFunding,
      "maxi_funding" : appMaximumFunding,
      "paypal_btn" : payPalAction,
      "payStack_btn" : payStackAction,
      "referral_bonus_status" : referralBonusState,
      "signup_bonus_status" : signupBonusState,
      "newSignup_status" : stopNewSignup,
      "appMode_status" : appMode,
      "appLogin_status" : stopUserLogin,
      "appMode_message" : appModeMessage,
    }

   setUpdateLoadingData(true)

    try {
      const res = await client.post(`/api/update_appStatus`, data, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
  if(res.data.msg =='201'){
    toast.success(res.data.message,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          newestOnTop: false,
          theme: "light",
          });
    }
    else if(res.data.status =='500'){
      toast.error(res.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setUpdateLoadingData(false)
    }
  }

  return (
    <Grid item xs={12}>
    <Card>
      <Divider sx={{ margin: 0 }} />
      {loadingData ?
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={10}
                  margin={5}
                />
              </Box>
              :
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                App services status! This will enable or disabled services type that will be active in the application
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Paypal Sale Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Paypal Sale Status'
                  defaultValue={paypalSaleStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPaypalSaleStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Payoneer Sale Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Payoneer Sale Status'
                  defaultValue={payoneerSaleStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPayoneerSaleStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Bitcoin Sale Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Bitcoin Sale Status'
                  defaultValue={bitcoinSaleStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setBitcoinSaleStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Paypal Buy Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Paypal Buy Status'
                  defaultValue={paypalBuyStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPaypalBuyStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Payoneer Buy Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Payoneer Buy Status'
                  defaultValue={payoneerBuyStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPolicyStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Bitcoin Buy Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Bitcoin Buy Status'
                  defaultValue={bitcoinBuyStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setBitcoinBuyStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>App State Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='App State Status'
                  defaultValue={appStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setAppStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>PayStack Key</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='pay_key'
                  defaultValue={payPayKey}
                  onChange={(e) => setPayPayKey(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Api Base URL</InputLabel>
              <FormControl fullWidth>
                <TextField
                  required
                  name='app_base_url'
                  defaultValue={appBaseUrl}
                  onChange={(e) => setAppBaseUrl(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Minimum Account Funding</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={appMiniFunding}
                  onChange={(e) => setAppMiniFunding(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Maximum Account Funding</InputLabel>
              <FormControl fullWidth>
                <TextField
                  required
                  name='app_accountMaxi_funding'
                  defaultValue={appMaximumFunding}
                  onChange={(e) => setAppMaximumFunding(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'><strong>Signup Bonus Status</strong></InputLabel>
              <FormControl fullWidth>
              <Select
                  label='PayStack Button Status'
                  defaultValue={signupBonusState}
                  id='form-layouts-separator-select'
                  onChange={(e) => setSignupBonusState(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'><strong>Referral Bonus Status</strong></InputLabel>
              <FormControl fullWidth>
              <Select
                  label='PayStack Button Status'
                  defaultValue={referralBonusState}
                  id='form-layouts-separator-select'
                  onChange={(e) => setReferralBonusState(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667' }}>
              Payment Button Details
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>PayStack Button Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='PayStack Button Status'
                  defaultValue={payStackAction}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPayStackAction(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>
               </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>PayPal Button Status</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='PayPal Button Status'
                  defaultValue={payPalAction}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPayPalAction(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>

                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667' }}>
              Application mode
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Disabled Mobile App Operation</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Disabled Mobile App'
                  defaultValue={appMode}
                  id='form-layouts-separator-select'
                  onChange={(e) => setAppMode(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>
               </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>App Offline Mode Message</InputLabel>
            <FormControl fullWidth>
                <TextField
                placeholder='Message to show users when off Mode'
                  name='appMode_message'
                  defaultValue={appModeMessage}
                  onChange={(e) => setAppModeMessage(e.target.value)}
                  type={'text'}
                  fullWidth
                />

              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Stop New Signup</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Stop New Signup'
                  defaultValue={stopNewSignup}
                  id='form-layouts-separator-select'
                  onChange={(e) => setStopNewSignup(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Stop App Login</InputLabel>
            <FormControl fullWidth>
                <Select
                  label='Stop App Login'
                  defaultValue={stopUserLogin}
                  id='form-layouts-separator-select'
                  onChange={(e) => setStopUserLogin(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>

                </Select>
              </FormControl>
            </Grid>

          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'
          onClick={() => submitUpdate()}
          disabled={updateLoadingData}>

            {updateLoadingData? <BtnLoaderIndicator /> : "Update"}
          </Button>
        </CardActions>
      </form>
      }
    </Card>
      </Grid>

  )
}

export default AppStatusView
