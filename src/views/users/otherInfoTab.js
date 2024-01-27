// ** React Imports
import React, {useContext, useEffect, forwardRef, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Close from 'mdi-material-ui/Close'
import { ActivitiesLoader } from 'src/@core/function/btnIndicator'
import client from 'src/@core/context/client'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const OtherUserInfoTabView = () => {
  const router = useRouter()
  const { _id } = router.query // here `_id` replace with [filename].js
  const {userId} = router.query;

  const [loadingData, setLoadingData] = useState(false);
  const [userDataInfo, setUserDataInfo] = useState('');
  const userTokenId = localStorage.getItem('userToken')

  // ** State
  const [date, setDate] = useState(null)
  const [openAlert, setOpenAlert] = useState(true)

  //api call to fetch user details
  const getUserDetails = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/adminGetUser_details/${userId}`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

  if(res.data.msg =='201'){
    setUserDataInfo(res.data.feedAll)

    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
  }

  useEffect(() => {
    getUserDetails()

  }, [userId])

  console.log('Others ', userDataInfo)

  return (

    <>
      <CardContent>
      <form>
      {loadingData ? <ActivitiesLoader/>:

        <Grid container spacing={7}>

          {/* <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField
              fullWidth
              multiline
              label='Bio'
              minRows={2}
              placeholder='Bio'
              defaultValue='The name’s John Deo. I am a tireless seeker of knowledge, occasional purveyor of wisdom and also, coincidentally, a graphic designer. Algolia helps businesses across industries quickly create relevant 😎, scalable 😀, and lightning 😍 fast search and discovery experiences.'
            />
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                id='account-settings-date'
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                onChange={date => setDate(date)}
              />
            </DatePickerWrapper>
          </Grid> */}
          <Grid item xs={12} sm={12}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.975rem', fontWeight:'900' }}>Registration Stage</FormLabel>
             </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Stage 1' placeholder='johnDoe' defaultValue={userDataInfo.reg_stage1} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Stage 2' placeholder='Stage 2' defaultValue={userDataInfo.reg_stage2} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Stage 3' placeholder='Stage 3' defaultValue={userDataInfo.reg_stage3}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Stage 4' placeholder='Stage 4' defaultValue={userDataInfo.reg_stage4} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Stage 5' placeholder='Stage 5' defaultValue={userDataInfo.reg_stage5} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Email  Notification Enable</InputLabel>
              <Select label='Email Notification Enable' defaultValue={userDataInfo.receive_email_notification == true ? 'Enable': 'Disable'}>
                <MenuItem value={userDataInfo.receive_email_notification == true ? 'Enable': 'Disable'}>{userDataInfo.receive_email_notification == true ? 'Enable': 'Disable'}</MenuItem>
                <MenuItem value='false'>Disable</MenuItem>
                <MenuItem value='true'>Enable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>2FA Notification Enable</InputLabel>
              <Select label='2FA Notification Enable' defaultValue={userDataInfo.activate_2fa_login == true ? 'Enable': 'Disable'}>
                <MenuItem value={userDataInfo.activate_2fa_login == true ? 'Enable': 'Disable'}>{userDataInfo.activate_2fa_login == true? 'Enable': 'Disable'}</MenuItem>
                <MenuItem value='false'>Disable</MenuItem>
                <MenuItem value='true'>Enable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>In-App Message Notification Enable</InputLabel>
              <Select label='In-App Message Notification Enable' defaultValue={userDataInfo.receive_app_message == true ? 'Enable':'Disable'}>
                <MenuItem value={userDataInfo.receive_app_message == true ? 'Enable':'Disable'}>{userDataInfo.receive_app_message == true ? 'Enable':'Disable'}</MenuItem>
                <MenuItem value='false'>Disable</MenuItem>
                <MenuItem value='true'>Enable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Reg. OTP' placeholder='Reg. OTP' defaultValue={userDataInfo.reg_otp} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='2FA Verification Code' placeholder='2FA Verification Code' defaultValue={userDataInfo.verify2fa_code} />
          </Grid>
          {openAlert ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='info'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }>
                <AlertTitle>User information should not be compromised.</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  Get Help
                </Link>
              </Alert>

            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>

          </Grid>
        </Grid>
      }
      </form>
    </CardContent>
    </>

  )
}

export default OtherUserInfoTabView
