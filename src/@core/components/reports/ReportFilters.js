
import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Refresh from 'mdi-material-ui/Refresh'
import FileExcel from 'mdi-material-ui/FileExcel'

const ReportFilters = ({
  onFilter,
  onExport,
  showPeriod = true,
  showType = false,
  showStatus = false,
  showCategory = false,
  loading = false,
  exportLoading = false,
}) => {
  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [period, setPeriod] = useState('monthly')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  const handleFilter = () => {
    onFilter({ dateFrom, dateTo, period, type, status, category })
  }

  const handleExport = () => {
    if (onExport) onExport({ dateFrom, dateTo, type, status, category })
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Filter Report
        </Typography>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth label='Date From' type='date' size='small'
              value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth label='Date To' type='date' size='small'
              value={dateTo} onChange={e => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {showPeriod && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth select label='Group By' size='small'
                value={period} onChange={e => setPeriod(e.target.value)}>
                <MenuItem value='daily'>Daily</MenuItem>
                <MenuItem value='weekly'>Weekly</MenuItem>
                <MenuItem value='monthly'>Monthly</MenuItem>
              </TextField>
            </Grid>
          )}
          {showType && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth select label='Type' size='small'
                value={type} onChange={e => setType(e.target.value)}>
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Credit'>Credit</MenuItem>
                <MenuItem value='Debit'>Debit</MenuItem>
              </TextField>
            </Grid>
          )}
          {showStatus && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth select label='Status' size='small'
                value={status} onChange={e => setStatus(e.target.value)}>
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Completed'>Completed</MenuItem>
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Failed'>Failed</MenuItem>
              </TextField>
            </Grid>
          )}
          {showCategory && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth select label='Category' size='small'
                value={category} onChange={e => setCategory(e.target.value)}>
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='PayPal'>PayPal</MenuItem>
              <MenuItem value='Payoneer'>Payoneer</MenuItem>
              <MenuItem value='Bitcoin'>Bitcoin</MenuItem>
              <MenuItem value='Account Funding'>Account Funding</MenuItem>
              <MenuItem value='Exchange'>Buy/Exchange</MenuItem>
              <MenuItem value='Airtime'>Airtime</MenuItem>
              <MenuItem value='Data'>Data</MenuItem>
              <MenuItem value='Electricity'>Electricity</MenuItem>
              <MenuItem value='TV Subscription'>TV Subscription</MenuItem>
              <MenuItem value='Exam Cards'>Exam Cards</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth variant='contained' size='small'
                startIcon={<Refresh />}
                onClick={handleFilter}
                disabled={loading}>
                Apply
              </Button>
              {onExport && (
                <Button
                  fullWidth variant='outlined' size='small' color='success'
                  startIcon={<FileExcel />}
                  onClick={handleExport}
                  disabled={exportLoading}>
                  CSV
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReportFilters