import React, { useContext, useEffect, useState, Fragment } from 'react'
import moment from 'moment'
import Link from 'next/link'

import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Collapse from '@mui/material/Collapse'

import CardHeader from '@mui/material/CardHeader'

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

// open full dialog import

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'

import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import SearchIcon from '@mui/icons-material/Search'

import { FullPageIndicator, ShowSnackbar } from 'src/@core/function/controlFunction'

import Pagination from '@mui/material/Pagination';

// confirm dialog with input fields api
import TextField from '@mui/material/TextField'
import AlertTitle from '@mui/material/AlertTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const AllMessagesTable = () => {
  const router = useRouter()

  const [allMessagesData, setAllMessagesData] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const [message, setMessage] = useState('')
  const userTokenId = localStorage.getItem('userToken')
  const [open, setOpen] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [showAlert, setShowAlert] = useState(false)

  // get current user transaction stats here
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [ticketMessage, setTicketMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [openTicketConfirm, setOpenTicketConfirm] = useState(false)
  const [closeTicketData, setCloseTicketData] = useState('')

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPageCount, setTotalPageCount] = React.useState(0)

  const handlePaginateChange = (event, value) => {
    setPageNumber(value);
    paginationFunction()
  };

  const [showAlertStatus, setShowAlertStatus] = useState({
    alertBgColor: '',
    alertMessage: '',
    errorType: ''
  })

  const [searchInput, setSearchInput] = useState({
    searchValue: ''
  })

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    setShowAlert(false)
  }

  const handleClickOpenDialog = data => {
    setOpenDialog(true)
    getMessage(data)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    allTicketSend()
  }

  const handleOpenConfirm = () => {
    setOpenConfirm(true)
  }

  const handleCloseConfirm = () => {
    setOpenConfirm(false)
  }

  // close ticket confirm dialog here
  const handleTicketCloseConfirm = () => {
    setOpenTicketConfirm(false)
  }

  // open close ticket confirm dialog here
  const handleTicketOpenConfirm = data => {
    setOpenTicketConfirm(true)
    setCloseTicketData(data)
  }

  // get all message from database
  const getMessage = async dataId => {
    setMessageLoading(true)
    try {
      const res = await client.get(`/api/getUser_message/${dataId}`, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })

      //console.log('Pending users ' , res.data);
      if (res.data.msg == '201') {
        //console.log('Message response ', res.data)
        setMessage(res.data.feedAll)
      } else if (res.data.status == '404') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
        setOpenDialog(false)
      }
    } catch (error) {
      console.log(error.message)
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: error.message,
        errorType: 'error'
      })
    } finally {
      setMessageLoading(false)
    }
  }

  // get all message from database
  const allTicketSend = async () => {
    setLoadingData(true)
    try {
      const res = await client.get(`/api/allUser_messages`, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })

      //console.log('Pending users ' , res.data);
      if (res.data.msg == '201') {
        setTotalPageCount(res.data.totalPage)
        setAllMessagesData(res.data.feedAll)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  // function to close ticket totally
  const handleClickCLoseTicket = async data => {
    const sendInfo = {
      tran_id: data
    }
    setLoading(true)
    try {
      const res = await client.post(`/api/closeUserTicket_message`, sendInfo, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: 'Ticket closed successfully',
          errorType: 'success'
        })
        allTicketSend()
        setOpenDialog(false)
      } else if (res.data.status == '404') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
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
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: error.message,
        errorType: 'error'
      })
    } finally {
      setOpen(false)
      setLoading(false)
      handleTicketCloseConfirm()
    }
  }

  // send message feedback to user
  const sendMessageFeedBack = async () => {
    const sendInfo = {
      tran_id: message._id,
      sendMessage: ticketMessage
    }
    setLoading(true)
    try {
      const res = await client.post(`/api/messageFeedback_send`, sendInfo, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: 'Message sent successfully',
          errorType: 'success'
        })
        allTicketSend()
        setOpenDialog(false)
      } else if (res.data.status == '404') {
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType: 'error'
        })
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
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: error.message,
        errorType: 'error'
      })
    } finally {
      setOpen(false)
      setLoading(false)
      setOpenConfirm(false)
    }
  }

  //pagination function goes here
  const paginationFunction = async() =>{
    try {
      const res = await client.get(`/api/allUser_messages?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    setTotalPageCount(res.data.totalPage)
    setAllMessagesData(res.data.feedAll)
    }
    } catch (error) {
      console.log(error.message)
    }
  }

  // Search function to search for ticket using ticket ID database goes here
  const searchQuery = async () => {
    const paraData = {
      dataInfo: searchInput
    }
    setLoadingSearch(true)

    try {
      const res = await client.post(`/api/searchTicket_database`, paraData, {
        headers: {
          Authorization: 'Bearer ' + userTokenId
        }
      })
      if (res.data.msg == '201') {
        setMessage(res.data.feedAll)
        setOpenDialog(true)
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

  useEffect(() => {
    // get local storage details
    const userLocal = localStorage.getItem('userToken')
    allTicketSend()
  }, [userTokenId])

  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <CardHeader title='Support Tickets' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'}>
          <FormControl fullWidth margin='dense'>
            <OutlinedInput
              placeholder='Search by Ticket ID'
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
          {allMessagesData.length > 0 &&
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
        {!loadingData && allMessagesData.length > 0 ? (
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Sender Name</TableCell>
                <TableCell>Ticket Type</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Ticket Status</TableCell>
                <TableCell>Ticket Action</TableCell>
                <TableCell>Reg. Date</TableCell>
                <TableCell>Option</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMessagesData.map(row => (
                <>
                  <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                    <TableCell>{row.user?.email}</TableCell>
                    <TableCell>{row.user?.display_name}</TableCell>

                    <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                          {row.ticket_type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.ticket_status}</TableCell>
                    <TableCell>
                      {row.ticket_closed == 'Ongoing' || row.ticket_closed == 'Replied' ? (
                        <Chip
                          label={row.ticket_closed}
                          color={'info'}
                          sx={{
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { fontWeight: 300 },
                            cursor: 'pointer'
                          }}
                        />
                      ) : row.ticket_closed == 'Completed' || row.ticket_closed == 'Closed' ? (
                        <Chip
                          label={row.ticket_closed}
                          color={'warning'}
                          sx={{
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { fontWeight: 300 },
                            cursor: 'pointer'
                          }}
                        />
                      ) : (
                        <Chip
                          label={row.ticket_closed}
                          color={'secondary'}
                          sx={{
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { fontWeight: 300 },
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{moment(row.createdOn).format('YYYY-MM-DD')}</TableCell>

                    <TableCell>
                      {/* <Link href={`query/${row._id}`}>Here</Link> */}
                      <Stack direction='row' spacing={1}>
                        <Link href='#' passHref>
                          <Chip
                            disabled={row.ticket_closed == 'Completed' || row.ticket_closed == 'Closed'}
                            onClick={() => handleClickOpenDialog(row._id)}
                            label={'Open'}
                            color={'primary'}
                            sx={{
                              height: 25,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { fontWeight: 500 },
                              cursor: 'pointer'
                            }}
                          />
                        </Link>
                        <Link href={'#'} passHref>
                          <Chip
                            onClick={() => handleTicketOpenConfirm(row._id)}
                            disabled={row.ticket_closed == 'Completed' || row.ticket_closed == 'Closed'}
                            label={'Close Ticket'}
                            color={'error'}
                            sx={{
                              height: 25,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { fontWeight: 500 },
                              cursor: 'pointer'
                            }}
                          />
                        </Link>
                        {/* <Chip label="success" color="success" variant="outlined" /> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        ) : null}
        {!loadingData && allMessagesData.length < 1 && <NoRecordFund />}
      </TableContainer>

      {/* Alert warning */}
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

      {/* full dialog that display message details */}
      <Dialog fullScreen open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleCloseDialog} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant='h6' component='div'>
              {'Subject :' + message?.subject} | Ticket ID: {message?.tick_id}
            </Typography>
            <Button autoFocus color='inherit' onClick={handleOpenConfirm}>
              Reply Ticket
            </Button>
            <Button autoFocus color='inherit' onClick={() => handleTicketOpenConfirm(message._id)}>
              Close This Ticket
            </Button>
          </Toolbar>
        </AppBar>
        {messageLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
            <BeatLoader color={'#1D2667'} loading={true} size={10} margin={5} />
          </Box>
        ) : (
          <List>
            <ListItemButton>
              <ListItemText primary={message.sender_name} secondary='Sender Name' />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary='Date' secondary={moment(message.createdOn).format('YYYY-MM-DD')} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText secondary={'Status: ' + message.ticket_status} />
            </ListItemButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'gray' }} variant='h7' component='div'>
              {message?.ticket_message}
            </Typography>
          </List>
        )}
      </Dialog>

      {/* Confirm dialog with input to reply ticket message */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Enter message response</DialogTitle>
        <DialogContent>
          <DialogContentText>Please be brief as possible you can while sending response to a user.</DialogContentText>
          {loading ? <FullPageIndicator /> : null}
          <TextField
            autoFocus
            required
            multiline
            margin='dense'
            id='name'
            name='reason'
            label='Give me a reason'
            type='text'
            fullWidth
            variant='standard'
            onChange={e => setTicketMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={() => sendMessageFeedBack()}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog before deleting/closing ticket */}
      <Dialog open={openTicketConfirm} onClose={handleTicketCloseConfirm}>
        <DialogTitle>Confirm</DialogTitle>
        <Divider></Divider>
        {loading ? <FullPageIndicator /> : null}
        <DialogContent>Are you sure you want to do this?</DialogContent>
        <DialogActions>
          <Button onClick={handleTicketCloseConfirm}>Cancel</Button>
          <Button onClick={() => handleClickCLoseTicket(closeTicketData)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AllMessagesTable
