import { useState, useEffect } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import client from 'src/@core/context/client'

const AllTransactionsTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageLimit = 15

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/allUser_transaction?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (_, value) => { setPageNumber(value); fetchData(value) }
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => { fetchData(1) },
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  [])

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>All Transactions</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} records`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField size='small' placeholder='Search transactions...'
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              sx={{ minWidth: 240 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'><SearchIcon fontSize='small' color='action' /></InputAdornment>,
              }}
            />
            <Tooltip title='Refresh'>
              <IconButton size='small' onClick={() => fetchData(pageNumber)} disabled={loading}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Divider />

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>}
      {!loading && data.length === 0 && <EmptyState title='No Transactions' message='No transactions found.' />}

      {!loading && data.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['User', 'Amount', 'Nature', 'Category', 'TID', 'Balance', 'Type', 'Status', 'Date'].map(col => (
                    <TableCell key={col}><Typography variant='body2' sx={{ fontWeight: 700 }}>{col}</Typography></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.filter(row =>
                  !searchInput || JSON.stringify(row).toLowerCase().includes(searchInput.toLowerCase())
                ).map(row => (
                  <TableRow key={row._id} hover sx={{ '&:last-of-type td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.7rem', fontWeight: 700, color: '#ffffff' }}>
                          {getInitials(row.sender_name || row.acct_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.sender_name || row.acct_name || '—'}</Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.72rem' }}>{row.acct_number || row.sender_acct_number}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: row.tran_type === 'Credit' ? 'success.main' : 'error.main' }}>
                        ₦{Number(row.amount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant='body2'>{row.transac_nature || '—'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={row.transac_category || '—'} size='small' variant='outlined' sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'text.secondary' }}>
                        {row.tid?.slice(0, 16)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        ₦{Number(row.trans_balance || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.tran_type || '—'}
                        size='small'
                        color={row.tran_type === 'Credit' ? 'success' : 'error'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell><StatusBadge status={row.transaction_status?.toLowerCase()} /></TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>{moment(row.creditOn).format('DD MMM, YYYY')}</Typography>
                      <Typography variant='body2' color='text.disabled'>{moment(row.creditOn).format('hh:mm A')}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant='body2' color='text.secondary'>
              Page <strong>{pageNumber}</strong> of <strong>{totalPages}</strong> · {totalCount.toLocaleString()} records
            </Typography>
            <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} color='primary' shape='rounded' size='small' />
          </Box>
        </>
      )}
    </Card>
  )
}

export default AllTransactionsTable