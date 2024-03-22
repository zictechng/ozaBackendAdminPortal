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
import { NumberValueFormat } from 'src/@core/function/formatNumberValue'
import { NumberDollarValueFormat } from 'src/@core/function/formatDollarNumber'
import { PageRedirect } from 'src/@core/function/controlFunction';
import BeatLoader from "react-spinners/BeatLoader";

const rows = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: 'eebsworth2m@sbwire.com',
    designation: 'Human Resources Assistant'
  },
  {
    age: 61,
    date: '09/23/2016',
    salary: '$23896.35',
    status: 'professional',
    name: 'Margaret Bowers',
    email: 'kocrevy0@thetimes.co.uk',
    designation: 'Nuclear Power Engineer'
  },
  {
    age: 59,
    date: '10/15/2017',
    name: 'Minnie Roy',
    status: 'rejected',
    salary: '$18991.67',
    email: 'ediehn6@163.com',
    designation: 'Environmental Specialist'
  },
  {
    age: 30,
    date: '06/12/2018',
    status: 'resigned',
    salary: '$19252.12',
    name: 'Ralph Leonard',
    email: 'dfalloona@ifeng.com',
    designation: 'Sales Representative'
  },
  {
    age: 66,
    status: 'applied',
    date: '03/24/2018',
    salary: '$13076.28',
    name: 'Annie Martin',
    designation: 'Operator',
    email: 'sganderton2@tuttocitta.it'
  },
  {
    age: 33,
    date: '08/25/2017',
    salary: '$10909.52',
    name: 'Adeline Day',
    status: 'professional',
    email: 'hnisius4@gnu.org',
    designation: 'Senior Cost Accountant'
  },
  {
    age: 61,
    status: 'current',
    date: '06/01/2017',
    salary: '$17803.80',
    name: 'Lora Jackson',
    designation: 'Geologist',
    email: 'ghoneywood5@narod.ru'
  },
  {
    age: 22,
    date: '12/03/2017',
    salary: '$12336.17',
    name: 'Rodney Sharp',
    status: 'professional',
    designation: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp'
  }
]

const statusObj = {
  waiting: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  expired: { color: 'warning' },
  Successful: { color: 'success' }
}

const DashboardTable = () => {
  const router = useRouter()
  const [newFundData, setNewFundData] = useState([]);
  const userTokenId = localStorage.getItem('userToken')
  const [showLoading, setShowLoading] = useState(false)

  const goToLogin = PageRedirect('/pages/login')

   // get current user transaction stats here
   const userRecentStats = async() =>{
    setShowLoading(true)
    try {
      const res = await client.get(`/api/user_recentReport`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
      if(res.data.msg =='201'){
        //console.log('Recent trans ' , res.data);
        setNewFundData(res.data.feedAll)
        }
        else if(res.data.status =='402'){
          router.replace(goToLogin)
        }
        } catch (error) {
          console.log(error.message)
        }
        finally{
          setShowLoading(false)
        }
    }

useEffect(() => {
  // get local storage details
    const userLocal = localStorage.getItem('userToken')
    userRecentStats()
}, [])

  return (
    <Card>
      <TableContainer>
          {showLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <BeatLoader
            color={'#1D2667'}
            loading={true}
            size={10}
            margin={10}
          />
        </Box>:

        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>TID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newFundData.map(row => (
              <TableRow hover key={row._id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.acct_name}</Typography>
                    <Typography variant='caption'>{row.transac_nature}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.tid}</TableCell>
                <TableCell>{row.currency_level == '2' ? <NumberDollarValueFormat value={row.amount}/>: <NumberValueFormat value={row.amount} />}</TableCell>
                <TableCell>{moment(row.creditOn).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{row.tran_type}</TableCell>
                <TableCell>
                  {row.transaction_status == 'Successful' ? (
                    <Chip
                    label={row.transaction_status}
                    color={'success'}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  ): row.transaction_status == 'Pending' ?
                  (
                    <Chip
                    label={row.transaction_status}
                    color={'primary'}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  ): row.transaction_status == 'Rejected' ?
                  (
                    <Chip
                    label={row.transaction_status}
                    color={'warning'}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  ): row.transaction_status == 'Expired' ?
                  (
                    <Chip
                    label={row.transaction_status}
                    color={'warning'}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  ): (
                    <Chip
                    label={row.transaction_status}
                    color={'default'}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  )}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        }
      </TableContainer>
    </Card>
  )
}

export default DashboardTable
