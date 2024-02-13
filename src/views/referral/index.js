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
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/material/Alert';

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
import { FullPageIndicator, ShowSnackbar } from 'src/@core/function/controlFunction';


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


const ReferralProgramTable = () => {
  const router = useRouter()

  const [allReferralData, setAllReferralData] = useState([]);
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
  const [approveLoading, setApproveLoading] = useState(false);


  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(2)
  const [totalPageCount, setTotalPageCount] = React.useState(0)

  // pagination search state
  const [pageNumberSearch, setPageNumberSearch] = useState(1);
  const [pageLimitSearch, setPageLimitSearch] = useState(2)
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

  // close alert notification
  const closeAlertNotification = () => {
    setShowAlert(false);
  }
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [showAlertStatus, setShowAlertStatus] = useState({
        alertBgColor: '',
        alertMessage:'',
        errorType:'',
        });

  const [showAlertData, setAlertData] = useState('');

  const [searchInput, setSearchInput] = useState({
          searchValue: '',
          })

        const handleClickOpen = (dataId) => {
          setOpen(true);
          fetchReferralById(dataId);
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
          setShowAlert(false)
          setDisplayType(false);
        };

  // get logs details with the ID received from database
      const fetchReferralById = async(data) => {
        setLoadingLogs(true);
        try {
          const res = await client.get(`/api/get_referral_byId/${data}`, {
            headers: {
            'Authorization': 'Bearer '+userTokenId,
            }
          })
      if(res.data.msg =='201'){
        setFetchData(res.data.feedAll);

        setAllLogSearchData(res.data.feedAllData)

        //console.log("data all ", res.data.feedAllData)
        setFetchSearchData(res.data[0].feedAllData)
        setTotalPageCountSearch(res.data.totalPageSearch)
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
      const res = await client.get(`/api/fetchAll_referral`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

  if(res.data.msg =='201'){
    console.log('Pending ' , res.data);
    setTotalPageCount(res.data.totalPage)
    setAllReferralData(res.data.feedAll)
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
        const res = await client.get(`/api/fetchAll_referral?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          }
        })

      //console.log('Pending users ' , res.data);
    if(res.data.msg =='201'){
      setTotalPageCount(res.data.totalPage)
      setAllReferralData(res.data.feedAll)
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
        const res = await client.get(`/api/search_referral_pagination?pageNumber=${pageNumberSearch}&pageLimit=${pageLimitSearch}`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          },
          params:{
            "searchData": searchParameter,
          }
        })
        if(res.data.msg =='201'){
          setTotalPageCountSearch(res.data.totalPage)

          //setAllLogSearchData(res.data.feedAll)
          setAllLogSearchData(res.data.feedAllData)
          setFetchSearchData(res.data[0].feedAllData)
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
      const res = await client.post(`/api/search_referral_database`, paraData, {
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
      setAllLogSearchData(res.data.feedAllData)
      setFetchSearchData(res.data[0].feedAllData)
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

// approve referral bonus action
const approveAction = async(recId) =>{
      setApproveLoading(true)
  try {
    const res = await client.get(`/api/approveReferral_bonus/${recId}`, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      },
    })
    if(res.data.msg =='201'){
      setOpen(false)
      setShowAlert(true)
      setShowAlertStatus({
        alertMessage: 'Referral bonus approved and credited successfully',
        errorType:'success',
      })

      }
      else if(res.data.status == '402'){
        setShowAlert(true)
        setShowAlertStatus({
          alertMessage: res.data.message,
          errorType:'error',
        })
        router.push('/pages/login')
        localStorage.clear()
        }
        else if(res.data.status == '401'){
          setShowAlert(true)
          setShowAlertStatus({
          alertMessage: res.data.message,
          errorType:'error',
        })
        router.push('/pages/login')
        localStorage.clear()
        }
        else if(res.data.status == '404'){
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
        setApproveLoading(false)
      }
  }

  useEffect(() => {
  // get local storage details
  const userLocal = localStorage.getItem('userToken')
  getAllLogs()

  console.log(showAlertData)

  }, [userTokenId])



  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <CardHeader title='System referral activities recorded' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'} >
              <FormControl fullWidth margin='dense'>
                <OutlinedInput
                  placeholder='Search with Email/Tag ID'
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
          {allReferralData.length > 0 &&
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
        {!loadingData && allReferralData.length > 0 ?
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Account Owner Email</TableCell>
              <TableCell>Account Owner Tag ID</TableCell>
              <TableCell>Referred Email</TableCell>
              <TableCell>Referred Name</TableCell>
              <TableCell>Referral Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allReferralData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.ref_mainEmail}</TableCell>

                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.ref_mainTag}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.ref_userEmail}</TableCell>
                <TableCell>{row.ref_userName}</TableCell>
                <TableCell>{row.ref_status}</TableCell>
                <TableCell>{row.createdOn ? moment(row.createdOn).format('YYYY-MM-DD'): null}</TableCell>

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
                    onClick={() => handleClickOpen(row.record_id)}
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
      {!loadingData && allReferralData.length < 1 &&
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


       {/* full dialog that display message details */}
       <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        {displayType ?
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant='h6' component='div'>
              {'Search result found | Username : ' + allLogSearchData[0]?.ref_mainEmail} | Tag ID: { allLogSearchData[0]?.ref_mainTag}
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
            {'User : ' + fetchData.ref_mainEmail}
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
              <ListItemText primary={displayType ? allLogSearchData[0]?.ref_mainEmail : fetchData.ref_mainEmail} secondary='Account Owner' />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary='Record Date' secondary={displayType ? moment(allLogSearchData[0]?.createdOn).format('YYYY-MM-DD') : moment(fetchData?.createdOn).format('YYYY-MM-DD')} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              {!displayType ?
              <ListItemText primary='Status' secondary={fetchData?.ref_status == 'Successful' || fetchData?.ref_status == 'Approved' ? (
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
                      label={fetchData.ref_status}
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
                 <ListItemText primary='Status' secondary={allLogSearchData[0]?.ref_status == 'Successful' || allLogSearchData[0]?.ref_status == 'Approved' ? (
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
                      label={allLogSearchData[0]?.ref_status}
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

            {approveLoading && (<FullPageIndicator /> )}
            <ListItemButton>
              <ListItemText primary='Activities Nature' secondary={'Referral Bonus Program'} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                {!displayType ?
                <ListItemText primary='Tag ID' secondary={displayType ? allLogSearchData[0]?.ref_mainTag : fetchData?.ref_mainTag} />
                :null}
              </ListItemButton>
              <Typography sx={{ ml: 2, flex: 1, color: 'gray' }} variant='h7' component='div'>
              User referred details
            </Typography>

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


            {displayType || allLogSearchData.length ?
            <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
              <TableHead>
              <TableRow>
              <TableCell>Referral Email</TableCell>
              <TableCell>Referral Name</TableCell>
              <TableCell>Referral Status</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell>Action</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {allLogSearchData.map(row => (
                <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>

                  <TableCell>{row?.ref_userEmail}</TableCell>
                  <TableCell>{row?.ref_userName}</TableCell>
                  <TableCell>
                    {row.ref_status == '1' || row.ref_status == 'Successful' || row.ref_status == 'Approved' ?
                    <Chip
                        label={'Approved'}
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
                        label={row?.ref_status}
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
                  <TableCell>
                <Stack direction="row" spacing={1}>
                  <Link
                    href={`#`}>
                    <Chip
                      label={'Approve'}
                      color={'info'}
                      sx={{
                        height: 30,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 },
                        cursor: 'pointer'
                      }}
                      disabled={row?.ref_status == 'Approved' || row?.ref_status == 'Successful'}
                      onClick={() => approveAction(row._id)}
                    />
                  </Link>

                    {/* <Chip label="success" color="success" variant="outlined" /> */}
                </Stack></TableCell>

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

export default ReferralProgramTable
