// ** React Imports
import React, { useContext, useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'

// ** MUI Imports

//import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide'

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
import DeleteIcon from '@mui/icons-material/Delete'
import Block from '@mui/icons-material/Block'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { blue, red, yellow } from '@mui/material/colors'

import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import client from 'src/@core/context/client'
import { ActivitiesLoader } from 'src/@core/function/btnIndicator'
import { NumberDollarValueFormat } from 'src/@core/function/formatDollarNumber'
import {
  AccountApprovalStateDialog,
  AccountStateDialog,
  FullPageIndicator,
  UserAccountActionDialog
} from 'src/@core/function/controlFunction'

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const ProfileUserAccountTabView = () => {
  const router = useRouter()
  const { _id } = router.query // here `_id` replace with [filename].js
  const { userId } = router.query

  const [loadingData, setLoadingData] = useState(false)
  const [userData, setUserData] = useState('')
  const userTokenId = localStorage.getItem('userToken')
  const [processing, setProcessing] = React.useState(false)

  const [openDialog, setOpenDialog] = React.useState(false)
  const [openDialogApproval, setOpenDialogApproval] = React.useState(false)
  const [openDialogAccount, setOpenDialogAccount] = React.useState(false)

  const handleAccountStateAction = value => {
    updateAccountState(value)
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // open dialog for approval button action
  const handleClickOpenApprovalDialog = () => {
    setOpenDialogApproval(true)
  }

  // call api to update db
  const handleAccountApprovalAction = value => {
    updateAccountApprovalState(value)
  }

  // close the dialog approval dialog
  const handleCloseDialogApproval = () => {
    setOpenDialogApproval(false)
  }

  // open dialog for account state button action
  const handleOpenAccountActionDialog = () => {
    setOpenDialogAccount(true)
  }

  // call api to update db
  const handleAccountActionProcess = value => {
    UpdateUserAccountAction(value)
  }

  // close the dialog account dialog
  const handleCloseAccountActionDialog = () => {
    setOpenDialogAccount(false)
  }

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
  const updateAccountState = async PassData => {
    const actionsData = {
      user_id: userId,
      action_status: PassData
    }
    setProcessing(true)
    try {
      const res = await client.post(`/api/user_accountStateAction`, actionsData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        getUserDetails()
        handleCloseDialog()

        return toast.success('Record updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      } else if (res.data.status == '401') {
        return toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      } else {
        return toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      }
    } catch (error) {
      console.log(error.message)

      return toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    } finally {
      setProcessing(false)
      handleCloseDialog()
    }
  }

  //api call to fetch user details
  const updateAccountApprovalState = async PassData => {
    const actionsData = {
      user_id: userId,
      action_status: PassData
    }
    setProcessing(true)
    try {
      const res = await client.post(`/api/user_ApproveAccountAction`, actionsData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        getUserDetails()
        handleCloseDialogApproval()

        return toast.success('Record updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      } else if (res.data.status == '401') {
        return toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      } else {
        return toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      }
    } catch (error) {
      console.log(error.message)

      return toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    } finally {
      setProcessing(false)
      handleCloseDialogApproval()
    }
  }

  //api call to fetch user details
  const UpdateUserAccountAction = async PassData => {
    const actionsData = {
      user_id: userId,
      action_status: PassData
    }
    setProcessing(true)
    try {
      const res = await client.post(`/api/user_accountAction`, actionsData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })

      if (res.data.msg == '201') {
        getUserDetails()
        handleCloseAccountActionDialog()

        return toast.success('Record updated successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      } else if (res.data.status == '401') {
        return toast.error(res, data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      } else if (res.data.status == '404') {
        return toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      } else if (res.data.status == '500') {
        return toast.error('Server error occurred', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      }
    } catch (error) {
      console.log(error.message)

      return toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    } finally {
      setProcessing(false)
      handleCloseAccountActionDialog()
    }
  }

  //api call to fetch user details
  const getUserDetails = async () => {
    setLoadingData(true)
    try {
      const res = await client.get(`/api/adminGetUser_details/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        setUserData(res.data.feedAll)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [userId])

  return (
    <>
      <CardContent>
        <ToastContainer />
        <form>
          {loadingData ? (
            <ActivitiesLoader />
          ) : (
            <Grid container spacing={7}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={userData?.profile_photo == null || userData?.profile_photo =='' ? imgSrc : userData?.profile_photo} alt='Profile Pic' />
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
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => setImgSrc('/images/avatars/1.png')}
                    >
                      Reset
                    </ResetButtonStyled>

                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={handleOpenAccountActionDialog}
                      disabled={userData.acct_status == 'Deleted'}
                    >
                      Account Status
                    </ResetButtonStyled>
                    <ResetButtonStyled color='error' variant='outlined'
                    disabled={userData.acct_status == 'Deleted'}
                    onClick={handleClickOpenDialog}>
                      Account State Action
                    </ResetButtonStyled>
                    <ResetButtonStyled color='error' variant='outlined'
                        disabled={userData.acct_status == 'Deleted'}
                        onClick={handleClickOpenApprovalDialog}>
                      Account Approved Action
                    </ResetButtonStyled>

                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Allowed PNG or JPEG. Max size of 800K.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* account state component */}
              <AccountStateDialog
                openState={openDialog}
                transitionState={Transition}
                closeState={handleCloseDialog}
                actionBtn1={() => handleAccountStateAction('Blocked')}
                actionBtn2={() => handleAccountStateAction('Active')}
                icon1={<ErrorOutline />}
                icon2={<CheckCircle />}
                loadingState={processing}
              />
              {/* accoutn approval component */}
              <AccountApprovalStateDialog
                openState={openDialogApproval}
                transitionState={Transition}
                closeState={handleCloseDialogApproval}
                actionBtn1={() => handleAccountApprovalAction('Suspended')}
                actionBtn2={() => handleAccountApprovalAction('Rejected')}
                actionBtn3={() => handleAccountApprovalAction('Approved')}
                icon1={<Block />}
                icon2={<ErrorOutline />}
                icon3={<CheckCircle />}
                loadingState={processing}
              />
              {/* account action component */}
              <UserAccountActionDialog
                openState={openDialogAccount}
                transitionState={Transition}
                closeState={handleCloseAccountActionDialog}
                actionBtn1={() => handleAccountActionProcess('Blocked')}
                actionBtn2={() => handleAccountActionProcess('Suspended')}
                actionBtn3={() => handleAccountActionProcess('Active')}
                actionBtn4={() => handleAccountActionProcess('Deleted')}
                icon1={<Block />}
                icon2={<ErrorOutline />}
                icon3={<CheckCircle />}
                icon4={<DeleteIcon />}
                loadingState={processing}
              />

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
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Pending'>Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Tag ID' placeholder='Tag ID' defaultValue={userData.tag_id} />
              </Grid>

              {openAlert ? (
                <Grid item xs={12} sx={{ mb: 3 }}>
                  {userData.reg_stage1 !== 'Yes' ||
                  userData.reg_stage2 !== 'Yes' ||
                  userData.reg_stage3 !== 'Yes' ||
                  userData.reg_stage4 !== 'Yes' ||
                  userData.reg_stage5 !== 'Yes' ? (
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
                  ) : null}
                </Grid>
              ) : null}

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Date of Birth' placeholder='Date of Birth' defaultValue={userData.dob} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Gender' placeholder='Gender' defaultValue={userData.gender} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='State' placeholder='State' defaultValue={userData.state} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Country' placeholder='Country' defaultValue={userData.country} />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 4.8 }}>
                <TextField
                  fullWidth
                  multiline
                  label='Address'
                  minRows={2}
                  placeholder='Address'
                  defaultValue={userData.address}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Current Balance'
                  placeholder='Current Balance'
                  defaultValue={userData.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Last Balance'
                  placeholder='Last Balance'
                  defaultValue={userData.acct_balance}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Trans. Balance'
                  placeholder='Trans. Balance'
                  defaultValue={userData.tran_account}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Last Trans.'
                  placeholder='Last Trans.'
                  defaultValue={userData.last_transaction}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Approved Status'
                  placeholder='Approved Status'
                  defaultValue={userData.acct_approved_status}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account State'
                  placeholder='Account State'
                  defaultValue={userData.acct_active_status}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account Type'
                  placeholder='Account Type'
                  defaultValue={userData.acct_type}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Signup Bonus'
                  placeholder='Bonus Amount'
                  defaultValue={userData.signup_account}
                />
              </Grid>

              <Grid item xs={12}>
                {/* <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button> */}
              </Grid>
            </Grid>
          )}
        </form>
      </CardContent>
    </>
  )
}

export default ProfileUserAccountTabView
