
import { useState, useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Star, Gift, AccountGroup, CurrencyUsd, ShieldAccount } from 'mdi-material-ui'

import PageHeader from 'src/@core/components/common/PageHeader'
import { AuthContext } from 'src/@core/context/authContext'
import client from 'src/@core/context/client'

const SectionCard = ({ title, subtitle, icon, iconColor, children }) => (
  <Card sx={{ mb: 4 }}>
    <CardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: iconColor + '20', color: iconColor,
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
            {subtitle && <Typography variant='body2' color='text.secondary' sx={{ mt: 0.3 }}>{subtitle}</Typography>}
          </Box>
        </Box>
      }
    />
    <Divider />
    <CardContent>{children}</CardContent>
  </Card>
)

const RateField = ({ label, value, onChange, helperText, suffix }) => (
  <TextField
    fullWidth
    size='small'
    label={label}
    type='number'
    value={value}
    onChange={e => onChange(Number(e.target.value))}
    helperText={<Typography variant='body2' color='text.secondary'>{helperText}</Typography>}
    InputProps={{
      endAdornment: suffix
        ? <InputAdornment position='end'>{suffix}</InputAdornment>
        : null,
      inputProps: { min: 0, step: 0.1 },
    }}
  />
)

const RewardsSettings = () => {
  const { userToken } = useContext(AuthContext)
  const token = userToken || (typeof window !== 'undefined' ? localStorage.getItem('userToken') : '')
  const headers = { Authorization: 'Bearer ' + token }

  const [settings, setSettings] = useState({
    digital_services_coin_rate: 2,
    buy_sell_coin_rate: 1,
    general_referral_rate: 1,
    business_promoter_rate: 2,
    coin_ngn_value: 1,
    coin_usd_value: 0.001,
    min_redeem_coins: 100,
    rewards_active: true,
    tier_bronze: 1,
    tier_silver: 1000,
    tier_gold: 5000,
    tier_platinum: 20000,
    tier_diamond: 100000,
    quarterly_reward_active: false,
    annual_reward_active: false,
    quarterly_reward_desc: '',
    annual_reward_desc: '',
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await client.get('/api/rewards_settings', { headers })
      if (res.data.msg === '200') {
        setSettings(prev => ({ ...prev, ...res.data.settings }))
      }
    } catch (e) {
      toast.error('Failed to load rewards settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await client.post('/api/rewards_settings/update', settings, { headers })
      if (res.data.msg === '200') {
        toast.success('Rewards settings saved successfully')
      } else {
        toast.error(res.data.message || 'Failed to save')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      <Grid item xs={12}>
        <PageHeader
          title='Rewards Settings'
          subtitle='Configure coin rates, referral commissions and tier thresholds'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Rewards & Coins' },
            { label: 'Settings' },
          ]}
          action={
            <Button
              variant='contained'
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
              onClick={handleSave}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          }
        />
      </Grid>

      <Grid item xs={12} md={8}>

        {/* Coins System Toggle */}
        <SectionCard
          title='Coins System'
          subtitle='Enable or disable the entire coins reward system'
          icon={<Star />}
          iconColor='#F59E0B'>
          <FormControlLabel
            control={
              <Switch
                checked={settings.rewards_active}
                onChange={e => handleChange('rewards_active', e.target.checked)}
                color='success'
              />
            }
            label={
              <Box>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  {settings.rewards_active ? 'Rewards System Active' : 'Rewards System Disabled'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  When disabled, no coins are earned on any transaction
                </Typography>
              </Box>
            }
          />
        </SectionCard>

        {/* Coin Rates */}
        <SectionCard
          title='Coin Earn Rates'
          subtitle='Set how many coins users earn per transaction type'
          icon={<Gift />}
          iconColor='#4C5FD5'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <RateField
                label='Digital Services Rate'
                value={settings.digital_services_coin_rate}
                onChange={v => handleChange('digital_services_coin_rate', v)}
                helperText='Coins earned on airtime, data, electricity etc'
                suffix='%'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RateField
                label='Buy / Sell Rate'
                value={settings.buy_sell_coin_rate}
                onChange={v => handleChange('buy_sell_coin_rate', v)}
                helperText='Coins earned on PayPal, Payoneer, Bitcoin trades'
                suffix='%'
              />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Referral Rates */}
        <SectionCard
          title='Referral Commission Rates'
          subtitle='Set commission rates for referral and promoter programs'
          icon={<AccountGroup />}
          iconColor='#10B981'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <RateField
                label='General Referral Rate'
                value={settings.general_referral_rate}
                onChange={v => handleChange('general_referral_rate', v)}
                helperText='One-time bonus when referred user makes first purchase'
                suffix='%'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RateField
                label='Business Promoter Rate'
                value={settings.business_promoter_rate}
                onChange={v => handleChange('business_promoter_rate', v)}
                helperText='Ongoing commission on every purchase by promoted users'
                suffix='%'
              />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Coin Value */}
        <SectionCard
          title='Coin Monetary Value'
          subtitle='Set the NGN and USD value of each coin'
          icon={<CurrencyUsd />}
          iconColor='#EC4899'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <RateField
                label='NGN Value per Coin'
                value={settings.coin_ngn_value}
                onChange={v => handleChange('coin_ngn_value', v)}
                helperText='e.g. 1 coin = ₦1.00'
                suffix='₦'
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <RateField
                label='USD Value per Coin'
                value={settings.coin_usd_value}
                onChange={v => handleChange('coin_usd_value', v)}
                helperText='e.g. 1 coin = $0.001'
                suffix='$'
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <RateField
                label='Min Coins to Redeem'
                value={settings.min_redeem_coins}
                onChange={v => handleChange('min_redeem_coins', v)}
                helperText='Minimum coins required for redemption'
                suffix='coins'
              />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Tier Thresholds */}
        <SectionCard
          title='Tier Thresholds'
          subtitle='Set the minimum coins required for each loyalty tier'
          icon={<ShieldAccount />}
          iconColor='#7C3AED'>
          <Grid container spacing={4}>
            {[
              { key: 'tier_bronze',   label: 'Bronze',   color: '#92400E' },
              { key: 'tier_silver',   label: 'Silver',   color: '#94A3B8' },
              { key: 'tier_gold',     label: 'Gold',     color: '#F59E0B' },
              { key: 'tier_platinum', label: 'Platinum', color: '#9B59B6' },
              { key: 'tier_diamond',  label: 'Diamond',  color: '#00B4D8' },
            ].map(tier => (
              <Grid item xs={12} sm={6} md={4} key={tier.key}>
                <TextField
                  fullWidth
                  size='small'
                  label={`${tier.label} Tier`}
                  type='number'
                  value={settings[tier.key]}
                  onChange={e => handleChange(tier.key, Number(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: tier.color }} />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position='end'>coins</InputAdornment>,
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        {/* Quarterly & Annual Rewards */}
        <SectionCard
          title='Special Rewards'
          subtitle='Configure quarterly and annual reward programs'
          icon={<Gift />}
          iconColor='#EC4899'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.quarterly_reward_active}
                    onChange={e => handleChange('quarterly_reward_active', e.target.checked)}
                    color='success'
                  />
                }
                label='Quarterly Reward Active'
              />
              <TextField
                fullWidth
                size='small'
                label='Quarterly Reward Description'
                value={settings.quarterly_reward_desc}
                onChange={e => handleChange('quarterly_reward_desc', e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }}
                placeholder='Describe the quarterly reward for top users...'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.annual_reward_active}
                    onChange={e => handleChange('annual_reward_active', e.target.checked)}
                    color='success'
                  />
                }
                label='Annual Reward Active'
              />
              <TextField
                fullWidth
                size='small'
                label='Annual Reward Description'
                value={settings.annual_reward_desc}
                onChange={e => handleChange('annual_reward_desc', e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }}
                placeholder='Describe the annual reward for top users...'
              />
            </Grid>
          </Grid>
        </SectionCard>

      </Grid>

      {/* Preview Panel */}
      <Grid item xs={12} md={4}>
        <Card sx={{ position: 'sticky', top: 80 }}>
          <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Live Preview</Typography>} />
          <Divider />
          <CardContent>
            <Alert severity='info' sx={{ mb: 3 }}>
              <Typography variant='caption'>
                This shows how users will see their coins and tier on the mobile app.
              </Typography>
            </Alert>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'action.hover', mb: 3 }}>
              <Typography variant='caption' color='text.secondary'>Your Coins</Typography>
              <Typography variant='h4' sx={{ fontWeight: 700, my: 1 }}>250 coins</Typography>
              <Typography variant='body2' color='text.secondary'>
                ≈ ₦{(250 * settings.coin_ngn_value).toLocaleString()} NGN
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                ≈ ${(250 * settings.coin_usd_value).toFixed(4)} USD
              </Typography>
              <Box sx={{ mt: 1, display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, backgroundColor: '#92400E20' }}>
                <Typography variant='caption' sx={{ color: '#92400E', fontWeight: 700 }}>
                  Bronze Tier
                </Typography>
              </Box>
            </Box>

            <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 2 }}>Tier Breakdown</Typography>
            {[
              { label: 'Bronze',   min: settings.tier_bronze,   color: '#92400E' },
              { label: 'Silver',   min: settings.tier_silver,   color: '#94A3B8' },
              { label: 'Gold',     min: settings.tier_gold,     color: '#F59E0B' },
              { label: 'Platinum', min: settings.tier_platinum, color: '#9B59B6' },
              { label: 'Diamond',  min: settings.tier_diamond,  color: '#00B4D8' },
            ].map(tier => (
              <Box key={tier.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: tier.color }} />
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>{tier.label}</Typography>
                </Box>
                <Typography variant='caption' color='text.secondary'>
                  {tier.min.toLocaleString()}+ coins
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default RewardsSettings