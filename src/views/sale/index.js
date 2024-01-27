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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Cancel from '@mui/icons-material/Cancel'
import Pagination from '@mui/material/Pagination';

import Slide from '@mui/material/Slide'

// modal inner table import
import Paper from '@mui/material/Paper';
import { ConfirmDialog, ConfirmDialogDelete, FullPageIndicator, ShowSnackbar } from 'src/@core/function/controlFunction';


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


const SalesOrderTable = () => {
  const router = useRouter()

  const [allSalesData, setAllSalesData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const userTokenId = localStorage.getItem('userToken');

  const [open, setOpen] = React.useState(false);
  const [getFundId, setGetFundId] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [fetchData, setFetchData] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
        alertMessage:'',
        errorType:'',
        });

  const [searchInput, setSearchInput] = useState({
          searchValue: '',
          })

        const handleClickOpen = (dataId) => {
          setOpen(true);
          setGetFundId(dataId);
          fetchTransaction(dataId);
        };

        const handleClose = () => {
          setOpen(false);
          setShowConfirmDialog(false);
        };

    // function to open confirm dialog when it click
        const handleConfirmDialog = (data) => {
          setOpen(false);
          setShowConfirmDialog(true);
        }

    // function to close confirm dialog when it click
      const handleCloseConfirmModal= () => {
        setShowConfirmDialog(false)
        setOpen(true);
      }

        const handleCloseAlert = (event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
          setShowAlert(false)
        };

        const handleApproveButton = (dataId) => {
          approveSalesFund(dataId);
         };

  // handleRejectApproveAction
        const approveRejectBtn = (dataId) => {
          console.log(dataId);
          rejectApprovalFunding(dataId)

        };

    // get transaction details with the ID received from database
        const fetchTransaction = async(data) => {
          setLoading(true);
          try {
            const res = await client.get(`/api/getSales_details/${data}`, {
              headers: {
              'Authorization': 'Bearer '+userTokenId,
              }
            })

          console.log('Data ' , res.data);
        if(res.data.msg =='201'){
          setFetchData(res.data.feedAll)

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
            setLoading(false)
          }
        }

    // send approval transaction request to database
        const approveSalesFund = async(data) => {
          const sendInfo = {
            "tran_id": data,
            }
          setLoadingApprove(true);
          try {
            const res = await client.post(`/api/approveFundSales`, sendInfo, {
              headers: {
              'Authorization': 'Bearer '+userTokenId,
              }
            })
        if(res.data.msg =='201'){
              setShowAlert(true)
              setShowAlertStatus({
                alertMessage: 'Fund approved successfully',
                errorType:'success',
              })
            allUserSales_details()
            }
          else if(res.data.status =='404'){
            setShowAlert(true)
            setShowAlertStatus({
              alertMessage: res.data.message,
              errorType:'error',
            })
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
            setShowAlert(true)
            setShowAlertStatus({
              alertMessage: error.message,
              errorType:'error',
            })
          }
          finally{
            setOpen(false)
            setLoadingApprove(false)
          }
        }

        // send approval transaction request to database
        const rejectApprovalFunding = async(data) => {
          const sendInfo = {
            "tran_id": data,
          }
          setLoading(true);
          try {
            const res = await client.post(`/api/rejectSaleFunding`, sendInfo, {
              headers: {
              'Authorization': 'Bearer '+userTokenId,
              }
            })
        if(res.data.msg =='201'){
              setShowAlert(true)
              setShowAlertStatus({
                alertMessage: 'Funding rejected successfully',
                errorType:'success',
              })
            allUserSales_details()
            }
          else if(res.data.status =='404'){
            setShowAlert(true)
            setShowAlertStatus({
              alertMessage: res.data.message,
              errorType:'error',
              })
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
            setShowAlert(true)
            setShowAlertStatus({
              alertMessage: error.message,
              errorType:'error',
            })
          }
          finally{
            setShowConfirmDialog(false)
            setLoading(false);
            setOpen(false)

          }
        }

   // get current user transaction stats here
   const allUserSales_details = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/userSales_details`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    //console.log('Pending trans ' , res.data);
    setAllSalesData(res.data.feedAll)
    setTotalPageCount(res.data.totalPage)
    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
    }

    // Search function to query database goes here
   const searchQuery = async() => {
    const paraData = {
      dataInfo: searchInput
    }
      setLoadingSearch(true)

    try {
      const res = await client.post(`/api/searchSalesFunding_database`, paraData, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
    if(res.data.msg =='201'){
      handleClickOpen(res.data.feedAll[0]._id);
      setSearchInput({
        searchValue:''
         })
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

   //pagination function goes here
  const paginationFunction = async() =>{
    try {
      const res = await client.get(`/api/userSales_details?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    setTotalPageCount(res.data.totalPage)
    setAllSalesData(res.data.feedAll)
    }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
// get local storage details
const userLocal = localStorage.getItem('userToken')
allUserSales_details()

}, [userTokenId])

  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <CardHeader title='Sales Transactions' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'} >
              <FormControl fullWidth margin='dense'>
                <OutlinedInput
                  placeholder='Search with TID/PAY ID'
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
          {allSalesData.length > 0 &&
          <Box sx={{
           // marginTop: 10,
            justifyContent:"right",
            marginRight:5,
            display:'flex'
            }}>
              <Typography>Page <strong>{pageNumber} / {totalPageCount == 0 || totalPageCount == undefined ? pageNumber: totalPageCount }</strong></Typography>
              <Pagination count={totalPageCount} page={pageNumber} onChange={handlePaginateChange} />
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
        {!loadingData && allSalesData.length > 0 ?
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Tag ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>TID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reg. Date</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allSalesData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.sender_name}</TableCell>

                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.acct_number}</Typography>

                  </Box>
                </TableCell>
                <TableCell><NumberDollarValueFormat value={row.amount} /></TableCell>
                <TableCell>{row.transac_category}</TableCell>
                <TableCell>{row.tid}</TableCell>
                <TableCell>
                  {row.transaction_status == 'Approved' || row.transaction_status == 'Successful' ?

                  <Chip
                      label={row.transaction_status}
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
                      label={row.transaction_status}
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
                <TableCell>{moment(row.creditOn).format('YYYY-MM-DD')}</TableCell>

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
                <Link
                  href={'#'}>
                  <Chip
                    label={'Delete'}
                    color={'error'}
                    sx={{
                      height: 30,
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
            ))}
          </TableBody>
        </Table>
        :null
        }
      {!loadingData && allSalesData.length < 1 &&
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

      <ConfirmDialogDelete
        openState={showConfirmDialog}
        title={'Are you sure you want to this?'}
        loadingState={loading}
        icon1={<Cancel/>}
        closeState={handleCloseConfirmModal}
        actionBtn1={() => approveRejectBtn(fetchData._id)}
        transitionState={Transition}
        btnLable={'Reject Transaction'}
      />

      {/* modal to show funding details */}
      <BootstrapDialog

        //onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {loading ?  'Please wait...' : fetchData?.acct_name + " Fund Sales Details" }
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          {loadingApprove &&
          <FullPageIndicator />}
        {loading ?
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={10}
                  margin={5}
                />
              </Box>:
          <Box>

            <Typography gutterBottom sx={{fontSize: '0.975rem !important', textAlign:'justify' }}>
              Payment Status: <strong>{fetchData?.transaction_status}</strong> <br />
              Transaction ID: <strong>{fetchData?.tid}</strong><br />
              Payment ID: <strong>{fetchData?.pay_tran}</strong><br />
              Transaction Date: <strong>{moment(fetchData.creditOn).format('YYYY-MM-DD')} </strong><br />
              Action Date: <strong>{moment(fetchData.approved_date).format('YYYY-MM-DD')}</strong> <br />
          </Typography>

          <TableContainer component={Paper} sx={{ padding: 4 }}>
          <Table sx={{ minWidth: 400, border: 0.9 }} size="small" aria-label="a dense table" >
          <TableBody>

            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="column">
                Amount
              </TableCell>
              <TableCell align="right">
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '1.475rem !important' }}><NumberDollarValueFormat value={fetchData?.amount} /></Typography>
                  </Box>
                </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Tag ID
              </TableCell>
              <TableCell align="right">{fetchData.acct_number}</TableCell>

            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Transaction Rate
              </TableCell>
              <TableCell align="right">
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '1.475rem !important' }}><NumberValueFormat value={fetchData?.tran_rate} /></Typography>
                  </Box>
                </TableCell>

            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Transaction Method
              </TableCell>
              <TableCell align="right">{fetchData?.trans_method}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Transaction Type
              </TableCell>
              <TableCell align="right">{fetchData?.transac_category}</TableCell>
            </TableRow>

            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Transaction Nature
              </TableCell>
              <TableCell align="right">{fetchData?.transac_nature}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Check/Last Balance
              </TableCell>
              <TableCell align="right"><NumberDollarValueFormat value={fetchData?.trans_balance} /></TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
              <TableCell component="th" scope="column">
                Note
              </TableCell>
              <TableCell>{fetchData?.tran_desc}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0.3 } }}>
            </TableRow>
        </TableBody>
      </Table>
        </TableContainer>
        </Box>
        }
       </DialogContent>
        <DialogActions>

          <ResetButtonStyled color='primary' variant='outlined'
            disabled={loading || fetchData.transaction_status =="Approved" || fetchData.transaction_status =="Rejected" || fetchData.transaction_status =="Successful"}
            onClick={() => {handleApproveButton(fetchData._id)}} sx={{ marginTop:2, marginBottom:2 }}>
              Approve
          </ResetButtonStyled>
          <ResetButtonStyled color='error' variant='outlined'
            disabled={loading}
            onClick={() => {handleConfirmDialog(fetchData._id)}} sx={{ marginTop:2, marginBottom:2 }}>
              Reject
          </ResetButtonStyled>
        </DialogActions>

      </BootstrapDialog>

    </Card>
  )
}

export default SalesOrderTable
