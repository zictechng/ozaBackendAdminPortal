import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Link from 'next/link'
import moment from 'moment'
import {
  AccountCheck, AccountAlert, AccountCancel, AccountGroup,
  CurrencyUsd, CashMultiple, Bitcoin, TrendingUp,
  Cellphone, Flash, Television, School, AccessPoint,
  HandCoin,
} from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import StatsCard from 'src/@core/components/common/StatsCard'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const Dashboard = () => {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [salesStats, setSalesStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [recentTx, setRecentTx] = useState([])
  const [billsStats, setBillsStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const [salesRes, userRes, recentRes, billsRes] = await Promise.all([
        client.get('/api/dashboard_salesReport', { headers }),
        client.get('/api/dashboard_userReport', { headers }),
        client.get('/api/recent_transactions/all', { headers }),
        client.get('/api/bills_services_status', { headers }),
      ])

      if (salesRes.data.msg === '201') setSalesStats(salesRes.data)
      if (userRes.data.msg === '201') setUserStats(userRes.data)
      if (recentRes.data) setRecentTx(recentRes.data.slice(0, 8))
      if (billsRes.data.msg === '200') setBillsStats(billsRes.data.services)
    } catch (e) {
      console.log('Dashboard fetch error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      router.replace('/pages/login')
      
      return
    }
    fetchDashboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const billsServices = [
    { key: 'airtime', label: 'Airtime', icon: <Cellphone />, color: '#4C5FD5' },
    { key: 'data', label: 'Mobile Data', icon: <AccessPoint />, color: '#10B981' },
    { key: 'electricity', label: 'Electricity', icon: <Flash />, color: '#F59E0B' },
    { key: 'tv_subscription', label: 'TV Sub', icon: <Television />, color: '#8B5CF6' },
    { key: 'exam_cards', label: 'Exam Cards', icon: <School />, color: '#EC4899' },
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Page Title */}
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>Dashboard</Typography>
          <Typography variant='body2' color='text.secondary'>
            Welcome back! Here is what is happening today.
          </Typography>
        </Box>
      </Grid>

      {/* Sales Stats Row */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Today Sales'
          value={`$${Number(salesStats?.feedback || 0).toLocaleString()}`}
          subtitle='Total daily sales value'
          icon={<TrendingUp />}
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
          trend='up'
          trendValue='8%'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='PayPal Sales'
          value={`$${Number(salesStats?.feedPaypal || 0).toLocaleString()}`}
          subtitle='Total PayPal transactions'
          icon={<CurrencyUsd />}
          iconBg='#DBEAFE'
          iconColor='#3B82F6'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Account Funding'
          value={`₦${Number(salesStats?.feedAcctFund || 0).toLocaleString()}`}
          subtitle='Total account funding'
          icon={<CashMultiple />}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Payoneer Sales'
          value={`$${Number(salesStats?.feedPayoneer || 0).toLocaleString()}`}
          subtitle='Total Payoneer transactions'
          icon={<CurrencyUsd />}
          iconBg='#FEF3C7'
          iconColor='#F59E0B'
        />
      </Grid>

      {/* User Stats Row */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='All Users'
          value={Number(userStats?.feedAll || 0).toLocaleString()}
          subtitle='Total registered users'
          icon={<AccountGroup />}
          iconBg='#EDE9FE'
          iconColor='#7C3AED'
          trend='up'
          trendValue='42%'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Active Users'
          value={Number(userStats?.feedActive || 0).toLocaleString()}
          subtitle='Total active users'
          icon={<AccountCheck />}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Pending Users'
          value={Number(userStats?.feedPending || 0).toLocaleString()}
          subtitle='Awaiting activation'
          icon={<AccountAlert />}
          iconBg='#FEF3C7'
          iconColor='#F59E0B'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Suspended Users'
          value={Number(userStats?.feedSuspended || 0).toLocaleString()}
          subtitle='Suspended accounts'
          icon={<AccountCancel />}
          iconBg='#FEE2E2'
          iconColor='#EF4444'
          trend='negative'
          trendValue='18%'
        />
      </Grid>

      {/* Bills Services Status */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bills Services Status</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Current status of all bill payment services</Typography>}
            action={
              <Link href='/bills/services' passHref>
                <Button size='small' variant='outlined'>Manage Services</Button>
              </Link>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {billsServices.map((service) => (
                <Grid item xs={6} sm={4} md={2.4} key={service.key}>
                  <Box sx={{
                    p: 3, borderRadius: 2, textAlign: 'center',
                    backgroundColor: service.color + '15',
                    border: '1px solid ' + service.color + '30',
                  }}>
                    <Box sx={{ color: service.color, mb: 1 }}>{service.icon}</Box>
                    <Typography variant='body2' sx={{ fontWeight: 700, mb: 0.5 }}>
                      {service.label}
                    </Typography>
                    <StatusBadge status={billsStats?.[service.key] || 'active'} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Recent Transactions</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Latest platform transactions</Typography>}
            action={
              <Link href='/all-transactions' passHref>
                <Button size='small' variant='outlined'>View All</Button>
              </Link>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {recentTx.length === 0 ? (
              <EmptyState title='No Recent Transactions' message='No transactions found.' />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Name</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>TID</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Amount</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Date</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Type</Typography></TableCell>
                      <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTx.map((tx) => (
                      <TableRow key={tx._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                              {tx.acct_name?.charAt(0) || 'U'}
                            </Avatar>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {tx.acct_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
                            {tx.tid}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 700, color: tx.tran_type === 'Credit' ? 'success.main' : 'error.main' }}>
                            ₦{Number(tx.amount || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {moment(tx.creditOn).format('DD MMM, YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {tx.transac_nature || tx.tran_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tx.transaction_status?.toLowerCase()} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default Dashboard