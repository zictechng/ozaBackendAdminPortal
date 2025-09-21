import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import moment from 'moment';
import { useRouter } from 'next/router'

// ** MUI Imports
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
import Link from '@mui/material/Link'
import { Badge } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import NoRecordFund from 'src/@core/function/tableNoRecord';
import { NumberValueFormat } from 'src/@core/function/formatNumberValue';
import { NumberDollarValueFormat } from 'src/@core/function/formatDollarNumber';
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'

import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';

import Stack from '@mui/material/Stack';

//dialog modal import
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

import Slide from '@mui/material/Slide'
import Pagination from '@mui/material/Pagination';

// modal inner table import
import Paper from '@mui/material/Paper';
import { ShowSnackbar } from 'src/@core/function/controlFunction';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

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


const SystemActivityLogTable = () => {
  const router = useRouter()

  const [allLogData, setAllLogData] = useState([]);
  const [allLogSearchData, setAllLogSearchData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const userTokenId = localStorage.getItem('userToken');

  const [open, setOpen] = React.useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [fetchData, setFetchData] = useState('');
  const [fetchSearchData, setFetchSearchData] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [displayType, setDisplayType] = useState(false);


  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPageCount, setTotalPageCount] = React.useState(0)

  // pagination search state
  const [pageNumberSearch, setPageNumberSearch] = useState(1);
  const [pageLimitSearch, setPageLimitSearch] = useState(10)
  const [searchParameter, setSearchParameter] = useState('')
  const [totalPageCountSearch, setTotalPageCountSearch] = React.useState(0)

  const handleChange = (event, value) => {
    setPageNumber(value);
    paginationFunction()
  };

  const handleSearchChange = (event, value) => {
    setPageNumberSearch(value);
    paginationSearchFunction()
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [showAlertStatus, setShowAlertStatus] = useState({
        alertBgColor: '',
        alertMessage:'',
        errorType:'',
        });

  const [searchInput, setSearchInput] = useState({
          searchValue: '',
          })

        const handleClickOpen = (dataId) => {
          setOpen(true);
          fetchLogs(dataId);
          setSearchInput({
            searchValue:''
             })
        };

        const handleClose = () => {
          setOpen(false);
          setShowConfirmDialog(false);
          setDisplayType(false);
        };

        const handleCloseAlert = (event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
          setShowAlert(false)
          setDisplayType(false);
        };

  // get logs details with the ID received from database
      const fetchLogs = async(data) => {
        setLoadingLogs(true);
        try {
          const res = await client.get(`/api/get_systemLogs_byId/${data}`, {
            headers: {
            'Authorization': 'Bearer '+userTokenId,
            }
          })
      if(res.data.msg =='201'){
        setFetchData(res.data.feedAll)
        setDisplayType(false)

        }
        else if(res.data.msg =='404'){
          setShowAlert(true)
            setShowAlertStatus({
              alertMessage: res.data.message,
              errorType:'error',
            })
            setOpen(false)
          }
          else if(res.data.status =='401'){
            setShowAlert(true)
            setShowAlertStatus({
              alertMessage: res.data.message,
              errorType:'error',
            })
              router.push('/pages/login')
              localStorage.clear();
            }
        } catch (error) {
          console.log(error.message)
        }
        finally{
          setLoadingLogs(false)
        }
      }

   // get all logs stats here
   const getAllLogs = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/fetchAll_systemLog`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    //console.log('Pending trans ' , res.data);
    setTotalPageCount(res.data.totalPage)
    setAllLogData(res.data.feedAll)

    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
    }

     //pagination function goes here
     const paginationFunction = async() =>{
      try {
        const res = await client.get(`/api/fetchAll_systemLog?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          }
        })

      //console.log('Pending users ' , res.data);
    if(res.data.msg =='201'){
      setTotalPageCount(res.data.totalPage)
      setAllLogData(res.data.feedAll)
      }
      } catch (error) {
        console.log(error.message)
      }
    }

    //pagination function goes here
    const paginationSearchFunction = async() =>{
      const paraData = {
        dataInfo: searchInput
      }

      //console.log("send para ", searchParameter)
      try {
        const res = await client.get(`/api/search_systemLogs_pagination?pageNumber=${pageNumberSearch}&pageLimit=${pageLimitSearch}`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          },
          params:{
            "searchData": searchParameter,
          }
        })
        if(res.data.msg =='201'){
          setTotalPageCountSearch(res.data.totalPage)
          setAllLogSearchData(res.data.feedAll)
          setFetchSearchData(res.data[0].feedAll)
          }
          } catch (error) {
            console.log(error.message)
          }
     }

    // Search function to query database goes here
   const searchQuery = async() => {
    const paraData = {
      dataInfo: searchInput
    }

    //console.log(" search data ", )
    setSearchParameter(paraData)

     if(paraData == null || paraData == '' || paraData ==undefined) {
        setShowAlert(true)
        setShowAlertStatus({
        alertMessage: 'Please search parameters',
        errorType:'error',
      })

      return
      }
      setLoadingSearch(true)

    try {
      const res = await client.post(`/api/search_systemLogs_database`, paraData, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
    if(res.data.msg =='201'){
      setTotalPageCountSearch(res.data.totalPage)
      setDisplayType(true);

      setSearchInput({
        searchValue:''
         })
      setOpen(true);
      setAllLogSearchData(res.data.feedAll)
      setFetchSearchData(res.data[0].feedAll)


        }
      else if(res.data.status == '404'){
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: res.data.message,
        errorType:'error',
      })
    }
    else if(res.data.status == '402'){
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: res.data.message,
        errorType:'error',
      })
    }
    else if(res.data.status == '500'){
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: res.data.message,
        errorType:'error',
      })
    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingSearch(false)
    }
   }

  useEffect(() => {
// get local storage details
const userLocal = localStorage.getItem('userToken')
getAllLogs()

}, [userTokenId])



  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <CardHeader title='System activities recorded' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'} >
              <FormControl fullWidth margin='dense'>
                <OutlinedInput
                  placeholder='Search with Email/IP'
                  onChange={(e) => setSearchInput(e.target.value.trim())}
                  type={'text'}
                  size="small"
                  name="searchValue"
                  value={searchInput.searchValue}
                  style = {{width: '100%'}}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() =>searchQuery()}>
                       {loadingSearch ? <CircularProgress thickness={2} size={27} color="primary"/>:
                       <SearchIcon /> }
                      </IconButton>
                    </InputAdornment>
                    }
                 />
              </FormControl>
                <Box sx={{
                  marginRight:5,
                  marginLeft:5
                }}>
              </Box>
        </Stack>
      </Stack>
          {allLogData.length > 0 &&
          <Box sx={{
            //marginTop: 10,
            justifyContent:"right",
            marginRight:5,
            display:'flex'
            }}>
              <Typography>Page <strong>{pageNumber} / {totalPageCount == 0 || totalPageCount == undefined ? pageNumber: totalPageCount}</strong></Typography>
              <Pagination count={totalPageCount} page={pageNumber} onChange={handleChange} />
          </Box>}
      <TableContainer>
      {loadingData &&
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={10}
                  margin={5}
                />
              </Box>
            }
        {!loadingData && allLogData.length > 0 ?
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Activity Nature</TableCell>
              <TableCell>Activity Nature</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allLogData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.log_username}</TableCell>

                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.log_name}</Typography>

                  </Box>
                </TableCell>
                <TableCell>{row.log_status}</TableCell>
                <TableCell>{row.log_nature}</TableCell>
                <TableCell>{row.createdOn ? moment(row.createdOn).format('YYYY-MM-DD hh:mm A'): null}</TableCell>

                <TableCell>
                {/* <Link href={`query/${row._id}`}>Here</Link> */}
                <Stack direction="row" spacing={1}>
                  <Link
                  href={`#`}>
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
                    onClick={() => handleClickOpen(row._id)}
                  />
                </Link>

                    {/* <Chip label="success" color="success" variant="outlined" /> */}
                </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        :null
        }
      {!loadingData && allLogData.length < 1 &&
        <NoRecordFund />
        }
      </TableContainer>

        <ShowSnackbar
          openAction={showAlert}
          type={showAlertStatus.errorType}
          hideDuration={4000}
          bgColored={showAlertStatus.alertBgColor}
          onCloseAction={handleCloseAlert}
          length={"100%"}
          desc={showAlertStatus.alertMessage}
          transitionState={Transition}
        />
{/*
      <ConfirmDialogDelete
        openState={showConfirmDialog}
        title={'Are you sure you want to this?'}
        loadingState={loading}
        icon1={<Cancel/>}
        closeState={handleCloseConfirmModal}
        actionBtn1={() => approveRejectBtn(fetchData._id)}
        transitionState={Transition}
        btnLable={'Reject Transaction'}
      /> */}


       {/* full dialog that display message details */}
       <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        {displayType ?
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant='h6' component='div'>
              {'Search result found | Username : ' + allLogSearchData[0]?.login_username} | IP Address: { allLogSearchData[0]?.login_user_ip}
            </Typography>

            <Button autoFocus color='inherit' onClick={() => handleClose()}>
              Close
            </Button>
          </Toolbar>
        </AppBar>:

        <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant='h6' component='div'>
            {'Username : ' + fetchData.log_username}
          </Typography>

          <Button autoFocus color='inherit' onClick={() => handleClose()}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
        }
        {loadingLogs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
            <BeatLoader color={'#1D2667'} loading={true} size={10} margin={5} />
          </Box>
        ) : (
            <List>
            <ListItemButton>
              <ListItemText primary={displayType ? allLogSearchData[0]?.log_name : fetchData.log_name} secondary='Full Name' />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary='Activities Date' secondary={displayType ? moment(allLogSearchData[0]?.createdOn).format('YYYY-MM-DD') : moment(fetchData?.createdOn).format('YYYY-MM-DD')} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              {!displayType ?
              <ListItemText primary='Status' secondary={fetchData?.log_status == 'Successful' ? (
                <Chip
                label={'Successful'}
                color={'success'}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { fontWeight: 500 },
                  cursor: 'pointer'
                }}
                />
                  ): (
                    <Chip
                      label={fetchData.log_status}
                      color={'secondary'}
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 },
                        cursor: 'pointer'
                      }}
                    />
                )} />
                :
                 <ListItemText primary='Status' secondary={allLogSearchData[0]?.log_status == 'Successful' ? (
                <Chip
                label={'Successful'}
                color={'success'}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { fontWeight: 500 },
                  cursor: 'pointer'
                }}
                />
                  ): (
                    <Chip
                      label={allLogSearchData[0]?.log_status}
                      color={'secondary'}
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 },
                        cursor: 'pointer'
                      }}
                    />
                )} />
                    }
            </ListItemButton>
            <Divider />

            <ListItemButton>
              <ListItemText primary='Activities Nature' secondary={displayType ? allLogSearchData[0]?.log_nature : fetchData?.log_nature} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                {!displayType ?
                <ListItemText primary='Tag ID' secondary={displayType ? allLogSearchData[0]?.log_acct_number : fetchData?.log_acct_number} />
                :null}
              </ListItemButton>
              {allLogSearchData.length > 0 &&
              <Box sx={{
                //marginTop: 10,
                justifyContent:"right",
                marginRight:5,
                display:'flex'
                }}>
                  <Typography>Page <strong>{pageNumberSearch} / {totalPageCountSearch == 0 || totalPageCountSearch == undefined ? pageNumberSearch: totalPageCountSearch}</strong></Typography>
                  <Pagination count={totalPageCountSearch} page={pageNumberSearch} onChange={handleSearchChange} />
              </Box>}
            <Divider />
            <Typography sx={{ ml: 2, flex: 1, color: 'gray' }} variant='h7' component='div'>
              {!displayType ? 'Description: ' + fetchData.log_desc : null}

            </Typography>


            {displayType ?
            <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
              <TableHead>
              <TableRow>
              <TableCell>Activity Nature</TableCell>
              <TableCell>Activity Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Activity Date</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {allLogSearchData.map(row => (
                <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>

                  <TableCell>{row?.log_nature}</TableCell>
                  <TableCell>{row?.log_desc}</TableCell>
                  <TableCell>
                    {row.log_status == '1' || row.log_status == 'Successful' ?
                    <Chip
                        label={'Successful'}
                        color={'success'}
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { fontWeight: 500 },
                          cursor: 'pointer'
                        }}
                      />:
                      <Chip
                        label={row?.log_status}
                        color={'secondary'}
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { fontWeight: 500 },
                          cursor: 'pointer'
                        }}
                      />}
                  </TableCell>
                  <TableCell>{row?.createdOn ? moment(row.createdOn).format('YYYY-MM-DD'): null}</TableCell>

                </TableRow>
              ))}
            </TableBody>
            </Table>
              : null }
          </List>
        )}
      </Dialog>

    </Card>
  )
}

export default SystemActivityLogTable
