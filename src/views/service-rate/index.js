import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import { CurrencyUsd, Bitcoin, TrendingUp, TrendingDown, Gift } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import client from 'src/@core/context/client'

const RateCard = ({ title, icon, iconColor, iconBg, children }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: iconBg, color: iconColor }}>
            {icon}
          </Box>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>{title}</Typography>
        </Box>
      }
    />
    <Divider />
    <CardContent>{children}</CardContent>
  </Card>
)

const ServiceRateView = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [rates, setRates] = useState({
    paypal_selling: '',
    paypal_buying: '',
    payoneer_selling: '',
    payoneer_buying: '',
    btc_selling: '',
    btc_buying: '',
    bonus_rate: '',
    signup_bonus_rate: '',
  })

  const fetchRates = async () => {
    setLoading(true)
    try {
      const res = await client.get('/api/service_rate', { headers })
      if (res.data.msg === '201' && res.data.feedAll?.[0]) {
        const r = res.data.feedAll[0]
        setRates({
          paypal_selling: r.paypal_selling || '',
          paypal_buying: r.paypal_buying || '',
          payoneer_selling: r.payoneer_selling || '',
          payoneer_buying: r.payoneer_buying || '',
          btc_selling: r.btc_selling || '',
          btc_buying: r.btc_buying || '',
          bonus_rate: r.bonus_rate || '',
          signup_bonus_rate: r.signup_bonus_rate || '',
        })
      }
    } catch (e) {
      toast.error('Failed to load rates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await client.post('/api/updateService_rate', rates, { headers })
      if (res.data.msg === '201') {
        toast.success('Rates updated successfully')
      } else {
        toast.error(res.data.message || 'Failed to update rates')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => setRates(prev => ({ ...prev, [field]: value }))

  useEffect(() => { fetchRates() },
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>

  return (
    <Box>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button variant='contained' onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
          sx={{ borderRadius: 2, px: 4 }}>
          {saving ? 'Saving...' : 'Save All Rates'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <RateCard title='PayPal Rates' icon={<CurrencyUsd />} iconColor='#1565C0' iconBg='#E3F2FD'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Selling Rate (₦ per $)'
                  value={rates.paypal_selling}
                  onChange={e => handleChange('paypal_selling', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which users sell PayPal to you'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Buying Rate (₦ per $)'
                  value={rates.paypal_buying}
                  onChange={e => handleChange('paypal_buying', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which you sell PayPal to users'
                />
              </Grid>
            </Grid>
          </RateCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <RateCard title='Payoneer Rates' icon={<CurrencyUsd />} iconColor='#E65100' iconBg='#FFF3E0'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Selling Rate (₦ per $)'
                  value={rates.payoneer_selling}
                  onChange={e => handleChange('payoneer_selling', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which users sell Payoneer to you'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Buying Rate (₦ per $)'
                  value={rates.payoneer_buying}
                  onChange={e => handleChange('payoneer_buying', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which you sell Payoneer to users'
                />
              </Grid>
            </Grid>
          </RateCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <RateCard title='Bitcoin Rates' icon={<Bitcoin />} iconColor='#F57F17' iconBg='#FFFDE7'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Selling Rate (₦ per $)'
                  value={rates.btc_selling}
                  onChange={e => handleChange('btc_selling', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which users sell Bitcoin to you'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Buying Rate (₦ per $)'
                  value={rates.btc_buying}
                  onChange={e => handleChange('btc_buying', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                  helperText='Rate at which you sell Bitcoin to users'
                />
              </Grid>
            </Grid>
          </RateCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <RateCard title='Referral Bonus Rate' icon={<Gift />} iconColor='#2E7D32' iconBg='#E8F5E9'>
            <TextField fullWidth size='small' label='Referral Bonus Rate'
              value={rates.bonus_rate}
              onChange={e => handleChange('bonus_rate', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position='end'>%</InputAdornment> }}
              helperText='Commission rate paid to referrers when their referred users make purchases'
            />
          </RateCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <RateCard title='Signup Bonus Rate' icon={<TrendingUp />} iconColor='#6A1B9A' iconBg='#F3E5F5'>
            <TextField fullWidth size='small' label='Signup Bonus Amount (₦)'
              value={rates.signup_bonus_rate}
              onChange={e => handleChange('signup_bonus_rate', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
              helperText='Bonus amount credited to new users upon successful registration'
            />
          </RateCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ServiceRateView