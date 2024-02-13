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

const CompanyBankDetails = () => {
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

  const [paypalAddress, setPaypalAddress] = useState("")
  const [payoneerAddress, setPayoneerAddress] = useState("")
  const [bitcoinAddress, setBitcoinAddress] = useState("")
  const [zenithAccountNumber, setZenithAccountNumber] = useState("")
  const [zenithBankName, setZenithBankName] = useState("")
  const [zenithAccountName, setZenithAccountName] = useState("")
  const [fidelityAccountNumber, setFidelityAccountNumber] = useState("")
  const [fidelityBankName, setFidelityBankName] = useState("")
  const [fidelityAccountName, setFidelityAccountName] = useState("")
  const [momoAccount, setMomoAccount] = useState("")


useEffect(() => {
  userAuthCheck()

  const getAppSetting = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/fetchCompany_bank`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    setPaypalAddress(res.data.feedAll[0]?.company_paypal_address)
    setPayoneerAddress(res.data.feedAll[0]?.company_payoneer_address)
    setBitcoinAddress(res.data.feedAll[0]?.company_btc_address)
    setZenithAccountNumber(res.data.feedAll[0]?.company_acct_number2)
    setZenithBankName(res.data.feedAll[0]?.company_bank2)
    setZenithAccountName(res.data.feedAll[0]?.company_acct_name2)
    setFidelityAccountNumber(res.data.feedAll[0]?.company_acct_number1)
    setFidelityBankName(res.data.feedAll[0]?.company_bank1)
    setFidelityAccountName(res.data.feedAll[0]?.company_acct_name1)
    setMomoAccount(res.data.feedAll[0]?.company_momoAccount)
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
      "paypal_address" : paypalAddress,
      "payoneer_address" : payoneerAddress,
      "bitcoin_address" : bitcoinAddress,
      "zenith_number" : zenithAccountNumber,
      "zenith_bankName" : zenithBankName,
      "zenith_acctName" : zenithAccountName,
      "fidelityNumber" : fidelityAccountNumber,
      "fidelity_bankName" : fidelityBankName,
      "fidelityAcctName" : fidelityAccountName,
      "momo_number" : momoAccount,
    }

   setUpdateLoadingData(true)

    try {
      const res = await client.post(`/api/update_companyBankStatus`, data, {
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
                A view of the company bank details, easily mange the details any time and update
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Paypal Address</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={paypalAddress}
                  onChange={(e) => setPaypalAddress(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Payoneer Address</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={payoneerAddress}
                  onChange={(e) => setPayoneerAddress(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Bitcoin Address</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={bitcoinAddress}
                  onChange={(e) => setBitcoinAddress(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667' }}>
                Zenith Bank Details
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Bank Name</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={zenithBankName}
                  onChange={(e) => setZenithBankName(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Account Name</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={zenithAccountName}
                  onChange={(e) => setZenithAccountName(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Account Number</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={zenithAccountNumber}
                  onChange={(e) => setZenithAccountNumber(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>


              <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667' }}>
                Fidelity Bank Details
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Bank Name</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={fidelityBankName}
                  onChange={(e) => setFidelityBankName(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Account Name</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={fidelityAccountName}
                  onChange={(e) => setFidelityAccountName(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Account Number</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={fidelityAccountNumber}
                  onChange={(e) => setFidelityAccountNumber(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>


              <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667' }}>
              MoMo Account Details
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Account Number</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  name='app_account_funding'
                  defaultValue={momoAccount}
                  onChange={(e) => setMomoAccount(e.target.value.trim())}
                  type={'text'}
                  fullWidth
                />
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

export default CompanyBankDetails
