
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
import LinearProgress from '@mui/material/LinearProgress'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'

import CheckCircle from 'mdi-material-ui/CheckCircle'
import CloseCircle from 'mdi-material-ui/CloseCircle'
import Cellphone from 'mdi-material-ui/Cellphone'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatsCard from 'src/@core/components/common/StatsCard'
import ReportFilters from 'src/@core/components/reports/ReportFilters'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const COLORS = ['#4C5FD5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
const formatNaira = v => '₦' + Number(v || 0).toLocaleString()

const SERVICE_ICONS = {
  airtime: Cellphone,
  data: AccessPoint,
  electricity: Flash,
  tv_subscription: Television,
  exam_cards: School,
}

export default function ServicesReport() {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { router.replace('/pages/login'); 

        return }
    fetchReport({
      dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchReport = async (f) => {
    setLoading(true)
    try {
      const res = await client.get('/api/reports/services', {
        headers,
        params: { dateFrom: f.dateFrom, dateTo: f.dateTo }
      })
      if (res.data.msg === '201') setData(res.data)
    } catch (e) {
      console.log('Services report error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (f) => fetchReport(f)

  const maxRevenue = Math.max(...(data?.serviceBreakdown?.map(s => s.revenue) || [1]))

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
          title='Services Report'
          subtitle='Bills payment performance and service analytics'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Reports' },
            { label: 'Services' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <ReportFilters onFilter={handleFilter} showPeriod={false} loading={loading} />
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Total Bills Revenue'
          value={formatNaira(data?.summary?.totalRevenue)}
          subtitle='All services combined'
          icon={<CheckCircle />}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Total Transactions'
          value={Number(data?.summary?.totalTransactions || 0).toLocaleString()}
          subtitle='All bill payments'
          icon={<Cellphone />}
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Successful'
          value={Number(data?.summary?.successCount || 0).toLocaleString()}
          subtitle='Completed transactions'
          icon={<CheckCircle />}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title='Success Rate'
          value={`${data?.summary?.successRate || 0}%`}
          subtitle='Transaction success ratio'
          icon={<CloseCircle />}
          iconBg='#FEF3C7'
          iconColor='#F59E0B'
        />
      </Grid>

      {/* Service Breakdown */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Revenue by Service</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Breakdown of bills revenue per service</Typography>}
          />
          <Divider />
          <CardContent>
            {!data?.serviceBreakdown?.length ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No service data available</Typography>
              </Box>
            ) : (
              <Box>
                {data.serviceBreakdown.map((service, i) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                        <Typography variant='body2' sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {service._id?.replace('_', ' ')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>{formatNaira(service.revenue)}</Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          {service.count} txns | ✓{service.successful} ✗{service.failed}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={(service.revenue / maxRevenue) * 100}
                      sx={{
                        height: 8, borderRadius: 4,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': { backgroundColor: COLORS[i % COLORS.length], borderRadius: 4 }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Network breakdown pie */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Revenue by Network</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Top performing networks</Typography>}
          />
          <Divider />
          <CardContent>
            {!data?.networkBreakdown?.length ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No network data available</Typography>
              </Box>
            ) : (
              <>
                <ResponsiveContainer width='100%' height={200}>
                  <PieChart>
                    <Pie data={data.networkBreakdown.map(n => ({ name: n._id, value: n.revenue }))}
                      cx='50%' cy='50%' innerRadius={45} outerRadius={80}
                      paddingAngle={3} dataKey='value'>
                      {data.networkBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => formatNaira(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <Box>
                  {data.networkBreakdown.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>{item._id}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant='caption' sx={{ fontWeight: 700 }}>{formatNaira(item.revenue)}</Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block' }}>{item.count} txns</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Bills Trend */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Daily Bills Volume</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Transaction volume over time</Typography>}
          />
          <Divider />
          <CardContent>
            {!data?.dailyBills?.length ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No daily data available</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <AreaChart data={data.dailyBills.map(d => ({ date: d._id, revenue: d.revenue, count: d.count }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='billsGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#10B981' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#10B981' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={v => `₦${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatNaira(v)} />
                  <Area type='monotone' dataKey='revenue' stroke='#10B981'
                    fill='url(#billsGrad)' strokeWidth={2} name='Revenue' />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}