// ** React Imports
import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import client from 'src/@core/context/client'
import { ActivitiesLoader } from 'src/@core/function/btnIndicator'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const ProfileAccountTabView = () => {
  const router = useRouter()
  const { _id } = router.query // here `_id` replace with [filename].js
  const {userId} = router.query;

  const [loadingData, setLoadingData] = useState(false);
  const [userData, setUserData] = useState('');
  const userTokenId = localStorage.getItem('userToken')

  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

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
    setUserData(res.data.feedAll)

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

  return (
    <CardContent>
      <form>
        {loadingData ? <ActivitiesLoader/>:
          <Grid container spacing={7}>

          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Display Name' placeholder='johnDoe' defaultValue={userData.display_name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Phone' placeholder='+2348037250389' defaultValue={userData.phone} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder='johnDoe@example.com'
              defaultValue={userData.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue={userData.user_role}>
                <MenuItem value={userData.user_role}>{userData.user_role}</MenuItem>
                <MenuItem value='author'>Sales Rep</MenuItem>
                <MenuItem value='editor'>Account</MenuItem>
                <MenuItem value='maintainer'>Manager</MenuItem>

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='Status' defaultValue={userData.acct_status}>
                <MenuItem value={userData.acct_status}>{userData.acct_status}</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Tag ID' placeholder='Tag ID' defaultValue={userData.tag_id} />
          </Grid>

          {openAlert ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              {userData.reg_stage1 !=='Yes' || userData.reg_stage2 !=='Yes' || userData.reg_stage3 !=='Yes' || userData.reg_stage4 !=='Yes' || userData.reg_stage5 !=='Yes' ?
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }
              >
                <AlertTitle>This user account has not be verified fully.</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  Send reminder email
                </Link>
              </Alert>
              : null
            }
            </Grid>
          ) : null}

          <Grid item xs={12}>
            {/* <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button> */}
          </Grid>
        </Grid>
        }
      </form>
    </CardContent>
  )
}

export default ProfileAccountTabView
