import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { Eye } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import EmptyState from 'src/@core/components/common/EmptyState'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import client from 'src/@core/context/client'

const ticketStatusColor = (status) => {
  const s = status?.toLowerCase()
  if (s === 'completed' || s === 'closed') return 'success'
  if (s === 'replied' || s === 'ongoing') return 'warning'

  return 'default'
}

const AllMessagesTable = () => {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageLimit = 15

  const fetchTickets = async (page = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `/api/allUser_messages?pageNumber=${page}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setTickets(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotalCount(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) { fetchTickets(1); 

      return 
    }
    setSearchLoading(true)
    try {
      const res = await client.post(
        '/api/searchTicket_database',
        { dataInfo: searchInput.trim() },
        { headers }
      )
      if (res.data.msg === '201') {
        router.push(`/messages/${res.data.feedAll._id}`)
        setSearchInput('')
      } else {
        toast.warning(res.data.message || 'No ticket found')
      }
    } catch (e) {
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  const handlePageChange = (_, value) => {
    setPageNumber(value)
    fetchTickets(value)
  }

  useEffect(() => {
    fetchTickets(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const isClosed = (status) =>
    status === 'Completed' || status === 'Closed'

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Support Tickets</Typography>
            {totalCount > 0 && (
              <Chip
                label={`${totalCount.toLocaleString()} tickets`}
                size='small'
                color='primary'
                variant='outlined'
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
            <TextField
              size='small'
              placeholder='Search by email or ticket ID'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' color='action' />
                  </InputAdornment>
                ),
                endAdornment: searchLoading
                  ? <InputAdornment position='end'><CircularProgress size={16} /></InputAdornment>
                  : null,
              }}
            />
            <Button
              variant='contained'
              size='small'
              onClick={handleSearch}
              disabled={searchLoading}
              sx={{ borderRadius: 2, px: 3 }}>
              Search
            </Button>
            <Tooltip title='Refresh'>
              <IconButton size='small' onClick={() => fetchTickets(pageNumber)} disabled={loading}>
                <RefreshIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Divider />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {!loading && tickets.length === 0 && (
        <EmptyState title='No Support Tickets' message='No tickets have been submitted yet.' />
      )}

      {!loading && tickets.length > 0 && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['Sender / Email', 'Subject', 'Type', 'Ticket ID', 'Status', 'Date', 'Action'].map(col => (
                    <TableCell key={col}>
                      <Typography variant='body2' sx={{ fontWeight: 700 }}>{col}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map(row => (
                  <TableRow key={row._id} hover sx={{ '&:last-of-type td': { border: 0 } }}>
                                        <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                          {getInitials(row.sender_name || row.user?.display_name)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {row.sender_name || row.user?.display_name || '—'}
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.72rem' }}>
                            {row.email || row.user?.email || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.subject}>
                        <Typography variant='body2' sx={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.subject || '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.ticket_type || 'General'} size='small' variant='outlined' sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                        #{row.tick_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.ticket_closed || 'Opened'}
                        size='small'
                        color={ticketStatusColor(row.ticket_closed)}
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(row.createdOn).format('DD MMM, YYYY')}
                      </Typography>
                      <Typography variant='body2' color='text.disabled'>
                        {moment(row.createdOn).format('hh:mm A')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title='View & Reply'>
                        <Button
                          size='small'
                          variant='outlined'
                          startIcon={<Eye fontSize='small' />}
                          onClick={() => router.push(`/messages/${row._id}`)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                          View
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider',
          }}>
            <Typography variant='body2' color='text.secondary'>
              Page <strong>{pageNumber}</strong> of <strong>{totalPages}</strong>
              {' '}· {totalCount.toLocaleString()} total tickets
            </Typography>
            <Pagination
              count={totalPages}
              page={pageNumber}
              onChange={handlePageChange}
              color='primary'
              shape='rounded'
              size='small'
            />
          </Box>
        </>
      )}

    </Card>
  )
}

export default AllMessagesTable