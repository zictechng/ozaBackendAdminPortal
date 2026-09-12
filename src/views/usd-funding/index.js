
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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { Magnify, Eye, CheckCircle, CloseCircle } from 'mdi-material-ui'
import CloseIcon from '@mui/icons-material/Close'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': { borderRadius: 16 },
}))

const DetailRow = ({ label, value, highlight }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant='body2' color='text.secondary'>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 700, color: highlight || 'text.primary' }}>{value || '—'}</Typography>
  </Box>
)

const UsdFundingTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')

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
        `/api/allUsdFunding_details?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || 0)
      }
    } catch (e) {
      toast.error('Failed to load USD funding requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchDetail = async (id) => {
    setModalLoading(true)
    try {
      const res = await client.get(`/api/getUsdFunding_details/${id}`, { headers })
      if (res.data.msg === '201') setModalData(res.data.feedAll)
    } catch (e) {
      toast.error('Failed to load details')
    } finally {
      setModalLoading(false)
    }
  }

  const handleConfirmAction = async () => {
    setActionLoading(true)
    try {
      const endpoint = confirmAction === 'approve'
        ? '/api/approveUsdFunding'
        : '/api/rejectSaleFunding'

      const res = await client.post(endpoint, {
        tran_id: modalData._id,
        reject_note: rejectNote,
      }, { headers })

      if (res.data.msg === '201') {
        toast.success(`USD funding ${confirmAction === 'approve' ? 'approved' : 'rejected'} successfully`)
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
            <Typography variant='h6' sx={{ fontWeight: 700 }}>USD Funding Requests</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount} pending`} size='small' color='warning' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField size='small' placeholder='Search...' value={search}
              onChange={e => setSearch(e.target.value)} sx={{ minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position='start'><Magnify fontSize='small' /></InputAdornment> }}
            />
            <Button variant='contained' size='small' onClick={() => fetchData(1)}>Refresh</Button>
          </Box>
        }
      />
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <EmptyState title='No Pending USD Funding' message='No pending USD funding requests found.' />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Method</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Amount</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>TID</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Date</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: '0.75rem', fontWeight: 700, color:'#ffffff' }}>
                          {getInitials(row.acct_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.acct_name}</Typography>
                          <Typography variant='caption' color='text.secondary'>{row.acct_number}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.transac_category || '—'} size='small' color='info' variant='outlined' />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'success.main' }}>
                        ${Number(row.amount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='caption' sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        {row.tid?.slice(0, 16)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(row.createdOn).format('DD MMM YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size='small' variant='outlined'
                        startIcon={<Eye fontSize='small' />}
                        onClick={() => { setModalData(row); setModalOpen(true); fetchDetail(row._id) }}>
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
              onChange={(_, v) => { setPageNumber(v); fetchData(v) }}
              color='primary' shape='rounded' />
          </Box>
        </>
      )}

      {/* Detail Modal */}
      <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>USD Funding Details</Typography>
            <Typography variant='body2' color='text.secondary'>Review and approve this USD funding request</Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} size='small'><CloseIcon fontSize='small' /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2 }}>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : modalData ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2, p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'success.main', fontWeight: 700 }}>{getInitials(modalData.acct_name)}</Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>{modalData.acct_name}</Typography>
                    <Typography variant='caption' color='text.secondary'>Tag: {modalData.acct_number}</Typography>
                  </Box>
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 700, color: 'success.main' }}>
                  ${Number(modalData.amount || 0).toLocaleString()}
                </Typography>
              </Box>
              <DetailRow label='Method' value={modalData.transac_category} />
              <DetailRow label='Payment Method' value={modalData.trans_method} />
              <DetailRow label='Transaction ID' value={modalData.tid} highlight='primary.main' />
              <DetailRow label='Description' value={modalData.tran_desc} />
              <DetailRow label='Submitted' value={moment(modalData.createdOn).format('DD MMM YYYY, hh:mm A')} />

                {modalData.payment_proof_url ? (
                <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 700, mb: 1 }}>
                    Payment Proof
                    </Typography>
                    <Box
                    component='a'
                    href={modalData.payment_proof_url}
                    target='_blank'
                    rel='noreferrer'
                    sx={{
                        display: 'block',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.85 },
                    }}>
                    <Box
                        component='img'
                        src={modalData.payment_proof_url}
                        alt='Payment Proof'
                        onError={e => { e.target.style.display = 'none' }}
                        sx={{ width: '100%', maxHeight: 240, objectFit: 'contain', display: 'block', background: '#f9f9f9' }}
                    />
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                    Click image to open full size in a new tab
                    </Typography>
                </Box>
                ) : (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>No payment proof uploaded</Typography>
                </Box>
                )}

              <Alert severity='info' sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant='body2'>
                  Approving will credit <strong>${Number(modalData.amount || 0).toLocaleString()}</strong> to the user's USD wallet.
                </Typography>
              </Alert>
            </Box>
          ) : null}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant='outlined' onClick={() => setModalOpen(false)}>Close</Button>
          {modalData && modalData.transaction_status === 'Pending' && (
            <>
              <Button variant='outlined' color='error'
                startIcon={<CloseCircle />}
                onClick={() => { setConfirmAction('reject'); setConfirmOpen(true) }}>
                Reject
              </Button>
              <Button variant='contained' color='success'
                startIcon={<CheckCircle />}
                onClick={() => { setConfirmAction('approve'); setConfirmOpen(true) }}>
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
        title={confirmAction === 'approve' ? '✅ Approve USD Funding' : '❌ Reject USD Funding'}
        message={
          confirmAction === 'approve'
            ? `Approve USD funding of $${Number(modalData?.amount || 0).toLocaleString()} for ${modalData?.acct_name}?`
            : (
              <Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Reject USD funding of <strong>${Number(modalData?.amount || 0).toLocaleString()}</strong>?
                </Typography>
                <TextField fullWidth size='small' multiline rows={3}
                  label='Rejection Reason (optional)'
                  placeholder='Enter reason...'
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

export default UsdFundingTable