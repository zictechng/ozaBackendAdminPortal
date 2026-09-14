
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import FileExcel from 'mdi-material-ui/FileExcel'
import FilePdfBox from 'mdi-material-ui/FilePdfBox'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'
import PageHeader from 'src/@core/components/common/PageHeader'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const FIELD_OPTIONS = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'tag_id', label: 'Tag ID' },
  { key: 'country', label: 'Country' },
  { key: 'status', label: 'Account Status' },
  { key: 'kyc', label: 'KYC Status' },
  { key: 'date', label: 'Date Joined' },
]

const PRESETS = [
  {
    label: 'Email Only',
    desc: 'Just email addresses — perfect for Inboxvio / Mailchimp',
    fields: ['email'],
    icon: '📧',
    color: '#4C5FD5',
  },
  {
    label: 'Email + Name',
    desc: 'Name and email — ideal for personalised campaigns',
    fields: ['name', 'email'],
    icon: '👤',
    color: '#10B981',
  },
  {
    label: 'Phone Only',
    desc: 'Phone numbers for SMS campaigns',
    fields: ['phone'],
    icon: '📱',
    color: '#F59E0B',
  },
  {
    label: 'Email + Phone',
    desc: 'Email and phone for multi-channel campaigns',
    fields: ['email', 'phone'],
    icon: '📲',
    color: '#8B5CF6',
  },
  {
    label: 'Full User Data',
    desc: 'All fields — complete user export',
    fields: ['name', 'email', 'phone', 'tag_id', 'country', 'status', 'kyc', 'date'],
    icon: '📊',
    color: '#EF4444',
  },
]

