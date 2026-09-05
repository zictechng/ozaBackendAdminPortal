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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { Eye } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import client from 'src/@core/context/client'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 3,
    minWidth: 500,
    [theme.breakpoints.down('sm')]: { minWidth: '95vw' },
  },
}))

const DetailRow = ({ label, value }) => (
  <Box sx={{
    display: 'flex', justifyContent: 'space-between', py: 1.5,
    borderBottom: '1px solid', borderColor: 'divider', gap: 2,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, minWidth: 140 }}>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{value || '—'}</Typography>
  </Box>
)

const SystemActivityTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const pageLimit = 15

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/fetchAll_systemLog?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load system activity')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) 
      { fetchData(1);

        return 
      }
    setSearchLoading(true)
    try {
      const res = await client.post('/api/search_systemLogs_database',
        { dataInfo: searchInput.trim() }, { headers })
      if (res.data.msg === '201') {
        setData(Array.isArray(res.data.feedAll) ? res.data.feedAll : [res.data.feedAll])
        setTotalPages(1)
      } else {
        toast.warning(res.data.message || 'No records found')
      }
    } catch (e) {
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  const fetchDetail = async (id) => {
    setModalLoading(true)
    setModalOpen(true)
    setModalData(null)
    try {
      const res = await client.get(`/api/get_systemLogs_byId/${id}`, { headers })
      if (res.data.msg === '201') setModalData(res.data.feedAll)
      else { toast.error('Failed to load details'); setModalOpen(false) }
    } catch (e) {
      toast.error('Failed to load details')
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const handlePageChange = (_, value) => { setPageNumber(value); fetchData(value) }
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    fetchData(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>System Activity</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} records`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField size='small' placeholder='Search by username or activity'
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'><SearchIcon fontSize='small' color='action' /></InputAdornment>,
                endAdornment: searchLoading ? <InputAdornment position='end'><CircularProgress size={16} /></InputAdornment> : null,
              }}
            />
            <Button variant='contained' size='small' onClick={handleSearch} disabled={searchLoading} sx={{ borderRadius: 2, px: 3 }}>Search</Button>
            <Tooltip title='Refresh list'>
              <IconButton size='small' onClick={() => fetchData(pageNumber)} disabled={loading}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Divider />

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>}
      {!loading && data.length === 0 && <EmptyState title='No Activity Found' message='No system activity records found.' />}

      {!loading && data.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['User', 'Activity', 'Description', 'Account', 'Status', 'Date', 'Action'].map(col => (
                    <TableCell key={col}><Typography variant='body2' sx={{ fontWeight: 700 }}>{col}</Typography></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row._id} hover sx={{ '&:last-of-type td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                          {getInitials(row.log_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.log_name || '—'}</Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.72rem' }}>{row.log_username}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.log_nature || '—'} size='small' variant='outlined' sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.log_desc || '—'}>
                        <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.log_desc || '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 600 }}>
                        {row.log_acct_number || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.log_status === 'Successful' ? 'active' : 'pending'} customLabel={row.log_status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {row.createdOn ? moment(row.createdOn).format('DD MMM, YYYY') : '—'}
                      </Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {row.createdOn ? moment(row.createdOn).format('hh:mm A') : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title='View activity details'>
                        <Button size='small' variant='outlined' startIcon={<Eye fontSize='small' />}
                          onClick={() => fetchDetail(row._id)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                          View
                        </Button>
                      </Tooltip>
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

      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Activity Details</Typography>
            <Typography variant='body2' color='text.secondary'>Full system activity log record</Typography>
          </Box>
          <Tooltip title='Close'>
            <IconButton onClick={() => setModalOpen(false)} size='small'><CloseIcon fontSize='small' /></IconButton>
          </Tooltip>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={40} /></Box>
          ) : modalData ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'action.hover', borderRadius: 2, p: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 700, color: '#ffffff' }}>
                  {getInitials(modalData.log_name)}
                </Avatar>
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.log_name}</Typography>
                  <Typography variant='body2' color='text.secondary'>{modalData.log_username}</Typography>
                </Box>
              </Box>
              <DetailRow label='Account Number' value={modalData.log_acct_number} />
              <DetailRow label='Activity' value={modalData.log_nature} />
              <DetailRow label='Description' value={modalData.log_desc} />
              <DetailRow label='Receiver Name' value={modalData.log_receiver_name} />
              <DetailRow label='Receiver Number' value={modalData.log_receiver_number} />
              <DetailRow label='Receiver Bank' value={modalData.log_receiver_bank} />
              <DetailRow label='Country' value={modalData.log_country} />
              <DetailRow label='Amount' value={modalData.log_amt} />
              <DetailRow label='Status' value={modalData.log_status} />
              <DetailRow label='Date' value={modalData.createdOn ? moment(modalData.createdOn).format('DD MMM YYYY, hh:mm A') : '—'} />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Tooltip title='Close dialog'>
            <Button variant='outlined' onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>Close</Button>
          </Tooltip>
        </DialogActions>
      </StyledDialog>
    </Card>
  )
}

export default SystemActivityTable