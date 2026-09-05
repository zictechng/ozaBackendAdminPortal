
import { useState, useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { Magnify, Eye, Download } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const SERVICE_TYPES = ['all', 'airtime', 'data', 'electricity', 'tv_subscription', 'exam_cards']

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>
      {value || 'N/A'}
    </Typography>
  </Box>
)

const BillsTransactions = () => {
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [selectedTx, setSelectedTx] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const limit = 15

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit,
        ...(serviceFilter !== 'all' && { service_type: serviceFilter }),
        ...(search && { search }),
      })
      const res = await client.get(`/api/admin/bills/transactions?${params}`, { headers })
      if (res.data.msg === '200') {
        setTransactions(res.data.transactions || [])
        setTotalPages(res.data.pagination?.pages || 1)
      }
    } catch (e) {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

   useEffect(() => {
    fetchTransactions(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, serviceFilter])


  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      fetchTransactions(1)
    }
  }

  const handleViewDetail = (tx) => {
    setSelectedTx(tx)
    setDetailOpen(true)
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Bills Transactions'
          subtitle='View and monitor all bill payment transactions across all services'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Bills Management' },
            { label: 'Transactions' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>All Bills Transactions</Typography>}
            action={
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size='small' sx={{ minWidth: 160 }}>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    label='Service Type'
                    value={serviceFilter}
                    onChange={e => { setServiceFilter(e.target.value); setPage(1) }}>
                    {SERVICE_TYPES.map(s => (
                      <MenuItem key={s} value={s}>
                        {s === 'all' ? 'All Services' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size='small'
                  placeholder='Search by phone, reference...'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  sx={{ minWidth: 250 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Magnify fontSize='small' />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                <CircularProgress />
              </Box>
            ) : transactions.length === 0 ? (
              <EmptyState
                title='No Transactions Found'
                message='No bills transactions match your current filter.'
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Reference</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Service</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Amount</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Coins</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Date</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Action</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx._id} hover>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {tx.reference}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>{tx.tag_id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.service_title}
                            size='small'
                            variant='outlined'
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 700, color: 'error.main' }}>
                            ₦{Number(tx.amount).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ color: 'warning.main', fontWeight: 600 }}>
                            +{tx.coins_earned || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {moment(tx.createdAt).format('DD MMM, YYYY')}
                          </Typography>
                          <Typography variant='body2' color='text.disabled'>
                            {moment(tx.createdAt).format('hh:mm A')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title='View Details'>
                            <IconButton size='small' onClick={() => handleViewDetail(tx)}>
                              <Eye fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color='primary'
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Transaction Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Transaction Details</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedTx && (
            <Box>
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: 'action.hover', textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>Amount</Typography>
                <Typography variant='h4' sx={{ fontWeight: 700, color: 'error.main' }}>
                  ₦{Number(selectedTx.amount).toLocaleString()}
                </Typography>
                <StatusBadge status={selectedTx.status} />
              </Box>
              <DetailRow label='Reference' value={selectedTx.reference} />
              <DetailRow label='Service' value={selectedTx.service_title} />
              <DetailRow label='Provider' value={selectedTx.provider} />
              <DetailRow label='User Tag ID' value={selectedTx.tag_id} />
              <DetailRow label='Phone Number' value={selectedTx.phone_number} />
              <DetailRow label='Network' value={selectedTx.network} />
              <DetailRow label='Meter Number' value={selectedTx.meter_number} />
              <DetailRow label='Token' value={selectedTx.token_delivered} />
              <DetailRow label='Smartcard' value={selectedTx.smartcard_number} />
              <DetailRow label='Bouquet' value={selectedTx.bouquet} />
              <DetailRow label='Exam Type' value={selectedTx.exam_type} />
              <DetailRow label='Coins Earned' value={`${selectedTx.coins_earned || 0} coins`} />
              <DetailRow label='Balance Before' value={`₦${Number(selectedTx.wallet_balance_before).toLocaleString()}`} />
              <DetailRow label='Balance After' value={`₦${Number(selectedTx.wallet_balance_after).toLocaleString()}`} />
              <DetailRow label='Provider Ref' value={selectedTx.provider_reference} />
              <DetailRow label='Date' value={moment(selectedTx.createdAt).format('DD MMM YYYY, hh:mm A')} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDetailOpen(false)} variant='outlined'>Close</Button>
        </DialogActions>
      </Dialog>

    </Grid>
  )
}

export default BillsTransactions