export default function UsersExport() {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [selectedFields, setSelectedFields] = useState(['name', 'email'])
  const [userStatus, setUserStatus] = useState('all')
  const [accountStatus, setAccountStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const applyPreset = (fields) => setSelectedFields(fields)

  const toggleField = (key) => {
    setSelectedFields(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )
  }

  const fetchData = async () => {
    if (selectedFields.length === 0) return
    setLoading(true)
    try {
      const res = await client.get('/api/reports/users-export', {
        headers,
        params: {
          fields: selectedFields.join(','),
          status: userStatus,
          accountStatus,
          dateFrom,
          dateTo,
        }
      })
      if (res.data.msg === '201') {
        setData(res.data.data || [])
        setFetched(true)
      }
    } catch (e) {
      console.log('Export error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data.length) return
    const csv = Papa.unparse(data)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users-export-${moment().format('YYYY-MM-DD')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!data.length) return
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('User Marketing Export', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${moment().format('DD MMM YYYY HH:mm')}`, 14, 22)
    doc.text(`Total Records: ${data.length}`, 14, 28)
    doc.text(`Fields: ${selectedFields.join(', ')}`, 14, 34)

    autoTable(doc, {
      startY: 40,
      head: [Object.keys(data[0] || {})],
      body: data.map(row => Object.values(row)),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [76, 95, 213], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    })

    doc.save(`users-export-${moment().format('YYYY-MM-DD')}.pdf`)
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='User Marketing Export'
          subtitle='Export user contacts for email and SMS campaigns — formatted for Inboxvio, Mailchimp and other platforms'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Reports' },
            { label: 'User Export' },
          ]}
        />
      </Grid>

      {/* Quick Presets */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Quick Export Presets</Typography>}
            subheader='Click a preset to auto-select the right fields for your campaign type'
          />
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {PRESETS.map((p, i) => (
                <Box
                  key={i}
                  onClick={() => applyPreset(p.fields)}
                  sx={{
                    border: '2px solid',
                    borderColor: JSON.stringify(selectedFields.sort()) === JSON.stringify([...p.fields].sort())
                      ? p.color : 'divider',
                    borderRadius: 3, p: 2, cursor: 'pointer', minWidth: 180,
                    background: JSON.stringify(selectedFields.sort()) === JSON.stringify([...p.fields].sort())
                      ? `${p.color}12` : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: p.color, background: `${p.color}08` }
                  }}
                >
                  <Typography sx={{ fontSize: '24px', mb: 0.5 }}>{p.icon}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px', color: p.color }}>{p.label}</Typography>
                  <Typography variant='caption' color='text.secondary'>{p.desc}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Filters */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Select Fields</Typography>}
            subheader='Choose which user data fields to include in the export'
          />
          <CardContent>
            <FormGroup sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
              {FIELD_OPTIONS.map(f => (
                <FormControlLabel
                  key={f.key}
                  control={
                    <Checkbox
                      checked={selectedFields.includes(f.key)}
                      onChange={() => toggleField(f.key)}
                      sx={{ '&.Mui-checked': { color: '#4C5FD5' } }}
                    />
                  }
                  label={<Typography variant='body2' sx={{ fontWeight: 500 }}>{f.label}</Typography>}
                />
              ))}
            </FormGroup>
            {selectedFields.length === 0 && (
              <Alert severity='warning' sx={{ mt: 2, borderRadius: 2 }}>
                Please select at least one field to export
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Filter options */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Filter Users</Typography>}
            subheader='Narrow down which users to export'
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth size='small'>
                <InputLabel>KYC / Verification Status</InputLabel>
                <Select
                  value={userStatus}
                  label='KYC / Verification Status'
                  onChange={e => setUserStatus(e.target.value)}>
                  <MenuItem value='all'>All Users</MenuItem>
                  <MenuItem value='approved'>KYC Approved Only</MenuItem>
                  <MenuItem value='pending'>Pending Verification Only</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size='small'>
                <InputLabel>Account Status</InputLabel>
                <Select
                  value={accountStatus}
                  label='Account Status'
                  onChange={e => setAccountStatus(e.target.value)}>
                  <MenuItem value='all'>All Statuses</MenuItem>
                  <MenuItem value='Active'>Active Accounts</MenuItem>
                  <MenuItem value='Pending'>Pending Accounts</MenuItem>
                  <MenuItem value='Suspended'>Suspended Accounts</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth size='small' type='date' label='Date From'
                  InputLabelProps={{ shrink: true }}
                  value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                />
                <TextField
                  fullWidth size='small' type='date' label='Date To'
                  InputLabelProps={{ shrink: true }}
                  value={dateTo} onChange={e => setDateTo(e.target.value)}
                />
              </Box>

              <Alert severity='info' sx={{ borderRadius: 2 }}>
                <Typography variant='body2'>
                  <strong>Tip:</strong> For Inboxvio or Mailchimp, use the
                  <strong> "Email Only"</strong> or <strong>"Email + Name"</strong> preset
                  and export as CSV. The file uploads directly.
                </Typography>
              </Alert>

              <Button
                fullWidth variant='contained' size='large'
                startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <AccountGroup />}
                onClick={fetchData}
                disabled={loading || selectedFields.length === 0}
                sx={{ borderRadius: 2, fontWeight: 700, py: 1.5 }}>
                {loading ? 'Fetching Users...' : 'Fetch Users'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Results */}
      {fetched && (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 700 }}>Export Preview</Typography>
                  <Chip label={`${data.length.toLocaleString()} users`} color='primary' size='small' />
                  <Chip
                    label={`Fields: ${selectedFields.join(', ')}`}
                    variant='outlined' size='small' sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', gap: 2, pr: 2 }}>
                  <Button
                    variant='contained' color='success' size='small'
                    startIcon={<FileExcel />}
                    onClick={exportCSV}
                    disabled={!data.length}>
                    Export CSV
                  </Button>
                  <Button
                    variant='outlined' color='error' size='small'
                    startIcon={<FilePdfBox />}
                    onClick={exportPDF}
                    disabled={!data.length}>
                    Export PDF
                  </Button>
                </Box>
              }
            />
            <Divider />

            {data.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography>No users found for the selected filters</Typography>
              </Box>
            ) : (
              <>
                <Alert severity='success' sx={{ m: 2, borderRadius: 2 }}>
                  <Typography variant='body2'>
                    <strong>{data.length.toLocaleString()} users</strong> ready to export.
                    Click <strong>Export CSV</strong> to download — then upload directly to Inboxvio, Mailchimp or any email platform.
                  </Typography>
                </Alert>
                <TableContainer sx={{ maxHeight: 420 }}>
                  <Table stickyHeader size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        {columns.map(col => (
                          <TableCell key={col}>
                            <Typography variant='caption' sx={{ fontWeight: 700 }}>{col}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.slice(0, 50).map((row, i) => (
                        <TableRow key={i} hover>
                          <TableCell>
                            <Typography variant='caption' color='text.secondary'>{i + 1}</Typography>
                          </TableCell>
                          {columns.map(col => (
                            <TableCell key={col}>
                              <Typography variant='caption'>{row[col] || '—'}</Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {data.length > 50 && (
                  <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
                    <Typography variant='caption' color='text.secondary'>
                      Showing first 50 of {data.length.toLocaleString()} users. Export CSV to get all records.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Grid>
      )}
    </Grid>
  )
}