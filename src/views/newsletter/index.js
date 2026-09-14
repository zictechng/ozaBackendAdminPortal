
import { useState, useEffect } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { Magnify, EmailOutline, FileExcel, FilePdfBox } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import EmptyState from 'src/@core/components/common/EmptyState'
import client from 'src/@core/context/client'

const NewsletterTable = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const pageLimit = 20

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/all_newsletter_subscribers?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setData(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalRecord || 0)
      }
    } catch (e) {
      toast.error('Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(1) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

      const filtered = data.filter(s =>
    s.user_email?.toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    if (!data.length) return

    const rows = data.map(s => ({
      'Email Address': s.user_email || '',
      'Date Subscribed': s.createdOn ? moment(s.createdOn).format('YYYY-MM-DD') : '',
    }))
    const csv = Papa.unparse(rows)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-subscribers-${moment().format('YYYY-MM-DD')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportEmailsOnly = () => {
    if (!data.length) return
    const rows = data.map(s => ({ 'Email Address': s.user_email || '' }))
    const csv = Papa.unparse(rows)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-emails-only-${moment().format('YYYY-MM-DD')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!data.length) return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Newsletter Subscribers', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${moment().format('DD MMM YYYY HH:mm')}`, 14, 22)
    doc.text(`Total Subscribers: ${data.length}`, 14, 28)
    autoTable(doc, {
      startY: 35,
      head: [['#', 'Email Address', 'Date Subscribed']],
      body: data.map((s, i) => [
        i + 1,
        s.user_email || '',
        s.createdOn ? moment(s.createdOn).format('DD MMM YYYY') : '',
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [76, 95, 213], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    })
    doc.save(`newsletter-subscribers-${moment().format('YYYY-MM-DD')}.pdf`)
  }

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Newsletter Subscribers
            </Typography>
            <Chip
              label={`${totalCount.toLocaleString()} total`}
              size='small'
              color='primary'
              variant='outlined'
              sx={{ fontWeight: 600 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField
              size='small'
              placeholder='Search by email...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: 240 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                ),
              }}
            />
            <Button
                variant='outlined' color='success' size='small'
                startIcon={<FileExcel />}
                onClick={exportEmailsOnly}
                disabled={!data.length}>
                Emails Only CSV
              </Button>
              <Button
                variant='outlined' color='info' size='small'
                startIcon={<FileExcel />}
                onClick={exportCSV}
                disabled={!data.length}>
                Full Export CSV
              </Button>
              <Button
                variant='outlined' color='error' size='small'
                startIcon={<FilePdfBox />}
                onClick={exportPDF}
                disabled={!data.length}>
                PDF
              </Button>
              <Button variant='contained' size='small' onClick={() => fetchData(1)}>
                Refresh
              </Button>
          </Box>
        }
      />
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          title='No Subscribers'
          message='No newsletter subscribers found.'
        />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell>#</TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      Email Address
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      Date Subscribed
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row, i) => (
                  <TableRow key={row._id} hover>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {(pageNumber - 1) * pageLimit + i + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: '50%',
                          bgcolor: 'primary.main', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <EmailOutline sx={{ color: 'white', fontSize: 18 }} />
                        </Box>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {row.user_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(row.createdOn).format('DD MMM YYYY, hh:mm A')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label='Active'
                        size='small'
                        color='success'
                        variant='outlined'
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', px: 4, py: 3,
          }}>
            <Typography variant='body2' color='text.secondary'>
              Page {pageNumber} of {totalPages} · {totalCount.toLocaleString()} subscribers
            </Typography>
            <Pagination
              count={totalPages}
              page={pageNumber}
              onChange={(_, v) => { setPageNumber(v); fetchData(v) }}
              color='primary'
              shape='rounded'
            />
          </Box>
        </>
      )}
    </Card>
  )
}

export default NewsletterTable
