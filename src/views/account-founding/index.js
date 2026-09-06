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
import { Eye, CreditCardCheck, CreditCardMinus } from 'mdi-material-ui'
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
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    py: 1.5, borderBottom: '1px solid', borderColor: 'divider', gap: 2,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, minWidth: 140 }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right', color: highlight || 'text.primary', wordBreak: 'break-all' }}>
      {value || '—'}
    </Typography>
  </Box>
)

const AccountFundingTable = () => {
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
        `/api/userAcctFunding_details?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || res.data.feedAll || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load funding records')
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
        openModal(res.data.feedAll)
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
      const res = await client.get(`/api/getAcctFunding_details/${id}`, { headers })
      if (res.data.msg === '201') setModalData(res.data.feedAll)
      else { toast.error('Failed to load details'); setModalOpen(false) }
    } catch (e) {
      toast.error('Failed to load details')
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const openModal = (d) => { setModalData(d); setModalOpen(true) }

  const handleAction = (action) => {
    setConfirmAction(action)
    setConfirmOpen(true)
  }

    const handleConfirmAction = async () => {
    setActionLoading(true)
    try {
      const endpoint = confirmAction === 'approve'
        ? '/api/approveAcctFunding'
        : '/api/rejectApproveAcctFunding'

      const res = await client.post(endpoint, {
        tran_id: modalData._id,
        reject_note: rejectNote,
      }, { headers })
      
      if (res.data.msg === '201') {
        toast.success(`Funding ${confirmAction === 'approve' ? 'approved' : 'rejected'} successfully`)
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
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Account Funding</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} records`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField
              size='small' placeholder='Search by tag ID or email'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'><SearchIcon fontSize='small' color='action' /></InputAdornment>,
                endAdornment: searchLoading ? <InputAdornment position='end'><CircularProgress size={16} /></InputAdornment> : null,
              }}
            />
            <Button variant='contained' size='small' onClick={handleSearch} disabled={searchLoading} sx={{ borderRadius: 2, px: 3 }}>
              Search
            </Button>
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
      {!loading && data.length === 0 && <EmptyState title='No Funding Records' message='No account funding records found.' />}

      {!loading && data.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['User', 'Tag ID', 'Amount', 'Method', 'Status', 'Date', 'Action'].map(col => (
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
                          {getInitials(row.fund_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {row.fund_name || '—'}
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.72rem' }}>
                            {row.fund_email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.fund_tag_id || '—'} size='small' variant='outlined' color='primary' sx={{ fontWeight: 600, fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'success.main' }}>
                        ₦{Number(row.amount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{row.fund_method || row.payment_method || '—'}</Typography>
                    </TableCell>
                    <TableCell><StatusBadge status={row.fund_status?.toLowerCase()} /></TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>{moment(row.createdOn).format('DD MMM, YYYY')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title='View Details'>
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

      {/* Detail Modal */}
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Funding Details</Typography>
            <Typography variant='body2' color='text.secondary'>Review and approve or reject this funding request</Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} size='small'><CloseIcon fontSize='small' /></IconButton>
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
                    {getInitials(modalData.fund_name)}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.fund_name}</Typography>
                    <Typography variant='body2' color='text.secondary'>Tag: {modalData.fund_tag_id}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₦{Number(modalData.amount || 0).toLocaleString()}
                  </Typography>
                  <StatusBadge status={modalData.fund_status?.toLowerCase()} />
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>Submitted</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{moment(modalData.createdOn).format('DD MMM YYYY')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>Payment Method</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.fund_method || modalData.payment_method || '—'}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <DetailRow label='Transaction ID' value={modalData.tid || modalData._id} highlight='primary.main' />
              <DetailRow label='Bank Name' value={modalData.bank_name} />
              <DetailRow label='Description' value={modalData.fund_desc || modalData.tran_desc} />
              <DetailRow label='Status' value={modalData.fund_status} />

              {modalData.payment_proof_url && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body2' sx={{ fontWeight: 700, mb: 1 }}>Payment Proof</Typography>
                  <Box component='a' href={modalData.payment_proof_url} target='_blank' rel='noreferrer'
                    sx={{ display: 'block', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <Box component='img' src={modalData.payment_proof_url} alt='Payment Proof'
                      sx={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                  </Box>
                </Box>
              )}

              {isProcessed(modalData.fund_status) && (
                <Alert severity={modalData.fund_status === 'Approved' ? 'success' : 'error'} sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant='body2'>
                    This funding request has been {modalData.fund_status?.toLowerCase()}. No further action required.
                  </Typography>
                </Alert>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant='outlined' onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>Close</Button>
          {modalData && !isProcessed(modalData.fund_status) && (
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

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null); setRejectNote('') }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction === 'approve' ? 'Approve Funding' : 'Reject Funding'}
        message={
          confirmAction === 'approve'
            ? `Are you sure you want to approve this funding of ₦${Number(modalData?.amount || 0).toLocaleString()}? This will credit the user's wallet.`
            : (
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Are you sure you want to reject this funding of <strong>₦{Number(modalData?.amount || 0).toLocaleString()}</strong>? The user will be notified.
                </Typography>
                <TextField
                  fullWidth
                  size='small'
                  multiline
                  rows={3}
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

export default AccountFundingTable