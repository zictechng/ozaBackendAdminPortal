import React, {useEffect, useState } from 'react'
import moment from 'moment';
import Link from 'next/link'

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
import { Badge } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

import NoRecordFund from 'src/@core/function/tableNoRecord';

const AdminPendingUserView = () => {
  const [activeUserData, setActiveUserData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPageCount, setTotalPageCount] = React.useState(0)

  const handlePaginateChange = (event, value) => {
    setPageNumber(value);
    paginationFunction()
  };

  const userTokenId = localStorage.getItem('userToken')

   // get current user transaction stats here
   const allActiveUsers = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/adminPendingUser_details`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
  if(res.data.msg =='201'){
    setTotalPageCount(res.data.totalPage)
    setActiveUserData(res.data.feedAll)
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
    const res = await client.get(`/api/adminPendingUser_details?pageNumber=${pageNumber}&pageLimit=${pageLimit}`, {
      headers: {
      'Authorization': 'Bearer '+userTokenId,
      }
    })

  //console.log('Pending users ' , res.data);
if(res.data.msg =='201'){
  setTotalPageCount(res.data.totalPage)
  setActiveUserData(res.data.feedAll)
  }
  } catch (error) {
    console.log(error.message)
  }
}

useEffect(() => {
// get local storage details
const userLocal = localStorage.getItem('userToken')
allActiveUsers()

}, [])

  return (
    <Card>
          {activeUserData.length > 0 &&
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
        {!loadingData && activeUserData.length > 0 ?
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Reg. Date</TableCell>
              <TableCell>Option</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeUserData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.display_name}</Typography>
                    <Typography variant='caption'>{row.acct_status}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{moment(row.createdOn).format('YYYY-MM-DD')}</TableCell>
                <TableCell>
                {/* <Link href={`query/${row._id}`}>Here</Link> */}
                <Stack direction="row" spacing={1}>
                    {/* <Chip label="primary" color="primary" variant="outlined" /> */}
                    <Link
                  href={`/admin-user/view-user/${row._id}`}>
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
                  href={'#'}>
                  <Chip
                    label={'Check'}
                    color={'warning'}
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
        : null }

        {!loadingData && activeUserData.length < 1 &&
        <NoRecordFund />
        }

      </TableContainer>
    </Card>
  )
}

export default AdminPendingUserView
