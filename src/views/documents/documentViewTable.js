// ** React Imports
import React, { useContext, useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Slide from '@mui/material/Slide'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import { ActivitiesLoader } from 'src/@core/function/btnIndicator'
import client from 'src/@core/context/client'
import { ConfirmDialog, FullPageIndicator, ShowSnackbar } from 'src/@core/function/controlFunction'

import CheckCircle from '@mui/icons-material/CheckCircle'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// confirm dialog with input fields api
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import AlertTitle from '@mui/material/AlertTitle'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import Close from 'mdi-material-ui/Close'

// Styled component for the form
const Form = styled('form')(({ theme }) => ({
  maxWidth: 700,
  padding: theme.spacing(12),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}))

//Document image styles
const ImgStyled = styled('img')(({ theme }) => ({
  width: 600,
  height: 550,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

// action buttons
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

const DocumentViewPage = () => {
  const router = useRouter()
  const { docId } = router.query

  // ** State
  const [loadingData, setLoadingData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [btnConfirm, setBtnConfirm] = useState(false)
  const [userData, setUserData] = useState('')
  const userTokenId = localStorage.getItem('userToken')
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const [open, setOpen] = React.useState(false)
  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [openError, setOpenError] = React.useState(false)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  //close warning dialog
  const closeWarning = () => {
    setOpenAlert(false)
  }

  const handleOpenConfirm = () => {
    setOpenConfirm(true)
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setOpenError(false)
    setOpenSuccess(false)
  }

  // get user document details
  const getDocument = async () => {
    //console.log('result ID ', docId)
    setLoadingData(true)
    try {
      const res = await client.get(`/api/adminGet_documentDetails/${docId}`, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })

      //console.log('result ', res.data.feedAll)
      if (res.data.msg == '200') {
        setUserData(res.data.feedAll)
        if (res.data.document.document_url == undefined || res.data.document.document_url == '') {
          setOpenAlert(true)
        }
      } else if (res.data.status == '401') {
        console.log(res.data.message)
      } else {
        console.log(res.data.message)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  // function to call confirm dialog when it click
  const handleApproveButton = () => {
    setBtnConfirm(true)
  }

  // function to call confirm dialog when it click
  const handleCloseModal = () => {
    setBtnConfirm(false)
  }

  // approve document api request
  const approvedDocRequest = async data => {
    const docData = {
      user_id: userData.user_id,
      doc_id: docId,
      action_status: data,
      doc_name: userData?.document_name,
      doc_type: userData?.document_category
    }
    setLoading(true)
    try {
      const res = await client.post(`/api/adminApprove_document`, docData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      console.log('result ', res.data)
      if (res.data.msg == '201') {
        setOpen(true)
        getDocument()
        handleCloseModal()
      } else if (res.data.status == '401') {
        console.log(res.data.message)
      } else {
        console.log(res.data.message)
        setOpenError(true)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  // reject document api request
  const rejectDocRequest = async data => {
    const docData = {
      user_id: userData.user_id,
      doc_id: docId,
      action_status: data,
      doc_name: userData?.document_name,
      doc_type: userData?.document_category,
      reasons: rejectReason
    }
    setLoading(true)
    try {
      const res = await client.post(`/api/adminRejected_documentUpload`, docData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        setOpenSuccess(true)
        getDocument()
        handleCloseConfirm()
        setTimeout(() => {
          router.push('/documents/pending'); // your desired route
        }, 1000);

      } else if (res.data.status == 404) {
        setErrorMessage(res.data.message)
        setOpenError(true)
        console.log('404 error ', res.data.message)
      } else {
        console.log(res.data.message)
        openSuccess(true)

      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDocument()
  }, [docId])

  return (
    <Card>
      {openAlert ? (
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Alert
            severity='warning'
            sx={{
              '& a': { fontWeight: 400 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2
            }}
            action={
              <IconButton size='small' color='inherit' aria-label='close' onClick={() => closeWarning(false)}>
                <Close fontSize='inherit' />
              </IconButton>
            }>
            <AlertTitle>Sorry, this document is not valid or not available at the moment.</AlertTitle>
            <Link href='/' onClick={e => e.preventDefault()}>
              Contact User
            </Link>
          </Alert>
        </Grid>
      ) : null}

      <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', marginRight: 5 }}>
        <CardHeader
          title={
            'Document | ' +
            userData?.owners_name +
            ' ' +
            userData?.document_name +
            ' | Doc ID: ' +
            userData?.track_document
          }
          titleTypographyProps={{ variant: 'h6' }}/>
      </Stack>
      <ResetButtonStyled
        color='error'
        variant='outlined'
        disabled={userData?.document_status == 'Rejected' || userData?.document_status == 'Cancelled'}
        onClick={() => {
          handleOpenConfirm()
        }}>
        Reject
      </ResetButtonStyled>
      <ResetButtonStyled
        color='info'
        variant='outlined'
        disabled={userData?.document_status != 'Pending'}
        onClick={() => {
          handleApproveButton()
        }}>
        Approve
      </ResetButtonStyled>
      <CardContent sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loadingData ? (
          <ActivitiesLoader />
        ) : (
          <Form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl>
                  {userData?.document_url == '' || userData?.document_url == null ? (
                    <ImgStyled src={imgSrc} alt='Document Pic' />
                  ) : (
                    <ImgStyled src={userData.document_url} alt='Document Pic' />
                  )}
                </FormControl>
              </Grid>
              <Typography sx={{ fontWeight: 500, fontSize: '0.975rem !important', padding: 5 }}>
                {userData?.reject_document_reason}
              </Typography>
            </Grid>
          </Form>
        )}
      </CardContent>

      {/* confirmation dialog popup before approving the document */}
      <ConfirmDialog
        openState={btnConfirm}
        title={'Are you sure you want to do this?'}
        desc={'Please, ensure you understand your action before continuing'}
        loadingState={loading}
        icon1={<CheckCircle />}
        closeState={handleCloseModal}
        actionBtn1={() => approvedDocRequest('Approved')}
        transitionState={Transition}
      />
      {/* success notification component */}
      <ShowSnackbar
        openAction={open}
        type={'success'}
        hideDuration={4000}
        onCloseAction={handleClose}
        bgColored={'primary.main'}
        length={'100%'}
        desc={'Document approved successfully'}
        transitionState={Transition}
      />
      {/* error notification component */}
      <ShowSnackbar
        openAction={openSuccess}
        type={'error'}
        hideDuration={4000}
        bgColored={'warning'}
        onCloseAction={handleClose}
        length={'100%'}
        desc={'Document rejected successfully'}
        transitionState={Transition}
      />

      <ShowSnackbar
        openAction={openError}
        type={'info'}
        hideDuration={4000}
        onCloseAction={handleClose}
        length={'100%'}
        desc={errorMessage}
        transitionState={Transition}
      />

      {/* Confirm dialog with input for reason of rejecting the document */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>Please tell us the reason why you want to reject the documents.</DialogContentText>
          {loading ? <FullPageIndicator /> : null}
          <TextField
            autoFocus
            required
            margin='dense'
            id='name'
            name='reason'
            label='Give me a reason'
            type='text'
            fullWidth
            variant='standard'
            onChange={e => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={() => rejectDocRequest('Rejected')}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DocumentViewPage
