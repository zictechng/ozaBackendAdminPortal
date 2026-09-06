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
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { Eye } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 3,
    minWidth: 520,
    [theme.breakpoints.down('sm')]: { minWidth: '95vw' },
  },
}))

const DetailRow = ({ label, value, highlight }) => (
  <Box sx={{
    display: 'flex', justifyContent: 'space-between', py: 1.5,
    borderBottom: '1px solid', borderColor: 'divider', gap: 2,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, minWidth: 140 }}>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right', color: highlight || 'text.primary', wordBreak: 'break-all' }}>
      {value || '—'}
    </Typography>
  </Box>
)

const BuyingTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageLimit = 15

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [rejectNote, setRejectNote] = useState('')

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/userBuyOrder_details?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || res.data.feedAll || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load buying orders')
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
      const res = await client.post('/api/searchFunding_database',
        { dataInfo: searchInput.trim() }, { headers })
      if (res.data.msg === '201') {
        fetchDetail(res.data.feedAll._id || res.data.feedAll[0]._id)
        setSearchInput('')
      } else {
        toast.warning(res.data.message || 'No record found')
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
      const res = await client.get(`/api/getSales_details/${id}`, { headers })
      if (res.data.msg === '201') setModalData(res.data.feedAll)
      else { toast.error('Failed to load details'); setModalOpen(false) }
    } catch (e) {
      toast.error('Failed to load details')
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const handleAction = (action) => { setConfirmAction(action); setConfirmOpen(true) }

  const handleConfirmAction = async () => {
    setActionLoading(true)
    try {
      const endpoint = confirmAction === 'approve' ? '/api/approveFundSales' : '/api/rejectSaleFunding'

      const res = await client.post(endpoint, {
        tran_id: modalData._id,
        reject_note: rejectNote,
      }, { headers })
      if (res.data.msg === '201') {
        toast.success(`Order ${confirmAction === 'approve' ? 'approved' : 'rejected'} successfully`)
        fetchDetail(modalData._id)
        fetchData(pageNumber)
      } else {
        toast.error(res.data.message || 'Action failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActionLoading(false)
      setConfirmOpen(false)
      setConfirmAction(null)
      setRejectNote('')
    }
  }

  const handlePageChange = (_, value) => { setPageNumber(value); fetchData(value) }
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const isProcessed = (status) => status === 'Approved' || status === 'Successful' || status === 'Rejected'

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
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Buying Orders</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} records`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField size='small' placeholder='Search by tag ID or TID'
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} sx={{ minWidth: 260 }}
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
      {!loading && data.length === 0 && <EmptyState title='No Buying Orders' message='No buying orders found.' />}

      {!loading && data.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['Sender', 'Account', 'Amount', 'Category', 'TID', 'Status', 'Date', 'Action'].map(col => (
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
                          {getInitials(row.sender_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.sender_name || '—'}</Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.72rem' }}>{row.acct_number}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.acct_number || '—'} size='small' variant='outlined' color='primary' sx={{ fontWeight: 600, fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'error.main' }}>
                        ${Number(row.amount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant='body2'>{row.transac_category || '—'}</Typography></TableCell>
                    <TableCell>
                      <Tooltip title={row.tid}>
                        <Typography variant='body2' sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'text.secondary', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.tid}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell><StatusBadge status={row.transaction_status?.toLowerCase()} /></TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>{moment(row.creditOn).format('DD MMM, YYYY')}</Typography>
                      <Typography variant='body2' color='text.disabled'>{moment(row.creditOn).format('hh:mm A')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title='View & Process Order'>
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
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Order Details</Typography>
            <Typography variant='body2' color='text.secondary'>Review and approve or reject this buying order</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'action.hover', borderRadius: 2, p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 700, color: '#ffffff' }}>
                    {getInitials(modalData.sender_name)}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.sender_name}</Typography>
                    <Typography variant='body2' color='text.secondary'>Acc: {modalData.acct_number}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: 'error.main' }}>
                    ${Number(modalData.amount || 0).toLocaleString()}
                  </Typography>
                  <StatusBadge status={modalData.transaction_status?.toLowerCase()} />
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>Transaction Date</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{moment(modalData.creditOn).format('DD MMM YYYY')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>Category</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.transac_category || '—'}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <DetailRow label='TID' value={modalData.tid} highlight='primary.main' />
              <DetailRow label='Rate' value={modalData.tran_rate ? `₦${modalData.tran_rate}` : '—'} />
              <DetailRow label='Currency' value={modalData.sender_currency_type} />
              <DetailRow label='Status' value={modalData.transaction_status} />

              {isProcessed(modalData.transaction_status) && (
                <Alert severity={modalData.transaction_status === 'Rejected' ? 'error' : 'success'} sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant='body2'>
                    This order has been {modalData.transaction_status?.toLowerCase()}. No further action required.
                  </Typography>
                </Alert>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Tooltip title='Close dialog'>
            <Button variant='outlined' onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>Close</Button>
          </Tooltip>
          {modalData && !isProcessed(modalData.transaction_status) && (
            <>
              <Tooltip title='Reject this order'>
                <Button variant='outlined' color='error' startIcon={<CancelIcon />}
                  onClick={() => handleAction('reject')} sx={{ borderRadius: 2 }}>Reject</Button>
              </Tooltip>
              <Tooltip title='Approve this order'>
                <Button variant='contained' color='success' startIcon={<CheckCircleIcon />}
                  onClick={() => handleAction('approve')} sx={{ borderRadius: 2 }}>Approve</Button>
              </Tooltip>
            </>
          )}
        </DialogActions>
      </StyledDialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null); setRejectNote('') }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction === 'approve' ? 'Approve Order' : 'Reject Order'}
        message={
          confirmAction === 'approve'
            ? `Are you sure you want to approve this order of $${Number(modalData?.amount || 0).toLocaleString()}? The user will be notified.`
            : (
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Are you sure you want to reject this order of <strong>${Number(modalData?.amount || 0).toLocaleString()}</strong>? The user will be notified.
                </Typography>
                <TextField
                  fullWidth size='small' multiline rows={3}
                  label='Rejection Reason (optional)'
                  placeholder='Enter reason for rejection...'
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                />
              </Box>
            )
        }
        confirmLabel={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={confirmAction === 'approve' ? 'success' : 'error'}
      />
    </Card>
  )
}

export default BuyingTable