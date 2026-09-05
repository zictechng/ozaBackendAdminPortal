import { useState, useEffect } from 'react'
import moment from 'moment'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Pagination from '@mui/material/Pagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { BellOutline } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import EmptyState from 'src/@core/components/common/EmptyState'
import client from 'src/@core/context/client'

const Notifications = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }
  const userInfo = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo') || '{}') : {}
  const userId = userInfo?.userData?._id || userInfo?._id

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const pageLimit = 20

  const fetchNotifications = async (pageNum = 1) => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await client.get(
        `/api/user_notification/${userId}?page=${pageNum}&pageSize=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '200' || res.data.data) {
        setNotifications(res.data.data || [])
        setTotalPages(res.data.totalPages || 1)
        setTotal(res.data.data?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
    fetchNotifications(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handlePageChange = (_, value) => { setPage(value); fetchNotifications(value) }
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  const filtered = notifications.filter(n =>
    !search || n.alert_nature?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Notifications'
          subtitle='View all system notifications and alerts'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Support' },
            { label: 'Notifications' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>All Notifications</Typography>
                {total > 0 && (
                  <Chip label={`${total} notifications`} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
                )}
              </Box>
            }
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
                <TextField size='small' placeholder='Search notifications...'
                  value={search} onChange={e => setSearch(e.target.value)}
                  sx={{ minWidth: 260 }}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'><SearchIcon fontSize='small' color='action' /></InputAdornment>,
                  }}
                />
                <Tooltip title='Refresh'>
                  <IconButton size='small' onClick={() => fetchNotifications(page)} disabled={loading}>
                    <RefreshIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
          <Divider />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={40} />
            </Box>
          ) : filtered.length === 0 ? (
            <EmptyState
              title='No Notifications'
              message='No notifications found.'
              icon={<BellOutline sx={{ fontSize: 64 }} />}
            />
          ) : (
            <CardContent sx={{ p: 0 }}>
              {filtered.map((notif, i) => (
                <Box key={notif._id || i}>
                  <Box sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 2, px: 4, py: 2.5,
                    backgroundColor: notif.alert_status === 1 ? 'action.hover' : 'transparent',
                    '&:hover': { backgroundColor: 'action.hover' },
                    transition: 'background 0.2s',
                  }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', flexShrink: 0, fontWeight: 700, color: '#ffffff' }}>
                      {getInitials(notif.alert_name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {notif.alert_name || 'System'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {notif.alert_status === 1 && (
                            <Chip label='New' size='small' color='primary' sx={{ fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
                          )}
                          <Typography variant='body2' color='text.disabled' sx={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                            {moment(notif.alert_date).fromNow()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                        {notif.alert_nature}
                      </Typography>
                      <Typography variant='body2' color='text.disabled' sx={{ fontSize: '0.72rem', mt: 0.5 }}>
                        {moment(notif.alert_date).format('DD MMM YYYY, hh:mm A')}
                      </Typography>
                    </Box>
                  </Box>
                  {i < filtered.length - 1 && <Divider />}
                </Box>
              ))}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </Typography>
                  <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' shape='rounded' size='small' />
                </Box>
              )}
            </CardContent>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default Notifications