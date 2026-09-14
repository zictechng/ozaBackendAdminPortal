
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
import { Magnify, EmailOutline } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
