import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import client from 'src/@core/context/client'
import Link from '@mui/material/Link'
import { Badge, TextareaAutosize, } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Bounce, ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';

const ServiceRateView = () => {
  const router = useRouter()
  const [allAboutUsData, setAllAboutUsData] = useState({});
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

  const [paypalSale, setPaypalSale] = useState('')
  const [paypalBuy, setPaypalBuy] = useState("")
  const [payoneerSale, setPayoneerSale] = useState("")
  const [payoneerBuy, setPayoneerBuy] = useState("")
  const [bitcoinSale, setBitcoinSale] = useState("")
  const [bitcoinBuy, setBitcoinBuy] = useState("")


useEffect(() => {
  userAuthCheck()

  const getAboutUs = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/service_rate`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
  if(res.data.msg =='201'){
    //console.log('rate data ' , res.data);

    setPaypalSale(res.data.feedAll[0]?.paypal_selling)
    setPaypalBuy(res.data.feedAll[0]?.paypal_buying)
    setPayoneerSale(res.data.feedAll[0]?.payoneer_selling)
    setPayoneerBuy(res.data.feedAll[0]?.payoneer_buying)
    setBitcoinSale(res.data.feedAll[0]?.btc_selling)
    setBitcoinBuy(res.data.feedAll[0]?.btc_buying)

    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
}

// get local storage details
const userLocal = localStorage.getItem('userToken')
getAboutUs()

}, [userTokenId])


  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      btc_selling: bitcoinSale,
      btc_buying: bitcoinBuy,
      paypal_buying: paypalBuy,
      paypal_selling: paypalSale,
      payoneer_buying: payoneerBuy,
      payoneer_selling: payoneerSale,

    }
    setUpdateLoadingData(true)
    try {
      const res = await client.post(`/api/updateService_rate`, data, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    console.log('Updated  ' , res.data.msg);
  if(res.data.msg =='201'){
    //alert('updated successfully')

        toast.success('Updated successfully',
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
    else{
      toast.error('Sorry, something went wrong', {
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
                Information about the company current business rate
              </Typography>
            </Grid>
            <ToastContainer/>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>

                <TextField
                  required
                  label="PayPal Selling Rate ($)"
                  name='paypal_selling'
                  defaultValue={paypalSale}
                  onChange={(e) => setPaypalSale(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Paypal Buying Rate ($)</InputLabel>
                <OutlinedInput
                  label='Paypal Buying Rate($)'
                  name='paypal_buying'
                  onChange={(e) => setPaypalBuy(e.target.value)}
                  value={paypalBuy}
                  type={'text'}
                  />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Payoneer Selling Rate ($)</InputLabel>
                <OutlinedInput
                   name='payoneer_selling($)'
                   onChange={(e) => setPayoneerSale(e.target.value)}
                   value={payoneerSale}
                   label='Payoneer Selling Rate'
                   type={'text'}
                  />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Payoneer Buying ($)</InputLabel>
                <OutlinedInput
                   name='payoneer_buying($)'
                   onChange={(e) => setPayoneerBuy(e.target.value)}
                   value={payoneerBuy}
                   label='Payoneer Buying Rate'
                   type={'text'}
                  />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Bitcoin Buying Rate ($)</InputLabel>
                <OutlinedInput
                   name='btc_buying($)'
                   onChange={(e) => setBitcoinBuy(e.target.value)}
                   value={bitcoinBuy}
                   label='Bitcoin Buying Rate'
                   type={'text'}
                  />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Bitcoin Selling Rate ($)</InputLabel>
                <OutlinedInput
                   name='btc_selling($)'
                   onChange={(e) => setBitcoinSale(e.target.value)}
                   value={bitcoinSale}
                   label='Bitcoin Selling Rate'
                   type={'text'}
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
  )
}

export default ServiceRateView
