
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
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'
import { FileExcel, FilePdf } from 'mdi-material-ui'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'

import PageHeader from 'src/@core/components/common/PageHeader'
import ReportFilters from 'src/@core/components/reports/ReportFilters'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const formatNaira = v => '₦' + Number(v || 0).toLocaleString()

export default function ExportReport() {
  const router = useRouter()
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [fetched, setFetched] = useState(false)
  const [currentFilters, setCurrentFilters] = useState({})

  useEffect(() => {
    if (!token) { router.replace('/pages/login'); 
        
        return }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async (f) => {
    setLoading(true)
    setCurrentFilters(f)
    try {
      const res = await client.get('/api/reports/export', {
        headers,
        params: {
          dateFrom: f.dateFrom,
          dateTo: f.dateTo,
          type: f.type,
          status: f.status,
          category: f.category,
        }
      })
      if (res.data.msg === '201') {
        setData(res.data.data || [])
        setTotal(res.data.total || 0)
        setFetched(true)
      }
    } catch (e) {
      console.log('Export error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (f) => fetchData(f)

  const exportCSV = () => {
    if (!data.length) return
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-export-${moment().format('YYYY-MM-DD')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!data.length) return
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('Transaction Report', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${moment().format('DD MMM YYYY HH:mm')}`, 14, 22)
    doc.text(`Period: ${currentFilters.dateFrom} to ${currentFilters.dateTo}`, 14, 28)
    doc.text(`Total Records: ${total}`, 14, 34)

    autoTable(doc, {
      startY: 40,
      head: [['Name', 'Tag ID', 'TID', 'Amount', 'Type', 'Category', 'Status', 'Date']],
      body: data.map(tx => [
        tx['Name'],
        tx['Account/Tag'],
        tx['Transaction ID'],
        `₦${Number(tx['Amount (NGN)']).toLocaleString()}`,
        tx['Type'],
        tx['Category'],
        tx['Status'],
        tx['Date'],
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [76, 95, 213], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    })

    doc.save(`transactions-report-${moment().format('YYYY-MM-DD')}.pdf`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Export Data'
          subtitle='Filter, preview and export transaction data to CSV or PDF'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Reports' },
            { label: 'Export' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <ReportFilters
          onFilter={handleFilter}
          showPeriod={false}
          showType
          showStatus
          showCategory
          loading={loading}
        />
      </Grid>

      {fetched && (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 700 }}>
                    Transaction Data
                  </Typography>
                  <Chip label={`${total} records`} size='small' color='primary' />
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant='outlined' color='success' size='small'
                    startIcon={<FileExcel />}
                    onClick={exportCSV}
                    disabled={!data.length}>
                    Export CSV
                  </Button>
                  <Button
                    variant='outlined' color='error' size='small'
                    startIcon={<FilePdf />}
                    onClick={exportPDF}
                    disabled={!data.length}>
                    Export PDF
                  </Button>
                </Box>
              }
            />
            <Divider />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={36} />
              </Box>
            ) : data.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No transactions found for selected filters</Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      {['Name', 'Tag ID', 'Amount', 'Type', 'Category', 'Status', 'Reference', 'Date'].map(h => (
                        <TableCell key={h}>
                          <Typography variant='caption' sx={{ fontWeight: 700 }}>{h}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 100).map((tx, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant='caption' sx={{ fontWeight: 600 }}>{tx['Name']}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='caption' sx={{ color: 'text.secondary' }}>{tx['Account/Tag']}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='caption' sx={{
                            fontWeight: 700,
                            color: tx['Type'] === 'Credit' ? 'success.main' : 'error.main'
                          }}>
                            {formatNaira(tx['Amount (NGN)'])}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={tx['Type']} size='small'
                            color={tx['Type'] === 'Credit' ? 'success' : 'error'}
                            sx={{ fontSize: '0.65rem', height: 18 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant='caption'>{tx['Category']}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tx['Status']?.toLowerCase()} />
                        </TableCell>
                        <TableCell>
                          <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {tx['Reference']}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='caption' sx={{ color: 'text.secondary' }}>{tx['Date']}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {data.length > 100 && (
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
                <Typography variant='caption' color='text.secondary'>
                  Showing first 100 of {total} records. Export CSV/PDF to get all records.
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      )}
    </Grid>
  )
}
