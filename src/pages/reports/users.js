
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { AccountGroup, AccountCheck, AccountAlert, AccountCancel, ShieldAccount } from 'mdi-material-ui'
import moment from 'moment'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatsCard from 'src/@core/components/common/StatsCard'
import ReportFilters from 'src/@core/components/reports/ReportFilters'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#4C5FD5', '#8B5CF6']
const formatNaira = v => '₦' + Number(v || 0).toLocaleString()

export default function UserReport() {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    period: 'monthly',
  })

  useEffect(() => {
    if (!token) { router.replace('/pages/login');

        return }
    fetchReport(filters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchReport = async (f) => {
    setLoading(true)
    try {
      const res = await client.get('/api/reports/users', {
        headers,
        params: { dateFrom: f.dateFrom, dateTo: f.dateTo, period: f.period }
      })
      if (res.data.msg === '201') setData(res.data)
    } catch (e) {
      console.log('User report error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (f) => {
    setFilters(f)
    fetchReport(f)
  }

  const growthData = data?.userGrowth?.map(g => ({
    period: g._id,
    registrations: g.count,
  })) || []

  const kycData = data?.kycStats?.map(k => ({
    name: k._id || 'Unknown',
    value: k.count,
  })) || []

  const statusData = data?.statusBreakdown?.map(s => ({
    name: s._id || 'Unknown',
    count: s.count,
  })) || []

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='User Report'
          subtitle='User growth, KYC completion and account analytics'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Reports' },
            { label: 'Users' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <ReportFilters
          onFilter={handleFilter}
          showPeriod
          loading={loading}
        />
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Total Users'
          value={Number(data?.summary?.totalUsers || 0).toLocaleString()}
          subtitle='All registered users'
          icon={AccountGroup}
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='New in Period'
          value={Number(data?.summary?.newUsersInPeriod || 0).toLocaleString()}
          subtitle='Registered in date range'
          icon={AccountCheck}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Verified Users'
          value={Number(data?.summary?.verifiedUsers || 0).toLocaleString()}
          subtitle='KYC approved'
          icon={ShieldAccount}
          iconBg='#FEF3C7'
          iconColor='#F59E0B'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Verification Rate'
          value={`${data?.summary?.verificationRate || 0}%`}
          subtitle='Of total users verified'
          icon={AccountAlert}
          iconBg='#EDE9FE'
          iconColor='#8B5CF6'
        />
      </Grid>

      {/* User Growth Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>User Growth</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>New registrations over time</Typography>}
          />
          <Divider />
          <CardContent>
            {growthData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No registrations in this period</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <LineChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='period' tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type='monotone' dataKey='registrations' stroke='#4C5FD5'
                    strokeWidth={2.5} dot={{ fill: '#4C5FD5', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* KYC Pie Chart */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>KYC Status</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Verification breakdown</Typography>}
          />
          <Divider />
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie data={kycData} cx='50%' cy='50%'
                  innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey='value'>
                  {kycData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 1 }}>
              {kycData.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>{item.name}</Typography>
                  </Box>
                  <Typography variant='caption' sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Account Status Bar Chart */}
      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Account Status Breakdown</Typography>}
          />
          <Divider />
          <CardContent>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={statusData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey='count' radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Users Table */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Top Users by Balance</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Highest wallet balances</Typography>}
          />
          <Divider />
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell><Typography variant='caption' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                  <TableCell><Typography variant='caption' sx={{ fontWeight: 700 }}>Tag ID</Typography></TableCell>
                  <TableCell><Typography variant='caption' sx={{ fontWeight: 700 }}>Balance</Typography></TableCell>
                  <TableCell><Typography variant='caption' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                  <TableCell><Typography variant='caption' sx={{ fontWeight: 700 }}>Joined</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.topUsers?.map((u, i) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {u.display_name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant='caption' sx={{ fontWeight: 600, display: 'block' }}>{u.display_name}</Typography>
                          <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>{u.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant='caption'>{u.tag_id}</Typography></TableCell>
                    <TableCell>
                      <Typography variant='caption' sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatNaira(u.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.acct_approved_status}
                        size='small'
                        color={u.acct_approved_status === 'Approved' ? 'success' : 'warning'}
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        {moment(u.createdOn).format('DD MMM YYYY')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}
