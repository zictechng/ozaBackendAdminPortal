import { useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import CashMultiple from 'mdi-material-ui/CashMultiple'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import TrendingDown from 'mdi-material-ui/TrendingDown'
import ClockOutline from 'mdi-material-ui/ClockOutline'
import CheckCircle from 'mdi-material-ui/CheckCircle'
import CloseCircle from 'mdi-material-ui/CloseCircle'
import Papa from 'papaparse'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatsCard from 'src/@core/components/common/StatsCard'
import ReportFilters from 'src/@core/components/reports/ReportFilters'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const COLORS = ['#4C5FD5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899']

const formatNaira = v => '₦' + Number(v || 0).toLocaleString()
const formatNum = v => Number(v || 0).toLocaleString()

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 2, p: 2, boxShadow: 3 }}>
        <Typography variant='caption' sx={{ fontWeight: 700, display: 'block', mb: 1 }}>{label}</Typography>
        {payload.map((p, i) => (
          <Typography key={i} variant='caption' sx={{ display: 'block', color: p.color, fontWeight: 600 }}>
            {p.name}: {formatNaira(p.value)}
          </Typography>
        ))}
      </Box>
    )
  }

  return null
}

export default function FinancialReport() {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)

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
      const res = await client.get('/api/reports/financial', {
        headers,
        params: { dateFrom: f.dateFrom, dateTo: f.dateTo, period: f.period }
      })
      if (res.data.msg === '201') setData(res.data)
    } catch (e) {
      console.log('Financial report error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (f) => {
    setFilters(f)
    fetchReport(f)
  }

  const handleExport = async (f) => {
    setExportLoading(true)
    try {
      const res = await client.get('/api/reports/export', {
        headers,
        params: { dateFrom: f.dateFrom, dateTo: f.dateTo }
      })
      if (res.data.msg === '201') {
        const csv = Papa.unparse(res.data.data)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `financial-report-${f.dateFrom}-to-${f.dateTo}.csv`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.log('Export error:', e.message)
    } finally {
      setExportLoading(false)
    }
  }

  // Build chart data from timeSeries
  const buildChartData = () => {
    if (!data?.timeSeries) return []
    const map = {}
    data.timeSeries.forEach(item => {
      const key = item._id.period
      if (!map[key]) map[key] = { period: key, Credit: 0, Debit: 0 }
      map[key][item._id.type] = item.total
    })
    
    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period))
  }

  const chartData = buildChartData()

  const categoryData = data?.categoryBreakdown?.map(c => ({
    name: c._id || 'Other',
    value: c.total,
    count: c.count,
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
          title='Financial Report'
          subtitle='Revenue, credits, debits and transaction analytics'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Reports' },
            { label: 'Financial' },
          ]}
        />
      </Grid>

      {/* Filters */}
      <Grid item xs={12}>
        <ReportFilters
          onFilter={handleFilter}
          onExport={handleExport}
          showPeriod
          loading={loading}
          exportLoading={exportLoading}
        />
      </Grid>

      {/* Summary Cards */}
            <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Total Credits'
          value={formatNaira(data?.summary?.totalCredits)}
          subtitle={`${formatNum(data?.summary?.creditCount)} transactions`}
          icon={<TrendingUp />}
          iconBg='#D1FAE5'
          iconColor='#10B981'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Total Debits'
          value={formatNaira(data?.summary?.totalDebits)}
          subtitle={`${formatNum(data?.summary?.debitCount)} transactions`}
          icon={<TrendingDown />}
          iconBg='#FEE2E2'
          iconColor='#EF4444'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Completed Transactions'
          value={formatNum(data?.summary?.completedTx)}
          subtitle={`${formatNum(data?.summary?.pendingTx)} pending`}
          icon={<CheckCircle />}
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Pending Transactions'
          value={formatNum(data?.summary?.pendingTx)}
          subtitle='Awaiting approval'
          icon={<ClockOutline />}
          iconBg='#FEF3C7'
          iconColor='#F59E0B'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Failed / Rejected'
          value={formatNum(data?.summary?.failedTx)}
          subtitle='Failed transactions'
          icon={<CloseCircle />}
          iconBg='#FEE2E2'
          iconColor='#EF4444'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title='Total Transactions'
          value={formatNum(data?.summary?.totalTx)}
          subtitle='All types combined'
          icon={<CashMultiple />}
          iconBg='#EEF2FF'
          iconColor='#4C5FD5'
        />
      </Grid>

      {/* Credit vs Debit Chart */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Credit vs Debit Trend</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Transaction volume over time</Typography>}
          />
          <Divider />
          <CardContent>
            {chartData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No data for selected period</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width='100%' height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='creditGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#4C5FD5' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#4C5FD5' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='debitGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#EF4444' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#EF4444' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='period' tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `₦${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type='monotone' dataKey='Credit' stroke='#4C5FD5' fill='url(#creditGrad)' strokeWidth={2} />
                  <Area type='monotone' dataKey='Debit' stroke='#EF4444' fill='url(#debitGrad)' strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Category Breakdown + Bills Revenue */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Transaction by Category</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Revenue by transaction type</Typography>}
          />
          <Divider />
          <CardContent>
            {categoryData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No data available</Typography>
              </Box>
            ) : (
              <>
                <ResponsiveContainer width='100%' height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx='50%' cy='50%'
                      innerRadius={55} outerRadius={90}
                      paddingAngle={3} dataKey='value'>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => formatNaira(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {categoryData.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>{item.name}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>{formatNaira(item.value)}</Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>{item.count} txns</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Bills Revenue */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bills Revenue</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Revenue by bill type</Typography>}
          />
          <Divider />
          <CardContent>
            {!data?.billsRevenue?.length ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No bills data available</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width='100%' height={320}>
                <BarChart data={data.billsRevenue.map(b => ({ name: b._id, revenue: b.revenue, count: b.count }))}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `₦${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatNaira(v)} />
                  <Bar dataKey='revenue' fill='#4C5FD5' radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}