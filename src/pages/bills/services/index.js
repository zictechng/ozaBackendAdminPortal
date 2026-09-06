
import { useState, useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { Cellphone, AccessPoint, Flash, Television, School, Cog } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import StatusBadge from 'src/@core/components/common/StatusBadge'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const SERVICE_META = {
  airtime:        { label: 'Airtime',         icon: <Cellphone />,   color: '#4C5FD5' },
  data:           { label: 'Mobile Data',     icon: <AccessPoint />, color: '#10B981' },
  electricity:    { label: 'Electricity',     icon: <Flash />,       color: '#F59E0B' },
  tv_subscription:{ label: 'TV Subscription', icon: <Television />,  color: '#8B5CF6' },
  exam_cards:     { label: 'Exam Cards',      icon: <School />,      color: '#EC4899' },
}

const STATUS_OPTIONS = ['active', 'paused', 'hidden']

const BillsServiceConfig = () => {
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [configs, setConfigs] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingChange, setPendingChange] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [configRes, providerRes] = await Promise.all([
        client.get('/api/provider/service-configs', { headers }),
        client.get('/api/provider/list', { headers }),
      ])
      if (configRes.data.msg === '200') setConfigs(configRes.data.configs || [])
      if (providerRes.data.msg === '200') setProviders(providerRes.data.providers || [])
    } catch (e) {
      toast.error('Failed to load configuration')
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    const handleProviderChange = (serviceType, providerId) => {
    const providerName = providers.find(p => p._id === providerId)?.name || 'None'
    setPendingChange({
      type: 'provider',
      serviceType,
      providerId,
      title: 'Change Service Provider',
      message: `Are you sure you want to set ${serviceType.replace('_', ' ')} provider to ${providerName}? This will affect all new transactions for this service.`,
    })
    setConfirmOpen(true)
  }

  const handleStatusChange = (serviceType, status) => {
    setPendingChange({
      type: 'status',
      serviceType,
      status,
      title: 'Change Service Status',
      message: `Are you sure you want to set ${serviceType.replace('_', ' ')} to ${status}? ${status === 'paused' || status === 'hidden' ? 'Users will not be able to use this service.' : 'Users will be able to use this service.'}`,
    })
    setConfirmOpen(true)
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return
    const { type, serviceType, providerId, status } = pendingChange
    setSaving(serviceType)
    try {
      let res
      if (type === 'provider') {
        res = await client.post('/api/provider/set-service', {
          service_type: serviceType,
          provider_id: providerId || null,
        }, { headers })
      } else {
        res = await client.post('/api/provider/set-service-status', {
          service_type: serviceType,
          status,
        }, { headers })
      }
      if (res.data.msg === '200') {
        toast.success('Service configuration updated')
        fetchData()
      } else {
        toast.error(res.data.message || 'Failed to update')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving('')
      setConfirmOpen(false)
      setPendingChange(null)
    }
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Service Configuration'
          subtitle='Set active provider and status for each bill service'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Bills Management' },
            { label: 'Service Config' },
          ]}
        />
      </Grid>

      {loading ? (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        configs.map((config) => {
          const meta = SERVICE_META[config.service_type] || { label: config.service_type, icon: <Cog />, color: '#666' }
          const isSavingProvider = saving === config.service_type
          const isSavingStatus = saving === config.service_type + '_status'

          return (
            <Grid item xs={12} md={6} key={config.service_type}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: meta.color + '20', color: meta.color,
                    }}>
                      {meta.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {meta.label}
                      </Typography>
                      <StatusBadge status={config.status} />
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size='small'>
                        <InputLabel>Active Provider</InputLabel>
                        <Select
                          label='Active Provider'
                          value={config.active_provider_id?._id || config.active_provider_id || ''}
                          onChange={e => handleProviderChange(config.service_type, e.target.value)}
                          disabled={isSavingProvider}
                          endAdornment={isSavingProvider
                            ? <CircularProgress size={16} sx={{ mr: 2 }} />
                            : null}>
                          <MenuItem value=''>
                            <em>None (use fallback)</em>
                          </MenuItem>
                          {providers
                            .filter(p => p.status === 'active')
                            .map(p => (
                              <MenuItem key={p._id} value={p._id}>
                                {p.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth size='small'>
                        <InputLabel>Service Status</InputLabel>
                        <Select
                          label='Service Status'
                          value={config.status || 'active'}
                          onChange={e => handleStatusChange(config.service_type, e.target.value)}
                          disabled={isSavingStatus}
                          endAdornment={isSavingStatus
                            ? <CircularProgress size={16} sx={{ mr: 2 }} />
                            : null}>
                          {STATUS_OPTIONS.map(s => (
                            <MenuItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {config.active_provider_id && (
                    <Box sx={{ mt: 2, p: 2, borderRadius: 1, backgroundColor: 'action.hover' }}>
                      <Typography variant='caption' color='text.secondary'>
                        Active: {config.active_provider_id?.name || 'VTUGate'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })
      )}
      
      <ConfirmDialog
      open={confirmOpen}
      onClose={() => { setConfirmOpen(false); setPendingChange(null); fetchData() }}
      onConfirm={handleConfirmChange}
      loading={saving !== ''}
      title={pendingChange?.title || 'Confirm Change'}
      message={pendingChange?.message || 'Are you sure?'}
      confirmLabel='Yes, Update'
      confirmColor='primary'
    />
    </Grid>
  )
}

export default BillsServiceConfig