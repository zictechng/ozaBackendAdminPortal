import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import Link from 'next/link'
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
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Magnify, DotsVertical, Eye, AccountCancel, AccountCheck, Delete } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

// Action menu per row
const RowActions = ({ user, onAction }) => {
  const [anchor, setAnchor] = useState(null)
  const isSuspended = user.acct_status === 'Suspended' || user.acct_status === 'Deactivated'

  return (
    <>
      <Tooltip title='Actions'>
        <IconButton size='small' onClick={e => setAnchor(e.currentTarget)}>
          <DotsVertical fontSize='small' />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { minWidth: 180, boxShadow: 3 } }}>
        <MenuItem onClick={() => { setAnchor(null); onAction('view', user) }}>
          <Eye fontSize='small' sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant='body2'>View Details</Typography>
        </MenuItem>
        {!isSuspended && (
          <MenuItem onClick={() => { setAnchor(null); onAction('suspend', user) }}>
            <AccountCancel fontSize='small' sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography variant='body2' color='error.main'>Suspend Account</Typography>
          </MenuItem>
        )}
        {isSuspended && (
          <MenuItem onClick={() => { setAnchor(null); onAction('activate', user) }}>
            <AccountCheck fontSize='small' sx={{ mr: 1.5, color: 'success.main' }} />
            <Typography variant='body2' color='success.main'>Activate Account</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

const UserTableData = ({ userType = 'active' }) => {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  // Map userType to API endpoint
  const endpointMap = {
    active:    '/api/activeUser_details',
    pending:   '/api/pendingUser_details',
    suspended: '/api/suspendUser_details',
    deleted:   '/api/deletedUser_details',
  }

  const endpoint = endpointMap[userType] || endpointMap.active

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const pageLimit = 15

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `${endpoint}?pageNumber=${pageNum}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setUsers(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotal(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchUsers(1)

      return
    }
    setSearchLoading(true)
    try {
      const res = await client.post(
        '/api/searchUsers_database',
        { dataInfo: search.trim() },
        { headers }
      )
      if (res.data.msg === '201') {
        router.push(`/users/view-user/${res.data.feedAll._id}`)
      } else {
        toast.warning(res.data.message || 'No user found')
      }
    } catch (e) {
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

    const handleAction = (action, user) => {
    if (action === 'view') {
      router.push(`/users/view-user/${user._id}`)

      return
    }
    setConfirmAction({ action, user })
    setConfirmOpen(true)
  }

    const handleCommissionPause = async (action) => {
    setCommissionPauseLoading(true)
    try {
      const res = await client.post('/api/user/commission_pause', {
        user_id: userId,
        action,
        reason: commissionPauseReason,
      }, { headers })
      if (res?.data?.msg === '200' || res?.data?.msg === '201') {
        setCommissionPauseOpen(false)
        setCommissionPauseReason('')
        toast.success(
          `Commission earning ${action === 'pause' ? 'paused' : 'restored'} successfully`,
          { autoClose: 3000 }
        )
        setTimeout(() => fetchUser(), 500)
      } else {
        toast.error(res?.data?.message || 'Action failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setCommissionPauseLoading(false)
    }
  }

   
  const handleConfirmAction = async () => {
    if (!confirmAction) return
    const { action, user } = confirmAction
    setActionLoading(true)
    try {
      const actionStatus = action === 'suspend' ? 'Suspended' : 'Active'

      const res = await client.post('/api/user_accountAction/', {
        user_id: user._id,
        action_status: actionStatus,
      }, { headers })

      if (res?.data?.msg === '200') {
        toast.success(`User ${action === 'suspend' ? 'suspended' : 'activated'} successfully`)
        fetchUsers(page)
      } else {
        toast.error(res?.data?.message || 'Action failed. Please try again.')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActionLoading(false)
      setConfirmOpen(false)
      setConfirmAction(null)
    }
  }

  const handlePageChange = (e, value) => {
    setPage(value)
    fetchUsers(value)
  }

  useEffect(() => {
    fetchUsers(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} />
      <CardHeader
        title={
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Users
            {total > 0 && (
              <Typography component='span' variant='body2'
                sx={{ ml: 1.5, color: 'text.secondary', fontWeight: 400 }}>
                ({total.toLocaleString()} total)
              </Typography>
            )}
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size='small'
              placeholder='Search by email or tag ID'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                ),
                endAdornment: searchLoading ? (
                  <InputAdornment position='end'>
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
              }}
            />
            <Button
              variant='contained'
              size='small'
              onClick={handleSearch}
              disabled={searchLoading}>
              Search
            </Button>
          </Box>
        }
      />
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <EmptyState
          title='No Users Found'
          message={`No ${userType} users found in the system.`}
        />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Email</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Phone</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Tag ID</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Balance</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Joined</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={user.profile_photo}
                          sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', color: '#ffffff' }}>
                          {user.display_name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {user.display_name}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {user.user_role || 'User'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{user.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {user.tag_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        ₦{Number(user.amount || 0).toLocaleString()}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Bonus: ₦{Number(user.all_bonus_acct || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.acct_status?.toLowerCase()} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(user.createdOn).format('DD MMM, YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <RowActions user={user} onAction={handleAction} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              Page {page} of {totalPages}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color='primary'
              shape='rounded'
            />
          </Box>
        </>
      )}

          

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null) }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction?.action === 'suspend' ? 'Suspend Account' : 'Activate Account'}
        message={
          confirmAction?.action === 'suspend'
            ? `Are you sure you want to suspend ${confirmAction?.user?.display_name}? They will not be able to login.`
            : `Are you sure you want to activate ${confirmAction?.user?.display_name}?`
        }
        confirmLabel={confirmAction?.action === 'suspend' ? 'Suspend' : 'Activate'}
        confirmColor={confirmAction?.action === 'suspend' ? 'error' : 'success'}
      />
    </Card>
  )
}

export default UserTableData