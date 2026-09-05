import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import moment from 'moment'
import {
  ArrowLeft, AccountOutline, LockOutline, InformationOutline,
  AccountCheck, AccountCancel, AccountRemove, ShieldAccount,
  Close, Eye, EyeOff,
} from 'mdi-material-ui'
import Block from '@mui/icons-material/Block'
import CheckCircle from '@mui/icons-material/CheckCircle'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/material/styles'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import client from 'src/@core/context/client'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
}))

const InfoRow = ({ label, value }) => (
  <Box sx={{
    display: 'flex', justifyContent: 'space-between',
    py: 1.5, borderBottom: '1px solid', borderColor: 'divider'
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>
      {value || 'N/A'}
    </Typography>
  </Box>
)

// Account Action Dialog
const AccountActionDialog = ({ open, onClose, onAction, loading, title, options }) => (
  <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
    <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
    <Divider />
    <DialogContent>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Select an action to perform on this account:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {options.map((opt) => (
          <Button
            key={opt.value}
            fullWidth
            variant='outlined'
            color={opt.color || 'primary'}
            startIcon={opt.icon}
            disabled={loading}
            onClick={() => onAction(opt.value)}>
            {opt.label}
          </Button>
        ))}
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
    </DialogActions>
  </Dialog>
)

const ViewUserDetails = () => {
  const router = useRouter()
  const { userId } = router.query
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [userData, setUserData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(false)
  const [txPage, setTxPage] = useState(1)
  const [txTotalPages, setTxTotalPages] = useState(1)
  const [txTotal, setTxTotal] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [tab, setTab] = useState(0)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [showAlert, setShowAlert] = useState(true)

  // Dialog states
  const [actionDialog, setActionDialog] = useState(null)

  // Password state
  const [passwords, setPasswords] = useState({
    newPassword: '', confirmPassword: '',
    showNew: false, showConfirm: false,
  })
  const [pwdLoading, setPwdLoading] = useState(false)

  const fetchUser = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await client.get(`/api/adminGetUser_details/${userId}`, { headers })
      if (res.data.msg === '201') {
        setUserData(res.data.feedAll)
        if (res.data.feedAll?.profile_photo) setImgSrc(res.data.feedAll.profile_photo)
      }
    } catch (e) {
      toast.error('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }


    const fetchTransactions = async (pageNum = 1) => {
    if (!userId) return
    setTxLoading(true)
    try {
      const res = await client.get(
        `/api/all_historyMobile/${userId}?page=${pageNum}`,
        { headers }
      )
      
      // API returns array on success, object with status on error/empty
      if (Array.isArray(res.data)) {
        setTransactions(res.data)
        setTxTotal(res.data.length || 0)
      } else {
        setTransactions([])
        setTxTotal(0)
      }
    } catch (e) {
      console.log('Tx error:', e.message)
      setTransactions([])
    } finally {
      setTxLoading(false)
    }
  }

  useEffect(() => {
    if (userId) { fetchUser(); fetchTransactions() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const callAccountApi = async (endpoint, payload) => {
    setProcessing(true)
    try {
      const res = await client.post(endpoint, { user_id: userId, ...payload }, { headers })
      if (res.data.msg === '201' || res.data.msg === '200') {
        toast.success('Account updated successfully')
        fetchUser()
      } else {
        toast.error(res.data.message || 'Action failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setProcessing(false)
      setActionDialog(null)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      toast.warning('Passwords do not match')
      
      return
    }
    setPwdLoading(true)
    try {
      const res = await client.post('/api/adminUserPassword_update', {
        user_id: userId,
        new_password: passwords.newPassword,
      }, { headers })
      if (res.data.msg === '200' || res.data.msg === '201') {
        toast.success('Password updated successfully')
        setPasswords({ newPassword: '', confirmPassword: '', showNew: false, showConfirm: false })
      } else {
        toast.error(res.data.message || 'Failed to update password')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setPwdLoading(false)
    }
  }

  const isNotVerified = userData && (
    userData.reg_stage1 !== 'Yes' ||
    userData.reg_stage2 !== 'Yes' ||
    userData.reg_stage3 !== 'Yes' ||
    userData.reg_stage4 !== 'Yes'
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (!userData) {
    return <Alert severity='error' sx={{ m: 6 }}>User not found.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='User Details'
          subtitle={`Managing account for ${userData.display_name}`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Active Users', href: '/users' },
            { label: userData.display_name },
          ]}
          action={
            <Button variant='outlined' startIcon={<ArrowLeft />} onClick={() => router.back()}>
              Back
            </Button>
          }
        />
      </Grid>

      {/* Left Column — Profile Summary */}
      <Grid item xs={12} md={4}>

        {/* Profile Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Avatar
              src={userData.profile_photo}
              sx={{ width: 90, height: 90, mx: 'auto', mb: 2, fontSize: '2rem', bgcolor: 'primary.main' }}>
              {userData.display_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>{userData.display_name}</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>{userData.email}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <StatusBadge status={userData.acct_status?.toLowerCase()} />
              <Chip label={`Tag: ${userData.tag_id}`} size='small' variant='outlined' />
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₦{Number(userData.amount || 0).toLocaleString()}
                </Typography>
                <Typography variant='body2' color='text.secondary'>Main Wallet</Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: 'success.main' }}>
                  ₦{Number(userData.all_bonus_acct || 0).toLocaleString()}
                </Typography>
                <Typography variant='body2' color='text.secondary'>Bonus</Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {Number(userData.coins || 0).toLocaleString()}
                </Typography>
                <Typography variant='body2' color='text.secondary'>Coins</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Quick Actions</Typography>} />
          <Divider />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth variant='outlined' color='error'
              startIcon={<Block />}
              disabled={userData.acct_status === 'Deleted' || processing}
              onClick={() => setActionDialog('status')}>
              Account Status
            </Button>
            <Button
              fullWidth variant='outlined' color='warning'
              startIcon={<AccountCancel />}
              disabled={userData.acct_status === 'Deleted' || processing}
              onClick={() => setActionDialog('state')}>
              Account State
            </Button>
            <Button
              fullWidth variant='outlined' color='success'
              startIcon={<ShieldAccount />}
              disabled={userData.acct_status === 'Deleted' || processing}
              onClick={() => setActionDialog('approval')}>
              Approval Action
            </Button>
          </CardContent>
        </Card>

        {/* KYC Status Card */}
        <Card>
          <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>KYC Verification</Typography>} />
          <Divider />
          <CardContent>
            {[
              { label: 'Account Created', done: userData.reg_stage1 === 'Yes' },
              { label: 'Profile Completed', done: userData.reg_stage2 === 'Yes' },
              { label: 'Photo Uploaded', done: userData.reg_stage3 === 'Yes' },
              { label: 'Document Uploaded', done: userData.reg_stage4 === 'Yes' },
              { label: 'KYC Approved', done: userData.acct_approved_status === 'Approved' },
            ].map((step, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                <Typography variant='body2'>{step.label}</Typography>
                <StatusBadge status={step.done ? 'approved' : 'pending'} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Right Column — Tabs */}
      <Grid item xs={12} md={8}>
        <Card>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3 }}>
            <Tab icon={<AccountOutline fontSize='small' />} iconPosition='start' label='Profile' />
            <Tab icon={<LockOutline fontSize='small' />} iconPosition='start' label='Security' />
            <Tab icon={<InformationOutline fontSize='small' />} iconPosition='start' label='Other Info' />
            <Tab iconPosition='start' label='Transactions' />
          </Tabs>

          {/* Profile Tab */}
          {tab === 0 && (
            <CardContent>
              {isNotVerified && showAlert && (
                <Alert
                  severity='warning'
                  sx={{ mb: 3 }}
                  action={
                    <IconButton size='small' onClick={() => setShowAlert(false)}>
                      <Close fontSize='inherit' />
                    </IconButton>
                  }>
                  <AlertTitle>Account not fully verified</AlertTitle>
                  <Typography variant='body2'>
                    This user has not completed all verification steps.
                  </Typography>
                </Alert>
              )}

              {/* Photo Upload */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}>
                <ImgStyled
                  src={userData.profile_photo || imgSrc}
                  alt='Profile'
                  onError={() => setImgSrc('/images/avatars/1.png')}
                />
                <Box>
                  <Button component='label' variant='contained' size='small' sx={{ mr: 2 }}>
                    Upload New Photo
                    <input hidden type='file' accept='image/png, image/jpeg'
                      onChange={e => {
                        const reader = new FileReader()
                        if (e.target.files?.[0]) {
                          reader.onload = () => setImgSrc(reader.result)
                          reader.readAsDataURL(e.target.files[0])
                        }
                      }} />
                  </Button>
                  <Button variant='outlined' size='small' color='error'
                    onClick={() => setImgSrc('/images/avatars/1.png')}>
                    Reset
                  </Button>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                    Allowed PNG or JPEG. Max size 800K.
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Display Name' defaultValue={userData.display_name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Phone' defaultValue={userData.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Email' type='email' defaultValue={userData.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Tag ID' defaultValue={userData.tag_id} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Role</InputLabel>
                    <Select label='Role' defaultValue={userData.user_role || 'User'}>
                      <MenuItem value='User'>User</MenuItem>
                      <MenuItem value='Admin'>Admin</MenuItem>
                      <MenuItem value='Promoter'>Promoter</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Status</InputLabel>
                    <Select label='Status' defaultValue={userData.acct_status || 'Active'}>
                      <MenuItem value='Active'>Active</MenuItem>
                      <MenuItem value='Pending'>Pending</MenuItem>
                      <MenuItem value='Suspended'>Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Date of Birth' defaultValue={userData.dob} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Gender' defaultValue={userData.gender} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='State' defaultValue={userData.state} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Country' defaultValue={userData.country} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size='small' label='Address' multiline rows={2} defaultValue={userData.address} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Account Balances</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Main Balance (₦)' defaultValue={userData.amount} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Bonus Balance (₦)' defaultValue={userData.all_bonus_acct} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Approved Status' defaultValue={userData.acct_approved_status} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Account Type' defaultValue={userData.acct_type} InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>
            </CardContent>
          )}

          {/* Security Tab */}
          {tab === 1 && (
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>Change User Password</Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Update the password for this user account. They will need to use the new password to login.
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size='small' label='New Password'
                    type={passwords.showNew ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                    InputProps={{
                      endAdornment: (
                        <IconButton size='small' onClick={() => setPasswords(p => ({ ...p, showNew: !p.showNew }))}>
                          {passwords.showNew ? <EyeOff fontSize='small' /> : <Eye fontSize='small' />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size='small' label='Confirm Password'
                    type={passwords.showConfirm ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                    InputProps={{
                      endAdornment: (
                        <IconButton size='small' onClick={() => setPasswords(p => ({ ...p, showConfirm: !p.showConfirm }))}>
                          {passwords.showConfirm ? <EyeOff fontSize='small' /> : <Eye fontSize='small' />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    onClick={handlePasswordUpdate}
                    disabled={pwdLoading}
                    startIcon={pwdLoading ? <CircularProgress size={16} color='inherit' /> : null}>
                    {pwdLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Security Settings</Typography>
              <InfoRow label='2FA Active' value={userData.activate_2fa_login ? 'Enabled' : 'Disabled'} />
              <InfoRow label='Email Notifications' value={userData.receive_email_notification ? 'Enabled' : 'Disabled'} />
              <InfoRow label='App Messages' value={userData.receive_app_message ? 'Enabled' : 'Disabled'} />
              <InfoRow label='Account OTP' value={userData.reg_otp ? '••••••' : 'N/A'} />
            </CardContent>
          )}

          {/* Other Info Tab */}
          {tab === 2 && (
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Bank Details</Typography>
              <InfoRow label='Bank Name' value={userData.bank_name} />
              <InfoRow label='Account Name' value={userData.acct_name} />
              <InfoRow label='Account Number' value={userData.acct_number} />

              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Digital Wallets</Typography>
              <InfoRow label='PayPal' value={userData.paypal_address} />
              <InfoRow label='Payoneer' value={userData.payoneer_address} />
              <InfoRow label='Bitcoin' value={userData.btc_address} />

              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Referral & Promoter</Typography>
              <InfoRow label='Referred By' value={userData.share_code} />
              <InfoRow label='Promoter Tag' value={userData.promoter_tag_id || 'None'} />
              <InfoRow label='Is Promoter' value={userData.business_promoter ? 'Yes' : 'No'} />

              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>Account Dates</Typography>
              <InfoRow label='Registered' value={moment(userData.createdOn).format('DD MMM YYYY, hh:mm A')} />
              <InfoRow label='Last Updated' value={userData.updatedAt ? moment(userData.updatedAt).format('DD MMM YYYY, hh:mm A') : 'N/A'} />
            </CardContent>
          )}

                    {/* Transactions Tab */}
          {tab === 3 && (
            <CardContent sx={{ p: 0 }}>
              {txLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : transactions.length === 0 ? (
                <EmptyState title='No Transactions' message='This user has no recent transactions.' />
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                          <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Description</Typography></TableCell>
                          <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Amount</Typography></TableCell>
                          <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Type</Typography></TableCell>
                          <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                          <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Date</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map(tx => (
                          <TableRow key={tx._id} hover>
                            <TableCell>
                              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                {tx.transac_nature || tx.tran_desc || 'Transaction'}
                              </Typography>
                              <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
                                {tx.tid}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2' sx={{
                                fontWeight: 700,
                                color: tx.tran_type === 'Credit' ? 'success.main' : 'error.main'
                              }}>
                                ₦{Number(tx.amount || 0).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2'>{tx.tran_type}</Typography>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={tx.transaction_status?.toLowerCase()} />
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2' color='text.secondary'>
                                {moment(tx.creditOn).format('DD MMM, YYYY')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
                    <Typography variant='body2' color='text.secondary'>
                      Page {txPage} — {transactions.length} records shown
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size='small'
                        variant='outlined'
                        disabled={txPage === 1 || txLoading}
                        onClick={() => {
                          const prev = txPage - 1
                          setTxPage(prev)
                          fetchTransactions(prev)
                        }}>
                        Previous
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        disabled={transactions.length < 10 || txLoading}
                        onClick={() => {
                          const next = txPage + 1
                          setTxPage(next)
                          fetchTransactions(next)
                        }}>
                        Next
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </Grid>

      {/* Account Status Dialog */}
      <AccountActionDialog
        open={actionDialog === 'status'}
        onClose={() => setActionDialog(null)}
        loading={processing}
        title='Account Status Action'
        onAction={v => callAccountApi('/api/user_accountAction/', { action_status: v })}
        options={[
          { value: 'Active', label: 'Set Active', color: 'success', icon: <AccountCheck /> },
          { value: 'Suspended', label: 'Suspend Account', color: 'warning', icon: <AccountCancel /> },
          { value: 'Blocked', label: 'Block Account', color: 'error', icon: <Block /> },
          { value: 'Deleted', label: 'Delete Account', color: 'error', icon: <DeleteIcon /> },
        ]}
      />

      {/* Account State Dialog */}
      <AccountActionDialog
        open={actionDialog === 'state'}
        onClose={() => setActionDialog(null)}
        loading={processing}
        title='Account State Action'
        onAction={v => callAccountApi('/api/user_accountStateAction', { action_status: v })}
        options={[
          { value: 'Active', label: 'Set Active', color: 'success', icon: <CheckCircle /> },
          { value: 'Blocked', label: 'Block Account', color: 'error', icon: <Block /> },
        ]}
      />

      {/* Approval Dialog */}
      <AccountActionDialog
        open={actionDialog === 'approval'}
        onClose={() => setActionDialog(null)}
        loading={processing}
        title='Account Approval Action'
        onAction={v => callAccountApi('/api/user_ApproveAccountAction', { action_status: v })}
        options={[
          { value: 'Approved', label: 'Approve Account', color: 'success', icon: <CheckCircle /> },
          { value: 'Suspended', label: 'Suspend Approval', color: 'warning', icon: <ErrorOutline /> },
          { value: 'Rejected', label: 'Reject Account', color: 'error', icon: <Block /> },
        ]}
      />
    </Grid>
  )
}

export default ViewUserDetails