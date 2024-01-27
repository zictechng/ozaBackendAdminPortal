import React, { useContext, useEffect, useState, CSSProperties } from 'react'
import moment from 'moment'
import Link from 'next/link'

import { useRouter } from 'next/router'

// ** MUI Imports
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import client from 'src/@core/context/client'
import { Badge } from '@mui/material'
import BeatLoader from 'react-spinners/BeatLoader'
import NoRecordFund from 'src/@core/function/tableNoRecord'
import Stack from '@mui/material/Stack'

import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'

// modal inner table import
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Pagination from '@mui/material/Pagination';

import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'

import Slide from '@mui/material/Slide'
import { ShowSnackbar } from 'src/@core/function/controlFunction'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
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

const UserBankDetailsTable = () => {
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [bankDetailsUserData, setBankDetailsUserData] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const userTokenId = localStorage.getItem('userToken')
  const [fetchData, setFetchData] = useState('')

  //search function components and states variables
  const [showAlert, setShowAlert] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPageCount, setTotalPageCount] = React.useState(0)

  const handlePaginateChange = (event, value) => {
    setPageNumber(value);
    paginationFunction()
  };

  const [searchInput, setSearchInput] = useState({
    searchValue: ''
  })

  const [showAlertStatus, setShowAlertStatus] = useState({
    alertBgColor: '',
    alertMessage: '',
    errorType: ''
  })

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowAlert(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleOpenDialog = (data) => {
    setOpen(true)
    fetchTransaction(data)
  }

  // Search function to query database goes here
  const searchQuery = async () => {
    const paraData = {
      dataInfo: searchInput
    }
    setLoadingSearch(true)

    try {
      const res = await client.post(`/api/searchUsersBank_details`, paraData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        handleClickOpen()

        //handleClickOpen(res.data.feedAll[0]._id);
        setFetchData(res.data.feedAll)
        setSearchInput({
          searchValue: ''
        })
      } else if (res.data.status == '404') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
      } else if (res.data.status == '402') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
      } else if (res.data.status == '500') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingSearch(false)
    }
  }

  // get user bank details with the ID received from database
  const fetchTransaction = async (data) => {
    setLoadingSearch(true)
    try {
      const res = await client.get(`/api/getBank_UserDetails/${data}`, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        handleClickOpen()
        setFetchData(res.data.feedAll)

      } else if (res.data.msg == '404') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
        setOpen(false)
      } else if (res.data.status == '401') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
        router.push('/pages/login')
        localStorage.clear()
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingSearch(false)
    }
  }

  //pagination function goes here
 const paginationFunction = async() =>{
  try {
    const res = await client.get(`/api/userBank_details?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      }
    })

  //console.log('Pending users ' , res.data);
if(res.data.msg =='201'){
  setTotalPageCount(res.data.totalPage)
  setBankDetailsUserData(res.data.feedAll)
  }
  } catch (error) {
    console.log(error.message)
  }
  }

  // get current user transaction stats here
  useEffect(() => {
    const allUserBank_details = async () => {
      setLoadingData(true)
      try {
        const res = await client.get(`/api/userBank_details`, {
          headers: {
            Authorization: 'Bearer ' + userTokenId
          }
        })

        //console.log('Pending users ' , res.data);
        if (res.data.msg == '201') {
          //console.log('Pending trans ' , res.data);
          setBankDetailsUserData(res.data.feedAll)
        }
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoadingData(false)
      }
    }

    // get local storage details
    const userLocal = localStorage.getItem('userToken')
    allUserBank_details()
  }, [userTokenId])

  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <CardHeader title='Bank Details' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'}>
          <FormControl fullWidth margin='dense'>
            <OutlinedInput
              placeholder='Search by Email ID/Tag ID'
              onChange={e => setSearchInput(e.target.value.trim())}
              type={'text'}
              size='small'
              name='searchValue'
              value={searchInput.searchValue}
              style={{ width: '100%' }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={() => searchQuery()}>
                    {loadingSearch ? <CircularProgress thickness={2} size={27} color='primary' /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Box
            sx={{
              marginRight: 5,
              marginLeft: 5
            }}
          ></Box>
        </Stack>
      </Stack>
          {bankDetailsUserData.length > 0 &&
          <Box sx={{
            //marginTop: 10,
            justifyContent:"right",
            marginRight:5,
            display:'flex'
            }}>
              <Typography>Page <strong>{pageNumber} / {totalPageCount == 0 || totalPageCount == undefined ? pageNumber: totalPageCount }</strong></Typography>
              <Pagination count={totalPageCount} page={pageNumber} onChange={handlePaginateChange} />
          </Box>}
      <TableContainer>
        {loadingData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
            <BeatLoader color={'#1D2667'} loading={true} size={10} margin={5} />
          </Box>
        )}
        {!loadingData && bankDetailsUserData.length > 0 ? (
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Bank Name</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Paypal Address</TableCell>
                <TableCell>Payoneer Address</TableCell>
                <TableCell>Bitcoin Address</TableCell>
                <TableCell>Tag ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reg. Date</TableCell>
                <TableCell>Option</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankDetailsUserData.map(row => (
                <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell>{row.bank_name}</TableCell>

                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                        {row.bank_acct_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.bank_acct_number}</TableCell>
                  <TableCell>{row.paypal_address}</TableCell>
                  <TableCell>{row.payoneer_address}</TableCell>
                  <TableCell>{row.btc_address}</TableCell>
                  <TableCell>{row.user_tag_id}</TableCell>
                  <TableCell>{row.bank_status}</TableCell>
                  <TableCell>{moment(row.createdOn).format('YYYY-MM-DD')}</TableCell>

                  <TableCell>
                    <Stack direction='row' spacing={1}>
                      <Link href={`#`} passHref>
                        <Chip
                          label={'View'}
                          color={'primary'}
                          sx={{
                            height: 30,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { fontWeight: 500 },
                            cursor: 'pointer'
                          }}
                          onClick={() => handleOpenDialog(row._id)}
                        />
                      </Link>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
        {!loadingData && bankDetailsUserData.length < 1 && <NoRecordFund />}
      </TableContainer>

      <ShowSnackbar
        openAction={showAlert}
        type={showAlertStatus.errorType}
        hideDuration={3000}
        bgColored={showAlertStatus.alertBgColor}
        onCloseAction={handleCloseAlert}
        length={'100%'}
        desc={showAlertStatus.alertMessage}
        transitionState={Transition}
      />

      {/* modal to show funding details */}
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {loadingSearch ? 'Please wait...' : fetchData?.bank_acct_name + ' Bank Details'}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          {loadingSearch ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}
            >
              <BeatLoader color={'#1D2667'} loading={true} size={10} margin={5} />
            </Box>
          ) : (
            <Box>
              <Typography gutterBottom sx={{ fontSize: '0.975rem !important', textAlign: 'justify' }}>
                Status: <strong>{fetchData?.bank_action}</strong>
                <br />
                Register Date: <strong>{moment(fetchData.createdOn).format('YYYY-MM-DD')} </strong>
                <br />
                Action Date: <strong>{fetchData?.approved_date != null ? moment(fetchData.approved_date).format('YYYY-MM-DD'): null}</strong> <br />
              </Typography>

              <TableContainer component={Paper} sx={{ padding: 4 }}>
                <Table sx={{ minWidth: 400, border: 0.9 }} size='small' aria-label='a dense table'>
                  <TableBody>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Owner Tag ID
                      </TableCell>
                      <TableCell align='right'>{fetchData?.user_tag_id}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Bank Name
                      </TableCell>
                      <TableCell align='right'>{fetchData?.bank_name}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Account Number
                      </TableCell>
                      <TableCell align='right'>{fetchData?.bank_acct_number}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Account Name
                      </TableCell>
                      <TableCell align='right'>{fetchData?.bank_acct_name}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}
                    dividers>
                      <TableCell component='th' scope='column'>
                      <br/>
                      </TableCell>
                      <TableCell align='right'></TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Paypal Account
                      </TableCell>
                      <TableCell align='right'>{fetchData?.paypal_address}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Payoneer Account
                      </TableCell>
                      <TableCell align='right'>{fetchData?.payoneer_address}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Bitcoin Account
                      </TableCell>
                      <TableCell align='right'>{fetchData?.btc_address}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
                      <TableCell component='th' scope='column'>
                        Note
                      </TableCell>
                      <TableCell>{fetchData?.tran_desc}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}></TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <ResetButtonStyled
            color='primary'
            variant='outlined'
            disabled={loadingSearch}
            onClick={() => {}}
            sx={{ marginTop: 2, marginBottom: 2, marginRight: 5 }}>
            Print
          </ResetButtonStyled>
        </DialogActions>
      </BootstrapDialog>
    </Card>
  )
}

export default UserBankDetailsTable
