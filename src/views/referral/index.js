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
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const ReferralTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const pageLimit = 15

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/fetchAll_referral?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load referrals')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (id) => { setSelectedId(id); setConfirmOpen(true) }

  const handleConfirmApprove = async () => {
    setActionLoading(true)
    try {
      const res = await client.get(`/api/approveReferral_bonus/${selectedId}`, { headers })
      if (res.data.msg === '201' || res.data.msg === '200') {
        toast.success('Referral bonus approved successfully')
        fetchData(pageNumber)
      } else {
        toast.error(res.data.message || 'Action failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActionLoading(false)
      setConfirmOpen(false)
      setSelectedId(null)
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
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Referral Bonus</Typography>
            {totalCount > 0 && (
              <Chip label={`${totalCount.toLocaleString()} records`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
            )}
          </Box>
        }
        action={
          <Tooltip title='Refresh'>
            <IconButton size='small' onClick={() => fetchData(pageNumber)} disabled={loading} sx={{ mr: 2 }}>
              <RefreshIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>}
      {!loading && data.length === 0 && <EmptyState title='No Referrals' message='No referral records found.' />}

      {!loading && data.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['Referrer', 'Tag ID', 'Referred User', 'Email', 'Amount', 'Status', 'Date', 'Action'].map(col => (
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
                          {getInitials(row.ref_mainEmail)}
                        </Avatar>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.ref_mainEmail || '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.ref_mainTag || '—'} size='small' variant='outlined' color='primary' sx={{ fontWeight: 600, fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>{row.ref_userName || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>{row.ref_userEmail || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'success.main' }}>
                        ₦{Number(row.ref_amt || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell><StatusBadge status={row.ref_status?.toLowerCase()} /></TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {row.createdOn ? moment(row.createdOn).format('DD MMM, YYYY') : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.ref_status === 'Pending' ? (
                        <Tooltip title='Approve Bonus'>
                          <Button size='small' variant='contained' color='success'
                            startIcon={<CheckCircleIcon fontSize='small' />}
                            onClick={() => handleApprove(row._id)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                            Approve
                          </Button>
                        </Tooltip>
                      ) : (
                        <StatusBadge status={row.ref_status?.toLowerCase()} />
                      )}
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

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedId(null) }}
        onConfirm={handleConfirmApprove}
        loading={actionLoading}
        title='Approve Referral Bonus'
        message='Are you sure you want to approve this referral bonus? The amount will be credited to the referrer immediately.'
        confirmLabel='Approve'
        confirmColor='success'
      />
    </Card>
  )
}

export default ReferralTable