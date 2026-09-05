
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
import InputAdornment from '@mui/material/InputAdornment'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { Magnify, HandCoin } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

import PageHeader from 'src/@core/components/common/PageHeader'
import EmptyState from 'src/@core/components/common/EmptyState'
import StatsCard from 'src/@core/components/common/StatsCard'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const SOURCE_TYPES = [
  'all',
  'bills_payment',
  'buy_sell',
  'referral',
  'business_promoter',
  'admin_credit',
  'redemption',
]

const CoinsHistory = () => {
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  const [stats, setStats] = useState({
    totalCoins: 0,
    totalUsers: 0,
    todayCoins: 0,
  })

  const limit = 15

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit,
        ...(sourceFilter !== 'all' && { source_type: sourceFilter }),
        ...(search && { search }),
      })
      const res = await client.get(`/api/admin/coins/history?${params}`, { headers })
      if (res.data.msg === '200') {
        setTransactions(res.data.transactions || [])
        setTotalPages(res.data.pagination?.pages || 1)
        setTotal(res.data.pagination?.total || 0)
        setStats(res.data.stats || {})
      }
    } catch (e) {
      toast.error('Failed to load coins history')
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
    fetchTransactions(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sourceFilter])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      fetchTransactions(1)
    }
  }

  const handlePageChange = (e, value) => {
    setPage(value)
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Coins History'
          subtitle='View all coins earned and spent across all users and transactions'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Rewards & Coins' },
            { label: 'Coins History' },
          ]}
        />
      </Grid>

      {/* Stats Row */}
      <Grid item xs={12} sm={4}>
        <StatsCard
          title='Total Coins Issued'
          value={Number(stats.totalCoins || 0).toLocaleString()}
          subtitle='All time coins issued to users'
          iconBg='#FEF3C720'
          iconColor='#F59E0B'
          icon={<HandCoin />}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title='Total Records'
          value={Number(total || 0).toLocaleString()}
          subtitle='Total coins transaction records'
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
          icon={<HandCoin />}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title='Today Coins'
          value={Number(stats.todayCoins || 0).toLocaleString()}
          subtitle="Coins issued today"
          iconBg='#D1FAE5'
          iconColor='#10B981'
          icon={<HandCoin />}
        />
      </Grid>

      {/* Table */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>All Coins Transactions</Typography>}
            action={
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size='small' sx={{ minWidth: 180 }}>
                  <InputLabel>Source Type</InputLabel>
                  <Select
                    label='Source Type'
                    value={sourceFilter}
                    onChange={e => { setSourceFilter(e.target.value); setPage(1) }}>
                    {SOURCE_TYPES.map(s => (
                      <MenuItem key={s} value={s}>
                        {s === 'all' ? 'All Sources' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size='small'
                  placeholder='Search by tag ID...'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  sx={{ minWidth: 220 }}
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
                title='No Coins Transactions'
                message='No coins transactions match your current filter.'
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Type</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Source</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Coins</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Balance Before</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Balance After</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Description</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Date</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx._id} hover>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {tx.tag_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.type}
                            size='small'
                            color={tx.type === 'credit' ? 'success' : 'error'}
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.source_type?.replace(/_/g, ' ')}
                            size='small'
                            variant='outlined'
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant='body2'
                            sx={{
                              fontWeight: 700,
                              color: tx.type === 'credit' ? 'success.main' : 'error.main'
                            }}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.coins}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {Number(tx.coins_balance_before || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {Number(tx.coins_balance_after || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'
                            sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tx.description || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {moment(tx.createdAt).format('DD MMM, YYYY')}
                          </Typography>
                          <Typography variant='body2' color='text.disabled'>
                            {moment(tx.createdAt).format('hh:mm A')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  Page {page} of {totalPages} — {total.toLocaleString()} records
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color='primary'
                  shape='rounded'
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CoinsHistory