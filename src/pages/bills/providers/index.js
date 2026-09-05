
import { useState, useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import { Plus, Sync, CheckCircle, CloseCircle, Pencil } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import EmptyState from 'src/@core/components/common/EmptyState'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const defaultForm = {
  name: '',
  slug: '',
  api_key: '',
  base_url: '',
  adapter_name: '',
  notes: '',
  supported_services: {
    airtime: false,
    data: false,
    electricity: false,
    tv_subscription: false,
    exam_cards: false,
  },
}

const BillsProviders = () => {
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')

  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState('')
  const [activating, setActivating] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const headers = { Authorization: 'Bearer ' + token }

  // Fetch providers
  const fetchProviders = async () => {
    setLoading(true)
    try {
      const res = await client.get('/api/provider/list', { headers })
      if (res.data.msg === '200') setProviders(res.data.providers || [])
    } catch (e) {
      toast.error('Failed to fetch providers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProviders() }, [])

  // Handle form change
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceToggle = (service) => {
    setForm(prev => ({
      ...prev,
      supported_services: {
        ...prev.supported_services,
        [service]: !prev.supported_services[service],
      }
    }))
  }

  // Add provider
  const handleAddProvider = async () => {
    if (!form.name || !form.slug || !form.api_key || !form.base_url || !form.adapter_name) {
      toast.warning('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      const res = await client.post('/api/provider/add', form, { headers })
      if (res.data.msg === '200') {
        toast.success('Provider added successfully')
        setAddOpen(false)
        setForm(defaultForm)
        fetchProviders()
      } else {
        toast.error(res.data.message || 'Failed to add provider')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // Activate provider
  const handleActivate = async (providerId) => {
    setActivating(providerId)
    try {
      const res = await client.post('/api/provider/activate', { provider_id: providerId }, { headers })
      if (res.data.msg === '200') {
        toast.success(`Provider activated. ${res.data.sync?.synced || 0} services synced.`)
        fetchProviders()
      } else {
        toast.error(res.data.message || 'Failed to activate')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActivating('')
    }
  }

  // Deactivate provider
  const handleDeactivate = async (providerId) => {
    setActivating(providerId)
    try {
      const res = await client.post('/api/provider/deactivate', { provider_id: providerId }, { headers })
      if (res.data.msg === '200') {
        toast.success('Provider deactivated')
        fetchProviders()
      } else {
        toast.error(res.data.message || 'Failed to deactivate')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActivating('')
    }
  }

  // Sync provider services
  const handleSync = async (providerId) => {
    setSyncing(providerId)
    try {
      const res = await client.post(`/api/provider/sync/${providerId}`, {}, { headers })
      if (res.data.msg === '200') {
        toast.success(res.data.message)
        fetchProviders()
      } else {
        toast.error(res.data.message || 'Sync failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSyncing('')
    }
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Bills Providers'
          subtitle='Manage payment providers for all bill services'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Bills Management' },
            { label: 'Providers' },
          ]}
          action={
            <Button
              variant='contained'
              startIcon={<Plus />}
              onClick={() => setAddOpen(true)}>
              Add Provider
            </Button>
          }
        />
      </Grid>

      {loading ? (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : providers.length === 0 ? (
        <Grid item xs={12}>
          <Card>
            <EmptyState
              title='No Providers Added'
              message='Add your first bill payment provider to get started.'
            />
          </Card>
        </Grid>
      ) : (
        providers.map((provider) => (
          <Grid item xs={12} md={6} lg={4} key={provider._id}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='h6' sx={{ fontWeight: 700 }}>
                      {provider.name}
                    </Typography>
                    <StatusBadge status={provider.status} />
                  </Box>
                }
                subheader={
                  <Typography variant='caption' color='text.secondary'>
                    Adapter: {provider.adapter_name}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
                  Base URL: {provider.base_url}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant='caption' sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Supported Services:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {Object.entries(provider.supported_services || {}).map(([key, val]) => (
                    val ? (
                      <StatusBadge key={key} status='active' customLabel={key.replace('_', ' ')} />
                    ) : null
                  ))}
                </Box>

                {provider.notes && (
                  <Alert severity='info' sx={{ mb: 2, py: 0 }}>
                    <Typography variant='caption'>{provider.notes}</Typography>
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {provider.status === 'inactive' ? (
                    <Button
                      size='small'
                      variant='contained'
                      color='success'
                      startIcon={activating === provider._id
                        ? <CircularProgress size={14} color='inherit' />
                        : <CheckCircle />}
                      disabled={activating === provider._id}
                      onClick={() => handleActivate(provider._id)}>
                      Activate
                    </Button>
                  ) : (
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      startIcon={activating === provider._id
                        ? <CircularProgress size={14} color='inherit' />
                        : <CloseCircle />}
                      disabled={activating === provider._id}
                      onClick={() => handleDeactivate(provider._id)}>
                      Deactivate
                    </Button>
                  )}

                  <Button
                    size='small'
                    variant='outlined'
                    startIcon={syncing === provider._id
                      ? <CircularProgress size={14} color='inherit' />
                      : <Sync />}
                    disabled={syncing === provider._id || provider.status !== 'active'}
                    onClick={() => handleSync(provider._id)}>
                    Sync Services
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}

      {/* Add Provider Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Provider</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Provider Name *'
                value={form.name}
                onChange={e => handleFormChange('name', e.target.value)}
                placeholder='e.g. VTUGate'
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Slug *'
                value={form.slug}
                onChange={e => handleFormChange('slug', e.target.value.toLowerCase())}
                placeholder='e.g. vtugate'
                size='small'
                helperText='Lowercase, no spaces'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='API Key *'
                value={form.api_key}
                onChange={e => handleFormChange('api_key', e.target.value)}
                placeholder='Enter provider API key'
                size='small'
                type='password'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Base URL *'
                value={form.base_url}
                onChange={e => handleFormChange('base_url', e.target.value)}
                placeholder='e.g. https://api.vtugate.com'
                size='small'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Adapter Name *'
                value={form.adapter_name}
                onChange={e => handleFormChange('adapter_name', e.target.value.toLowerCase())}
                placeholder='e.g. vtugate'
                size='small'
                helperText='Must match adapter file name in services/adapters/'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Notes'
                value={form.notes}
                onChange={e => handleFormChange('notes', e.target.value)}
                placeholder='Optional notes about this provider'
                size='small'
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                Supported Services
              </Typography>
              {Object.keys(defaultForm.supported_services).map(service => (
                <FormControlLabel
                  key={service}
                  control={
                    <Switch
                      size='small'
                      checked={form.supported_services[service]}
                      onChange={() => handleServiceToggle(service)}
                    />
                  }
                  label={service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  sx={{ mr: 3 }}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} variant='outlined' color='inherit' disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProvider}
            variant='contained'
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}>
            {saving ? 'Saving...' : 'Add Provider'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default BillsProviders