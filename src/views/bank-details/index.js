import { useState, useEffect } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'

// MUI Imports
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
import PrintIcon from '@mui/icons-material/Print'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'

import { Eye, Bank, CreditCard, Bitcoin } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import client from 'src/@core/context/client'

// ── Styled Detail Dialog ──────────────────────────
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 3,
    minWidth: 520,
    [theme.breakpoints.down('sm')]: { minWidth: '95vw' },
  },
}))

// ── Detail Row ────────────────────────────────────
const DetailRow = ({ label, value, highlight }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    py: 1.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
    gap: 2,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, minWidth: 140 }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{
      fontWeight: 600,
      textAlign: 'right',
      color: highlight || 'text.primary',
      wordBreak: 'break-all',
    }}>
      {value || '—'}
    </Typography>
  </Box>
)

// ── Section Header ────────────────────────────────
const SectionHeader = ({ icon, title, color = 'primary.main' }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
    mt: 1,
    pb: 1,
    borderBottom: '2px solid',
    borderColor: 'divider',
  }}>
    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
    <Typography variant='subtitle2' sx={{ fontWeight: 700, color }}>
      {title}
    </Typography>
  </Box>
)

// ── Main Component ────────────────────────────────
const UserBankDetailsTable = () => {
  const router = useRouter()
  const userTokenId = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + userTokenId }

  const [bankData, setBankData] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageLimit = 15

  // ── Detail Modal State ────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // ── Fetch All Bank Details ────────────────────
  const fetchBankDetails = async (page = 1) => {
    setLoadingData(true)
    try {
      const res = await client.get(
        `/api/userBank_details?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setBankData(res.data.feedAll || [])
        setTotalPageCount(res.data.totalPage || 1)
        setTotalCount(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (error) {
      toast.error('Failed to load bank details')
    } finally {
      setLoadingData(false)
    }
  }

  // ── Search ────────────────────────────────────
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      fetchBankDetails(1)
      
      return
    }
    setLoadingSearch(true)
    try {
      const res = await client.post(
        '/api/searchUsersBank_details',
        { dataInfo: searchInput.trim() },
        { headers }
      )
      if (res.data.msg === '201') {
        openModal(res.data.feedAll)
        setSearchInput('')
      } else {
        toast.warning(res.data.message || 'No record found for that search')
      }
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoadingSearch(false)
    }
  }

  // ── Fetch single record for modal ─────────────
  const fetchSingleRecord = async (id) => {
    setModalLoading(true)
    setModalOpen(true)
    setModalData(null)
    try {
      const res = await client.get(`/api/getBank_UserDetails/${id}`, { headers })
      if (res.data.msg === '201') {
        setModalData(res.data.feedAll)
      } else if (res.data.msg === '401') {
        toast.error('Session expired. Please log in again.')
        router.push('/pages/login')
        localStorage.clear()
      } else {
        toast.error(res.data.message || 'Record not found')
        setModalOpen(false)
      }
    } catch (error) {
      toast.error('Failed to load bank details')
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const openModal = (data) => {
    setModalData(data)
    setModalOpen(true)
  }

  const handlePageChange = (_, value) => {
    setPageNumber(value)
    fetchBankDetails(value)
  }

  // ── Print bank detail ─────────────────────────
  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    fetchBankDetails(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Get initials for avatar ───────────────────
  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  // ── Truncate long addresses ───────────────────
  const truncate = (str, len = 16) =>
    str && str.length > len ? str.slice(0, len) + '...' : str || '—'

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      {/* ── Card Header ────────────────────────── */}
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Bank Details
            </Typography>
            {totalCount > 0 && (
              <Chip
                label={`${totalCount.toLocaleString()} records`}
                size='small'
                color='primary'
                variant='outlined'
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField
              size='small'
              placeholder='Search by Email or Tag ID'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' color='action' />
                  </InputAdornment>
                ),
                endAdornment: loadingSearch
                  ? <InputAdornment position='end'>
                      <CircularProgress size={16} />
                    </InputAdornment>
                  : null,
              }}
            />
            <Button
              variant='contained'
              size='small'
              onClick={handleSearch}
              disabled={loadingSearch}
              sx={{ borderRadius: 2, px: 3 }}>
              Search
            </Button>
            <Tooltip title='Refresh'>
              <IconButton
                size='small'
                onClick={() => fetchBankDetails(pageNumber)}
                disabled={loadingData}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      <Divider />

      {/* ── Loading State ─────────────────────── */}
      {loadingData && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* ── Empty State ───────────────────────── */}
      {!loadingData && bankData.length === 0 && (
        <EmptyState
          title='No Bank Details Found'
          message='No bank details have been submitted yet.'
        />
      )}

      {/* ── Table ─────────────────────────────── */}
      {!loadingData && bankData.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {[
                    'Account Owner',
                    'Bank Info',
                    'Account Number',
                    'PayPal',
                    'Payoneer',
                    'Bitcoin',
                    'Tag ID',
                    'Status',
                    'Date',
                    'Action',
                  ].map(col => (
                    <TableCell key={col}>
                      <Typography variant='body2' sx={{ fontWeight: 700 }}>
                        {col}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {bankData.map(row => (
                  <TableRow
                    key={row._id}
                    hover
                    sx={{ '&:last-of-type td': { border: 0 } }}>

                    {/* Account Owner */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: 'primary.main',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}>
                          {getInitials(row.bank_acct_name)}
                        </Avatar>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {row.bank_acct_name || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Bank Info */}
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {row.bank_name || '—'}
                      </Typography>
                    </TableCell>

                    {/* Account Number */}
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          letterSpacing: 0.5,
                          color: 'primary.main',
                        }}>
                        {row.bank_acct_number || '—'}
                      </Typography>
                    </TableCell>

                    {/* PayPal */}
                    <TableCell>
                      <Tooltip title={row.paypal_address || 'N/A'}>
                        <Typography variant='body2' color='text.secondary'>
                          {truncate(row.paypal_address)}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Payoneer */}
                    <TableCell>
                      <Tooltip title={row.payoneer_address || 'N/A'}>
                        <Typography variant='body2' color='text.secondary'>
                          {truncate(row.payoneer_address)}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Bitcoin */}
                    <TableCell>
                      <Tooltip title={row.btc_address || 'N/A'}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
                          {truncate(row.btc_address, 12)}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Tag ID */}
                    <TableCell>
                      <Chip
                        label={row.user_tag_id || '—'}
                        size='small'
                        variant='outlined'
                        color='primary'
                        sx={{ fontWeight: 600, fontFamily: 'monospace' }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={row.bank_status?.toLowerCase()} />
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(row.createdOn).format('DD MMM, YYYY')}
                      </Typography>
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <Tooltip title='View full details'>
                        <Button
                          size='small'
                          variant='outlined'
                          startIcon={<Eye fontSize='small' />}
                          onClick={() => fetchSingleRecord(row._id)}
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

          {/* ── Pagination ──────────────────────── */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 4,
            py: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}>
            <Typography variant='body2' color='text.secondary'>
              Page <strong>{pageNumber}</strong> of <strong>{totalPageCount}</strong>
              {' '}· {totalCount.toLocaleString()} total records
            </Typography>
            <Pagination
              count={totalPageCount}
              page={pageNumber}
              onChange={handlePageChange}
              color='primary'
              shape='rounded'
              size='small'
            />
          </Box>
        </>
      )}

      {/* ── Detail Modal ──────────────────────── */}
      <StyledDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth='sm'
        fullWidth>

        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              {modalLoading ? 'Loading...' : modalData?.bank_acct_name || 'Bank Details'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Full account & payment details
            </Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ px: 3, py: 2 }}>
          {modalLoading ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 8,
              gap: 2,
            }}>
              <CircularProgress size={40} />
              <Typography variant='body2' color='text.secondary'>
                Loading bank details...
              </Typography>
            </Box>
          ) : modalData ? (
            <Box>
              {/* Status Strip */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'action.hover',
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 700 }}>
                    {getInitials(modalData.bank_acct_name)}
                  </Avatar>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {modalData.bank_acct_name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Tag: {modalData.user_tag_id}
                    </Typography>
                  </Box>
                </Box>
                <StatusBadge status={modalData.bank_action?.toLowerCase()} />
              </Box>

              {/* Dates */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box sx={{
                    backgroundColor: 'action.hover',
                    borderRadius: 2,
                    p: 1.5,
                    textAlign: 'center',
                  }}>
                    <Typography variant='caption' color='text.secondary'>Registered</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {moment(modalData.createdOn).format('DD MMM YYYY')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{
                    backgroundColor: 'action.hover',
                    borderRadius: 2,
                    p: 1.5,
                    textAlign: 'center',
                  }}>
                    <Typography variant='caption' color='text.secondary'>Action Date</Typography>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {modalData.approved_date
                        ? moment(modalData.approved_date).format('DD MMM YYYY')
                        : '—'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Bank Details Section */}
              <SectionHeader
                icon={<Bank fontSize='small' />}
                title='Bank Account'
                color='primary.main'
              />
              <DetailRow label='Bank Name' value={modalData.bank_name} />
              <DetailRow label='Account Name' value={modalData.bank_acct_name} />
              <DetailRow
                label='Account Number'
                value={modalData.bank_acct_number}
                highlight='primary.main'
              />

              {/* Digital Wallets Section */}
              <SectionHeader
                icon={<CreditCard fontSize='small' />}
                title='Digital Wallets'
                color='success.main'
              />
              <DetailRow label='PayPal Address' value={modalData.paypal_address} />
              <DetailRow label='Payoneer Address' value={modalData.payoneer_address} />

              {/* Crypto Section */}
              <SectionHeader
                icon={<Bitcoin fontSize='small' />}
                title='Cryptocurrency'
                color='warning.main'
              />
              <DetailRow label='Bitcoin Address' value={modalData.btc_address} />

              {/* Note */}
              {modalData.tran_desc && (
                <Alert severity='info' sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant='body2'>{modalData.tran_desc}</Typography>
                </Alert>
              )}
            </Box>
          ) : (
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              Failed to load bank details. Please try again.
            </Alert>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            variant='outlined'
            onClick={() => setModalOpen(false)}
            sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant='contained'
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={modalLoading || !modalData}
            sx={{ borderRadius: 2 }}>
            Print
          </Button>
        </DialogActions>
      </StyledDialog>
    </Card>
  )
}

export default UserBankDetailsTable