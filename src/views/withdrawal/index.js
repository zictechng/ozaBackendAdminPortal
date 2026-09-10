
import { useState, useEffect } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { Magnify, Eye, CheckCircle, CloseCircle } from 'mdi-material-ui'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(1),
  },
}))

const DetailRow = ({ label, value, highlight }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant='body2' color='text.secondary'>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 700, color: highlight || 'text.primary' }}>{value || '—'}</Typography>
  </Box>
)

const endpointMap = {
  pending: '/api/userWithdrawal_details',
  approved: '/api/userWithdrawalApproved_details',
  rejected: '/api/userWithdrawalRejected_details',
}

const WithdrawalTable = ({ statusType = 'pending' }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectNote, setRejectNote] = useState('')

  const pageLimit = 15

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `${endpointMap[statusType]}?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || 0)
      }
    } catch (e) {
      toast.error('Failed to load withdrawal requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchDetail = async (id) => {
    setModalLoading(true)
    try {
      const res = await client.get(`/api/getAcctWithdrawal_details/${id}`, { headers })
      if (res.data.msg === '201') setModalData(res.data.feedAll)
    } catch (e) {
      toast.error('Failed to load details')
    } finally {
      setModalLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) { fetchData(1); 
        
        return }
    setSearchLoading(true)
    try {
      const res = await client.post(
        '/api/searchWithdrawal_database',
        { dataInfo: searchInput.trim() },
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll ? [res.data.feedAll] : [])
        setTotalPages(1)
      } else {
        toast.warning(res.data.message || 'No record found')
      }
    } catch (e) {
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  const openModal = (d) => {
    setModalData(d)
    setModalOpen(true)
    fetchDetail(d._id)
  }

  const handleAction = (action) => {
    setConfirmAction(action)
    setConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    setActionLoading(true)
    try {
      const endpoint = confirmAction === 'approve'
        ? '/api/approveAcctWithdrawal'
        : '/api/rejectAccountWithdrawal'

      const res = await client.post(endpoint, {
        tran_id: modalData._id,
        reject_reason: rejectNote,
      }, { headers })

      if (res.data.msg === '201') {
        toast.success(`Withdrawal ${confirmAction === 'approve' ? 'approved' : 'rejected'} successfully`)
        setModalOpen(false)
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
  const isProcessed = (status) => status === 'Approved' || status === 'Rejected'

  useEffect(() => { fetchData(1) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Withdrawal Requests</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} pending`} size='small' color='warning' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField
              size='small' placeholder='Search by tag ID or name'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'><Magnify fontSize='small' /></InputAdornment>
                ),
                endAdornment: searchLoading
                  ? <InputAdornment position='end'><CircularProgress size={16} /></InputAdornment>
                  : null,
              }}
            />
            <Button variant='contained' size='small' onClick={handleSearch} disabled={searchLoading}>
              Search
            </Button>
          </Box>
        }
      />
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <EmptyState title='No Withdrawal Requests' message='No pending withdrawal requests found.' />
      ) : (
        <>
          <TableContainer>
            <Table>
               <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Tag ID</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Amount</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Submitted</Typography></TableCell>
                  {statusType !== 'pending' && (
                    <>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Processed By</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Processed Date</Typography></TableCell>
                      {statusType === 'rejected' && (
                        <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Reason</Typography></TableCell>
                      )}
                    </>
                  )}
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 700, color:'#ffffff' }}>
                          {getInitials(row.withdrawal_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.withdrawal_name}</Typography>
                          <Typography variant='caption' color='text.secondary'>{row.withdrawal_email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {row.withdrawal_tag_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'error.main' }}>
                        ₦{Number(row.amount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.withdrawal_status?.toLowerCase()} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(row.createdOn).format('DD MMM, YYYY')}
                      </Typography>
                    </TableCell>
                    {statusType !== 'pending' && (
                      <>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {row.processed_by || 'Admin'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {row.processed_date ? moment(row.processed_date).format('DD MMM YYYY, hh:mm A') : '—'}
                          </Typography>
                        </TableCell>
                        {statusType === 'rejected' && (
                          <TableCell>
                            <Typography variant='body2' color='error.main' sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {row.reject_reason || '—'}
                            </Typography>
                          </TableCell>
                        )}
                      </>
                    )}
                    <TableCell>
                      <Button size='small' variant='outlined' startIcon={<Eye fontSize='small' />}
                        onClick={() => openModal(row)}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              Page {pageNumber} of {totalPages}
            </Typography>
            <Pagination count={totalPages} page={pageNumber}
              onChange={handlePageChange} color='primary' shape='rounded' />
          </Box>
        </>
      )}

      {/* Detail Modal */}
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Withdrawal Details</Typography>
            <Typography variant='body2' color='text.secondary'>Review and process this withdrawal request</Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={40} />
            </Box>
          ) : modalData ? (
            <Box>
              {/* User + Amount Banner */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'action.hover', borderRadius: 2, p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 44, height: 44, fontWeight: 700 }}>
                    {getInitials(modalData.withdrawal_name)}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.withdrawal_name}</Typography>
                    <Typography variant='body2' color='text.secondary'>Tag: {modalData.withdrawal_tag_id}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: 'error.main' }}>
                    ₦{Number(modalData.amount || 0).toLocaleString()}
                  </Typography>
                  <StatusBadge status={modalData.withdrawal_status?.toLowerCase()} />
                </Box>
              </Box>

              {/* Details */}
              <DetailRow label='Transaction ID' value={modalData.withdrawal_tid} highlight='primary.main' />
              <DetailRow label='Email' value={modalData.withdrawal_email} />
              <DetailRow label='Type' value={modalData.withdrawal_type} />
              <DetailRow label='Note' value={modalData.withdrawal_note} />
              <DetailRow label='Status' value={modalData.withdrawal_status} />
              <DetailRow label='Submitted' value={moment(modalData.createdOn).format('DD MMM YYYY, hh:mm A')} />
              {modalData.processed_by && <DetailRow label='Processed By' value={modalData.processed_by} />}
              {modalData.processed_date && <DetailRow label='Processed Date' value={moment(modalData.processed_date).format('DD MMM YYYY, hh:mm A')} />}
              {modalData.reject_reason && <DetailRow label='Rejection Reason' value={modalData.reject_reason} highlight='error.main' />}

              {isProcessed(modalData.withdrawal_status) && (
                <Alert
                  severity={modalData.withdrawal_status === 'Approved' ? 'success' : 'error'}
                  sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant='body2'>
                    This withdrawal has been {modalData.withdrawal_status?.toLowerCase()}. No further action required.
                  </Typography>
                </Alert>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant='outlined' onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>
            Close
          </Button>
          {modalData && !isProcessed(modalData.withdrawal_status) && (
            <>
              <Button variant='outlined' color='error' startIcon={<CancelIcon />}
                onClick={() => handleAction('reject')} sx={{ borderRadius: 2 }}>
                Reject
              </Button>
              <Button variant='contained' color='success' startIcon={<CheckCircleIcon />}
                onClick={() => handleAction('approve')} sx={{ borderRadius: 2 }}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </StyledDialog>

      {/* Confirm Dialog */}
    <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null); setRejectNote('') }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction === 'approve' ? '✅ Approve Withdrawal' : '❌ Reject Withdrawal'}
        message={
          confirmAction === 'approve'
            ? `Are you sure you want to approve this withdrawal of ₦${Number(modalData?.amount || 0).toLocaleString()}? This action cannot be undone.`
            : (
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Are you sure you want to reject this withdrawal of <strong>₦{Number(modalData?.amount || 0).toLocaleString()}</strong>? The user will be notified.
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
        confirmLabel={confirmAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
        confirmColor={confirmAction === 'approve' ? 'success' : 'error'}
      />
    </Card>
  )
}

export default WithdrawalTable