import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import moment from 'moment';
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
import { Badge } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import NoRecordFund from 'src/@core/function/tableNoRecord';
import Stack from '@mui/material/Stack';


import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';

import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';

import Slide from '@mui/material/Slide'
import { ShowSnackbar } from 'src/@core/function/controlFunction';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})


const UserDocumentPendingTable = () => {
  const router = useRouter()

  const [pendingDocumentUserData, setPendingDocumentUserData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const userTokenId = localStorage.getItem('userToken')

  //search function components and states variables
  const [showAlert, setShowAlert] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

   // pagination state
   const [pageNumber, setPageNumber] = useState(1);
   const [pageLimit, setPageLimit] = useState(15)
   const [totalPageCount, setTotalPageCount] = React.useState(0)

   const handlePaginateChange = (event, value) => {
     setPageNumber(value);
     paginationFunction()
   };

  const [searchInput, setSearchInput] = useState({
    searchValue: '',
    })

  const [showAlertStatus, setShowAlertStatus] = useState({
    alertBgColor: '',
    alertMessage:'',
    errorType:'',
    });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  setShowAlert(false)
  };

  // Search function to query database goes here
    const searchQuery = async() => {
  const paraData = {
    dataInfo: searchInput
  }
    setLoadingSearch(true)

  try {
    const res = await client.post(`/api/searchUsersDocument_database`, paraData, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      }
    })
  if(res.data.msg =='201'){
    //handleClickOpen(res.data.feedAll[0]._id);
    router.push(`/documents/view-document/${res.data.feedAll._id}`)
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

   // get current user transaction stats here
   const allPendingDocument = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/pendingDocument_user?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    //console.log('Pending trans ' , res.data);
    setPendingDocumentUserData(res.data.feedAll)
    setTotalPageCount(res.data.totalPage)

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
    const res = await client.get(`/api/pendingDocument_user?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      }
    })

  //console.log('Pending users ' , res.data);
if(res.data.msg =='201'){
  setTotalPageCount(res.data.totalPage)
  setPendingDocumentUserData(res.data.feedAll)
  }
  } catch (error) {
    console.log(error.message)
  }
  }

useEffect(() => {
// get local storage details
const userLocal = localStorage.getItem('userToken')
allPendingDocument()

}, [])

  return (
    <Card>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
      <CardHeader title='User Documents' titleTypographyProps={{ variant: 'h6' }} />
        <Stack direction={'row'} >
              <FormControl fullWidth margin='dense'>
                <OutlinedInput
                  placeholder='Search by Document ID'
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
          {pendingDocumentUserData.length > 0 &&
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
        {!loadingData && pendingDocumentUserData.length > 0 ?
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
            <TableCell>Tag ID</TableCell>
              <TableCell>Doc. Name</TableCell>
              <TableCell>Doc. Type</TableCell>
              <TableCell>Doc. Status</TableCell>
              <TableCell>Doc. ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingDocumentUserData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.owners_tag_id}</TableCell>

                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.document_name}</Typography>
                    <Typography variant='caption'>

                      {row.document_action == 'Pending' ?
                        <Chip
                        label={row.document_action}
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
                      />:
                      <Chip
                      label={'Approved'}
                      color={'success'}
                      sx={{
                        height: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 300 },
                        cursor: 'pointer'
                      }}
                    />}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.document_category}</TableCell>
                <TableCell>{row.document_status}</TableCell>
                <TableCell>{row.track_document}</TableCell>
                <TableCell>{moment(row.createdOn).format('YYYY-MM-DD')}</TableCell>
                <TableCell>
                {/* <Link href={`query/${row._id}`}>Here</Link> */}
                <Stack direction="row" spacing={1}>
                  <Link
                  href={`/documents/view-document/${row._id}`} passHref>
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
                  />
                </Link>
                <Link
                  href={'#'} passHref>
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
      {!loadingData && pendingDocumentUserData.length < 1 &&
        <NoRecordFund />
        }
      </TableContainer>
        <ShowSnackbar
          openAction={showAlert}
          type={showAlertStatus.errorType}
          hideDuration={3000}
          bgColored={showAlertStatus.alertBgColor}
          onCloseAction={handleCloseAlert}
          length={"100%"}
          desc={showAlertStatus.alertMessage}
          transitionState={Transition}
        />
    </Card>
  )
}

export default UserDocumentPendingTable
