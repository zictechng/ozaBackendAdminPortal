import { useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import { Editor } from '@tinymce/tinymce-react'
import {
  Cog, CurrencyUsd, Bank, InformationOutline,
  Cellphone, Bitcoin, ImageOutline, Gift,
} from 'mdi-material-ui'
import { styled } from '@mui/material/styles'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  objectFit: 'contain',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1),
}))

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import client from 'src/@core/context/client'

const SwitchRow = ({ label, subtitle, checked, onChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
    <Box>
      <Typography variant='body2' sx={{ fontWeight: 600 }}>{label}</Typography>
      {subtitle && <Typography variant='body2' color='text.secondary'>{subtitle}</Typography>}
    </Box>
    <Switch checked={Boolean(checked)} onChange={e => onChange(e.target.checked)} color='success' />
  </Box>
)

const AppSettings = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }
  const editorRef = useRef(null)
  const landEditorRef = useRef(null)

  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState('')
  const [editorKey, setEditorKey] = useState('')

  // App Name settings
  const [appName, setAppName] = useState('')
  const [shortName, setShortName] = useState('')
  const [appVersion, setAppVersion] = useState('')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateNote, setUpdateNote] = useState('')
  const [updateBtnText, setUpdateBtnText] = useState('')
  const [updateShowIcon, setUpdateShowIcon] = useState(false)

  // App Status toggles
  const [paypalSale, setPaypalSale] = useState(false)
  const [payoneerSale, setPayoneerSale] = useState(false)
  const [bitcoinSale, setBitcoinSale] = useState(false)
  const [paypalBuy, setPaypalBuy] = useState(false)
  const [payoneerBuy, setPayoneerBuy] = useState(false)
  const [bitcoinBuy, setBitcoinBuy] = useState(false)
  const [appStatus, setAppStatus] = useState(false)
  const [referralBonus, setReferralBonus] = useState(false)
  const [signupBonus, setSignupBonus] = useState(false)
  const [stopNewSignup, setStopNewSignup] = useState(false)
  const [appMode, setAppMode] = useState(false)
  const [stopUserLogin, setStopUserLogin] = useState(false)
  const [appModeMessage, setAppModeMessage] = useState('')
  const [payPayKey, setPayPayKey] = useState('')
  const [appBaseUrl, setAppBaseUrl] = useState('')
  const [miniFunding, setMiniFunding] = useState('')
  const [maxFunding, setMaxFunding] = useState('')
  const [payPalAction, setPayPalAction] = useState(false)
  const [payStackAction, setPayStackAction] = useState(false)

  // Land page
  const [landTitle, setLandTitle] = useState('')
  const [landDesc, setLandDesc] = useState('')

  // Logo & Media
  const [appLogo, setAppLogo] = useState('')
  const [appMainLogo, setAppMainLogo] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [mainLogoUploading, setMainLogoUploading] = useState(false)

  // Bonus Configuration
  const [signupBonusUsd, setSignupBonusUsd] = useState('')
  const [signupBonusRate, setSignupBonusRate] = useState('')
  const [signupBonusMinTxn, setSignupBonusMinTxn] = useState('')
  const [signupBonusServices, setSignupBonusServices] = useState([])
  const [referralBonusUsd, setReferralBonusUsd] = useState('')
  const [referralBonusRate, setReferralBonusRate] = useState('')
  const [referralBonusMinTxn, setReferralBonusMinTxn] = useState('')
  const [referralBonusServices, setReferralBonusServices] = useState([])

  // Bank details
  const [bank, setBank] = useState({
    paypal_address: '', payoneer_address: '', bitcoin_address: '',
    zenith_number: '', zenith_bankName: '', zenith_acctName: '',
    fidelityNumber: '', fidelity_bankName: '', fidelityAcctName: '',
    bank3_number: '', bank3_bankName: '', bank3_acctName: '',
    momo_number: '',
  })

  // API key visibility
  const [showApiKeys, setShowApiKeys] = useState(false)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const [settingsRes, bankRes] = await Promise.all([
        client.get('/api/app_setting', { headers }),
        client.get('/api/fetchCompany_bank', { headers }),
      ])

      if (settingsRes.data.msg === '201') {
        const d = settingsRes.data.feedAll[0]
        setAppName(d?.app_name || '')
        setShortName(d?.app_short_name || '')
        setAppVersion(d?.app_version || '')
        setUpdateTitle(d?.app_updateTitle || '')
        setUpdateNote(d?.app_update_note || '')
        setUpdateBtnText(d?.app_update_btn_text || '')
        setUpdateShowIcon(d?.app_updateShowIcon || false)
        setPaypalSale(d?.app_paypal_sale || false)
        setPayoneerSale(d?.app_payoneer_sale || false)
        setBitcoinSale(d?.app_bitcoin_sale || false)
        setPaypalBuy(d?.app_paypal_buy || false)
        setPayoneerBuy(d?.app_payoneer_buy || false)
        setBitcoinBuy(d?.app_bitcoin_buy || false)
        setAppStatus(d?.app_state || false)
        setReferralBonus(d?.app_referral_bonus || false)
        setSignupBonus(d?.app_signup_bonus || false)
        setStopNewSignup(d?.app_new_signup_status || false)
        setAppMode(d?.app_operation_status || false)
        setStopUserLogin(d?.app_stop_login_status || false)
        setAppModeMessage(d?.app_mode_message || '')
        setPayPayKey(d?.app_paypayKey || '')
        setAppBaseUrl(d?.app_baseurl || '')
        setMiniFunding(d?.app_minim_funding || '')
        setMaxFunding(d?.app_maxi_funding || '')
        setPayPalAction(d?.app_paypal_bnt || false)
        setPayStackAction(d?.app_payStack_btn || false)
        setLandTitle(d?.app_launch_title || '')
        setLandDesc(d?.app_launch_desc || '')
        setEditorKey(d?.app_textEditor_key || '')
        setAppLogo(d?.app_logo || '')
        setAppMainLogo(d?.app_main_logo || '')
        setSignupBonusUsd(d?.signup_bonus_usd_amount || '')
        setSignupBonusRate(d?.signup_bonus_conversion_rate || '')
        setSignupBonusMinTxn(d?.signup_bonus_min_txn_amount || '')
        setSignupBonusServices(d?.signup_bonus_qualify_services || ['paypal', 'payoneer', 'bitcoin'])
        setReferralBonusUsd(d?.referral_bonus_usd_amount || '')
        setReferralBonusRate(d?.referral_bonus_conversion_rate || '')
        setReferralBonusMinTxn(d?.referral_bonus_min_txn_amount || '')
        setReferralBonusServices(d?.referral_bonus_qualify_services || ['paypal', 'payoneer', 'bitcoin'])
      }

      if (bankRes.data.msg === '201') {
        const b = bankRes.data.feedAll[0]
          setBank({
          paypal_address: b?.company_paypal_address || '',
          payoneer_address: b?.company_payoneer_address || '',
          bitcoin_address: b?.company_btc_address || '',
          zenith_number: b?.company_acct_number2 || '',
          zenith_bankName: b?.company_bank2 || '',
          zenith_acctName: b?.company_acct_name2 || '',
          fidelityNumber: b?.company_acct_number1 || '',
          fidelity_bankName: b?.company_bank1 || '',
          fidelityAcctName: b?.company_acct_name1 || '',
          bank3_number: b?.company_acct_number3 || '',
          bank3_bankName: b?.company_bank3 || '',
          bank3_acctName: b?.company_acct_name3 || '',
          momo_number: b?.company_momoAccount || '',
        })
      }
    } catch (e) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

    const uploadLogo = async (file, type) => {
    if (!file) 
      { toast.warning('Please select a file'); 

        return 
      }
    const maxSize = 800 * 1024
    if (file.size > maxSize) 
      { toast.warning('File size must be under 800KB'); 

        return 
      }
    const formData = new FormData()
    formData.append('file', file)
    const endpoint = type === 'main' ? '/api/uploadMain_logo' : '/api/uploadApp_logo'
    type === 'main' ? setMainLogoUploading(true) : setLogoUploading(true)
    try {
      const res = await client.post(endpoint, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.msg === '201') {
        toast.success(`${type === 'main' ? 'Main logo' : 'App logo'} uploaded successfully`)
        fetchSettings()
      } else {
        toast.error(res.data.message || 'Upload failed')
      }
    } catch (e) {
      toast.error('Upload failed')
    } finally {
      type === 'main' ? setMainLogoUploading(false) : setLogoUploading(false)
    }
  }

  const saveBonusConfig = async () => {
  setSaving('bonus')
  try {
    const res = await client.post('/api/update_bonusConfig', {
      signup_bonus_usd_amount: Number(signupBonusUsd),
      signup_bonus_conversion_rate: Number(signupBonusRate),
      signup_bonus_min_txn_amount: Number(signupBonusMinTxn),
      signup_bonus_qualify_services: signupBonusServices,
      referral_bonus_usd_amount: Number(referralBonusUsd),
      referral_bonus_conversion_rate: Number(referralBonusRate),
      referral_bonus_min_txn_amount: Number(referralBonusMinTxn),
      referral_bonus_qualify_services: referralBonusServices,
    }, { headers })
    if (res.data.msg === '201') toast.success('Bonus configuration saved successfully')
    else toast.error(res.data.message || 'Failed to save')
  } catch (e) { toast.error('Something went wrong') }
    finally { setSaving('') }
  }

  const saveAppName = async () => {
    setSaving('name')
    try {
      const desc = editorRef.current ? editorRef.current.getContent() : shortName
      
      const res = await client.post('/api/update_appName', {
        appName, appDesc: desc, appVersion,
        updateTitle, updateNote, updateBtnText, updateIcon: updateShowIcon,
      }, { headers })
      if (res.data.msg === '201') toast.success('App settings saved successfully')
      else toast.error(res.data.message || 'Failed to save')
    } catch (e) { toast.error('Something went wrong') }
    finally { setSaving('') }
  }

  const saveAppStatus = async () => {
    setSaving('status')
    try {
        const res = await client.post('/api/update_appStatus', {
        paypalSale, payoneerSale, bitcoinSale,
        paypalBuy, payoneerBuy, bitcoinBuy,
        appStatus, referral_bonus_status: referralBonus,
        signup_bonus_status: signupBonus, newSignup_status: stopNewSignup,
        appMode_status: appMode, appLogin_status: stopUserLogin,
        appMode_message: appModeMessage, payPayToken: payPayKey,
        baseUrl: appBaseUrl, mini_funding: miniFunding,
        maxi_funding: maxFunding, paypal_btn: payPalAction,
        payStack_btn: payStackAction, textEditorKey: editorKey,
      }, { headers })
      if (res.data.msg === '201') toast.success('App status updated successfully')
      else toast.error(res.data.message || 'Failed to save')
    } catch (e) { toast.error('Something went wrong') }
    finally { setSaving('') }
  }

  const saveLandPage = async () => {
    setSaving('land')
    try {
      const desc = landEditorRef.current ? landEditorRef.current.getContent() : landDesc

      const res = await client.post('/api/update_landPage', {
        appTitle: landTitle, appDesc: desc,
      }, { headers })
      if (res.data.msg === '201') toast.success('Landing page updated successfully')
      else toast.error(res.data.message || 'Failed to save')
    } catch (e) { toast.error('Something went wrong') }
    finally { setSaving('') }
  }

  const saveBank = async () => {
    setSaving('bank')
    try {
      const res = await client.post('/api/update_companyBankStatus', bank, { headers })
      if (res.data.msg === '201') toast.success('Bank details updated successfully')
      else toast.error(res.data.message || 'Failed to save')
    } catch (e) { toast.error('Something went wrong') }
    finally { setSaving('') }
  }

  useEffect(() => {
    fetchSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ALL_SERVICE_TYPES = [
    { key: 'paypal', label: 'PayPal' },
    { key: 'payoneer', label: 'Payoneer' },
    { key: 'bitcoin', label: 'Bitcoin' },
    { key: 'airtime', label: 'Airtime' },
    { key: 'data', label: 'Mobile Data' },
    { key: 'electricity', label: 'Electricity' },
    { key: 'tv_subscription', label: 'TV Subscription' },
    { key: 'exam_cards', label: 'Exam Cards' },
  ]

  const editorConfig = {
    height: 350,
    menubar: true,
    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_style: 'body { font-family: Inter, sans-serif; font-size: 14px }',
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
      <CircularProgress size={48} />
    </Box>
  )

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      <Grid item xs={12}>
        <PageHeader
          title='App Settings'
          subtitle='Configure your platform settings, toggles and content'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Application Settings' },
            { label: 'App Settings' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3 }}
            variant='scrollable'
            scrollButtons='auto'>
            <Tab icon={<Cog fontSize='small' />} iconPosition='start' label='App Info' />
            <Tab icon={<InformationOutline fontSize='small' />} iconPosition='start' label='App Status' />
            <Tab icon={<Cellphone fontSize='small' />} iconPosition='start' label='Landing Page' />
            <Tab icon={<Bank fontSize='small' />} iconPosition='start' label='Bank Details' />
            <Tab icon={<ImageOutline fontSize='small' />} iconPosition='start' label='Logo & Media' />
            <Tab icon={<Gift fontSize='small' />} iconPosition='start' label='Bonus Config' />
          </Tabs>

          {/* Tab 0 — App Info */}
          {tab === 0 && (
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant='contained' onClick={saveAppName} disabled={saving === 'name'}
                  startIcon={saving === 'name' ? <CircularProgress size={16} color='inherit' /> : null}
                  sx={{ borderRadius: 2, px: 4 }}>
                  {saving === 'name' ? 'Saving...' : 'Save App Info'}
                </Button>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='App Name' value={appName} onChange={e => setAppName(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='App Version' value={appVersion} onChange={e => setAppVersion(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Update Title' value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size='small' label='Update Button Text' value={updateBtnText} onChange={e => setUpdateBtnText(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size='small' label='Update Note' multiline rows={3} value={updateNote} onChange={e => setUpdateNote(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={Boolean(updateShowIcon)} onChange={e => setUpdateShowIcon(e.target.checked)} color='success' />}
                    label={<Typography variant='body2' sx={{ fontWeight: 600 }}>Show Update Icon</Typography>}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 700, mb: 2 }}>App Short Description</Typography>
                  {editorKey ? (
                    <Editor apiKey={editorKey} onInit={(evt, editor) => editorRef.current = editor}
                      initialValue={shortName} init={editorConfig} />
                  ) : (
                    <TextField fullWidth multiline rows={6} label='Short Description'
                      value={shortName} onChange={e => setShortName(e.target.value)} />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          )}

          {/* Tab 1 — App Status */}
          {tab === 1 && (
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant='contained' onClick={saveAppStatus} disabled={saving === 'status'}
                  startIcon={saving === 'status' ? <CircularProgress size={16} color='inherit' /> : null}
                  sx={{ borderRadius: 2, px: 4 }}>
                  {saving === 'status' ? 'Saving...' : 'Save Status'}
                </Button>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Sale Services</Typography>} />
                    <Divider />
                    <CardContent>
                      <SwitchRow label='PayPal Sales' subtitle='Allow users to sell PayPal' checked={paypalSale} onChange={setPaypalSale} />
                      <SwitchRow label='Payoneer Sales' subtitle='Allow users to sell Payoneer' checked={payoneerSale} onChange={setPayoneerSale} />
                      <SwitchRow label='Bitcoin Sales' subtitle='Allow users to sell Bitcoin' checked={bitcoinSale} onChange={setBitcoinSale} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Buy Services</Typography>} />
                    <Divider />
                    <CardContent>
                      <SwitchRow label='PayPal Buying' subtitle='Allow users to buy PayPal' checked={paypalBuy} onChange={setPaypalBuy} />
                      <SwitchRow label='Payoneer Buying' subtitle='Allow users to buy Payoneer' checked={payoneerBuy} onChange={setPayoneerBuy} />
                      <SwitchRow label='Bitcoin Buying' subtitle='Allow users to buy Bitcoin' checked={bitcoinBuy} onChange={setBitcoinBuy} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Platform Controls</Typography>} />
                    <Divider />
                    <CardContent>
                      <SwitchRow label='App Active' subtitle='Enable or disable the entire platform' checked={appStatus} onChange={setAppStatus} />
                      <SwitchRow label='Stop New Signups' subtitle='Prevent new user registrations' checked={stopNewSignup} onChange={setStopNewSignup} />
                      <SwitchRow label='Stop User Login' subtitle='Prevent all user logins' checked={stopUserLogin} onChange={setStopUserLogin} />
                      <SwitchRow label='Maintenance Mode' subtitle='Show maintenance message to users' checked={appMode} onChange={setAppMode} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Rewards & Bonuses</Typography>} />
                    <Divider />
                    <CardContent>
                      <SwitchRow label='Referral Bonus' subtitle='Enable referral bonus system' checked={referralBonus} onChange={setReferralBonus} />
                      <SwitchRow label='Signup Bonus' subtitle='Enable new user signup bonus' checked={signupBonus} onChange={setSignupBonus} />
                      <SwitchRow label='PayPal Button' subtitle='Show PayPal payment button' checked={payPalAction} onChange={setPayPalAction} />
                      <SwitchRow label='PayStack Button' subtitle='Show PayStack payment button' checked={payStackAction} onChange={setPayStackAction} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Advanced Settings</Typography>}
                      action={
                        <FormControlLabel
                          control={<Switch checked={showApiKeys} onChange={e => setShowApiKeys(e.target.checked)} size='small' />}
                          label={<Typography variant='body2'>{showApiKeys ? 'Hide API Keys' : 'Show API Keys'}</Typography>}
                          sx={{ mr: 1 }}
                        />
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='PayPal API Key'
                            value={payPayKey} onChange={e => setPayPayKey(e.target.value)}
                            type={showApiKeys ? 'text' : 'password'} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='TinyMCE Editor Key'
                            value={editorKey} onChange={e => setEditorKey(e.target.value)}
                            type={showApiKeys ? 'text' : 'password'}
                            helperText='Required for rich text editor in content pages' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='App Base URL'
                            value={appBaseUrl} onChange={e => setAppBaseUrl(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Min Funding Amount (₦)'
                            value={miniFunding} onChange={e => setMiniFunding(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Max Funding Amount (₦)'
                            value={maxFunding} onChange={e => setMaxFunding(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Maintenance Mode Message' multiline rows={3}
                            value={appModeMessage} onChange={e => setAppModeMessage(e.target.value)}
                            helperText='This message is shown to users when maintenance mode is active' />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Provider API Keys — managed via Bills Providers page */}
                <Grid item xs={12}>
                  <Card variant='outlined' sx={{ borderColor: 'primary.light' }}>
                    <CardHeader
                      title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bills Provider API Keys</Typography>}
                      subheader={
                        <Typography variant='body2' color='text.secondary'>
                          Provider API keys (VTUGate, Bigisub, Monnify) are managed securely via the Bills Providers page with AES-256 encryption.
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Alert severity='info' sx={{ mb: 2, borderRadius: 2 }}>
                        <Typography variant='body2'>
                          For security, provider API keys are stored encrypted in the database and managed separately.
                          Go to <strong>Bills Management → Providers</strong> to add or update provider API keys.
                        </Typography>
                      </Alert>
                      <Button variant='outlined' onClick={() => window.location.href = '/bills/providers'} sx={{ borderRadius: 2 }}>
                        Manage Provider API Keys
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          )}

          {/* Tab 2 — Landing Page */}
          {tab === 2 && (
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant='contained' onClick={saveLandPage} disabled={saving === 'land'}
                  startIcon={saving === 'land' ? <CircularProgress size={16} color='inherit' /> : null}
                  sx={{ borderRadius: 2, px: 4 }}>
                  {saving === 'land' ? 'Saving...' : 'Save Landing Page'}
                </Button>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField fullWidth size='small' label='Landing Page Title'
                    value={landTitle} onChange={e => setLandTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 700, mb: 2 }}>Landing Page Content</Typography>
                  <Alert severity='info' sx={{ mb: 2, borderRadius: 2 }}>
                    <Typography variant='body2'>
                      This content is displayed on your platform landing/home page.
                    </Typography>
                  </Alert>
                  {editorKey ? (
                    <Editor apiKey={editorKey} onInit={(evt, editor) => landEditorRef.current = editor}
                      initialValue={landDesc} init={editorConfig} />
                  ) : (
                    <TextField fullWidth multiline rows={12} label='Landing Page Content'
                      value={landDesc} onChange={e => setLandDesc(e.target.value)} />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          )}

          {/* Tab 3 — Bank Details */}
          {tab === 3 && (
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant='contained' onClick={saveBank} disabled={saving === 'bank'}
                  startIcon={saving === 'bank' ? <CircularProgress size={16} color='inherit' /> : null}
                  sx={{ borderRadius: 2, px: 4 }}>
                  {saving === 'bank' ? 'Saving...' : 'Save Bank Details'}
                </Button>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Digital Payment Addresses</Typography>} />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth size='small' label='PayPal Address'
                            value={bank.paypal_address} onChange={e => setBank(p => ({ ...p, paypal_address: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth size='small' label='Payoneer Address'
                            value={bank.payoneer_address} onChange={e => setBank(p => ({ ...p, payoneer_address: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth size='small' label='Bitcoin Address'
                            value={bank.bitcoin_address} onChange={e => setBank(p => ({ ...p, bitcoin_address: e.target.value }))} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bank Account 1</Typography>} />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Bank Name'
                            value={bank.fidelity_bankName} onChange={e => setBank(p => ({ ...p, fidelity_bankName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Name'
                            value={bank.fidelityAcctName} onChange={e => setBank(p => ({ ...p, fidelityAcctName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Number'
                            value={bank.fidelityNumber} onChange={e => setBank(p => ({ ...p, fidelityNumber: e.target.value }))} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bank Account 2</Typography>} />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Bank Name'
                            value={bank.zenith_bankName} onChange={e => setBank(p => ({ ...p, zenith_bankName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Name'
                            value={bank.zenith_acctName} onChange={e => setBank(p => ({ ...p, zenith_acctName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Number'
                            value={bank.zenith_number} onChange={e => setBank(p => ({ ...p, zenith_number: e.target.value }))} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                 <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Bank Account 3</Typography>} />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Bank Name'
                            value={bank.bank3_bankName} onChange={e => setBank(p => ({ ...p, bank3_bankName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Name'
                            value={bank.bank3_acctName} onChange={e => setBank(p => ({ ...p, bank3_acctName: e.target.value }))} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Account Number'
                            value={bank.bank3_number} onChange={e => setBank(p => ({ ...p, bank3_number: e.target.value }))} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Mobile Money</Typography>} />
                    <Divider />
                    <CardContent>
                      <TextField fullWidth size='small' label='Mobile Money Number'
                        value={bank.momo_number} onChange={e => setBank(p => ({ ...p, momo_number: e.target.value }))} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          )}

          {/* Tab 4 — Logo & Media */}
          {tab === 4 && (
            <CardContent>
              <Grid container spacing={4}>
                {/* App Logo */}
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={<Typography variant='h6' sx={{ fontWeight: 700 }}>App Logo</Typography>}
                      subheader={
                        <Typography variant='body2' color='text.secondary'>
                          Main app logo shown in header and emails. PNG or JPEG, max 800KB.
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <ImgStyled
                          src={appLogo || '/images/avatars/1.png'}
                          alt='App Logo'
                          onError={e => e.target.src = '/images/avatars/1.png'}
                        />
                        <Box>
                          <Button
                            component='label'
                            variant='contained'
                            size='small'
                            disabled={logoUploading}
                            startIcon={logoUploading ? <CircularProgress size={14} color='inherit' /> : null}
                            sx={{ mb: 1, display: 'block' }}>
                            {logoUploading ? 'Uploading...' : 'Upload App Logo'}
                            <input
                              hidden
                              type='file'
                              accept='image/png,image/jpeg,image/jpg'
                              onChange={e => uploadLogo(e.target.files[0], 'app')}
                            />
                          </Button>
                          <Typography variant='body2' color='text.secondary'>
                            Allowed: PNG, JPEG. Max: 800KB
                          </Typography>
                        </Box>
                      </Box>
                      {appLogo && (
                        <Alert severity='success' sx={{ borderRadius: 2 }}>
                          <Typography variant='body2'>App logo is set and active.</Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Main Logo */}
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Main Logo</Typography>}
                      subheader={
                        <Typography variant='body2' color='text.secondary'>
                          Secondary logo used on login page and banners. PNG or JPEG, max 800KB.
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <ImgStyled
                          src={appMainLogo || '/images/avatars/1.png'}
                          alt='Main Logo'
                          onError={e => e.target.src = '/images/avatars/1.png'}
                        />
                        <Box>
                          <Button
                            component='label'
                            variant='contained'
                            size='small'
                            disabled={mainLogoUploading}
                            startIcon={mainLogoUploading ? <CircularProgress size={14} color='inherit' /> : null}
                            sx={{ mb: 1, display: 'block' }}>
                            {mainLogoUploading ? 'Uploading...' : 'Upload Main Logo'}
                            <input
                              hidden
                              type='file'
                              accept='image/png,image/jpeg,image/jpg'
                              onChange={e => uploadLogo(e.target.files[0], 'main')}
                            />
                          </Button>
                          <Typography variant='body2' color='text.secondary'>
                            Allowed: PNG, JPEG. Max: 800KB
                          </Typography>
                        </Box>
                      </Box>
                      {appMainLogo && (
                        <Alert severity='success' sx={{ borderRadius: 2 }}>
                          <Typography variant='body2'>Main logo is set and active.</Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Guidelines */}
                <Grid item xs={12}>
                  <Alert severity='info' sx={{ borderRadius: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: 700, mb: 0.5 }}>
                      Logo Guidelines
                    </Typography>
                    <Typography variant='body2'>
                      • Use a transparent background PNG for best results<br/>
                      • Recommended size: 200x200px for app logo, 400x200px for main logo<br/>
                      • Logo appears in the admin header, mobile app, and email notifications<br/>
                      • After uploading, refresh the page to see the updated logo in the header
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          )}

                    {/* Tab 5 — Bonus Configuration */}
          {tab === 5 && (
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant='contained' onClick={saveBonusConfig} disabled={saving === 'bonus'}
                  startIcon={saving === 'bonus' ? <CircularProgress size={16} color='inherit' /> : null}
                  sx={{ borderRadius: 2, px: 4 }}>
                  {saving === 'bonus' ? 'Saving...' : 'Save Bonus Config'}
                </Button>
              </Box>

              <Alert severity='info' sx={{ mb: 4, borderRadius: 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 700, mb: 0.5 }}>
                  How Bonus Activation Works
                </Typography>
                <Typography variant='body2'>
                  Bonuses are NOT credited immediately. They are activated only when the user makes a qualifying transaction
                  that meets both the service type and minimum amount requirements you set below.
                  This protects the platform from financial loss.
                </Typography>
              </Alert>

              <Grid container spacing={4}>
                {/* Signup Bonus */}
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
                            <Gift fontSize='small' />
                          </Box>
                          <Typography variant='h6' sx={{ fontWeight: 700 }}>Signup Bonus</Typography>
                        </Box>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Bonus Amount ($)'
                            type='number' value={signupBonusUsd}
                            onChange={e => setSignupBonusUsd(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                            helperText='Fixed dollar amount given to new users'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Conversion Rate (₦ per $1)'
                            type='number' value={signupBonusRate}
                            onChange={e => setSignupBonusRate(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                            helperText='Admin-set rate to convert $ to ₦'
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Minimum Transaction Amount (₦)'
                            type='number' value={signupBonusMinTxn}
                            onChange={e => setSignupBonusMinTxn(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                            helperText='User must transact at least this amount to unlock bonus'
                          />
                        </Grid>
                        {signupBonusUsd && signupBonusRate && (
                          <Grid item xs={12}>
                            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#EDE9FE' }}>
                              <Typography variant='body2' sx={{ fontWeight: 700, color: '#7C3AED' }}>
                                Preview: ${signupBonusUsd} × ₦{signupBonusRate} = ₦{(Number(signupBonusUsd) * Number(signupBonusRate)).toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant='body2' sx={{ fontWeight: 700, mb: 1 }}>
                            Qualifying Service Types
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                            Select which transaction types qualify to unlock this bonus
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {ALL_SERVICE_TYPES.map(s => (
                            <Chip
                                key={s.key}
                                label={s.label}
                                size='small'
                                clickable
                                color={signupBonusServices.includes(s.key) ? 'primary' : 'default'}
                                variant={signupBonusServices.includes(s.key) ? 'filled' : 'outlined'}
                                onClick={() => {
                                  setSignupBonusServices(prev =>
                                    prev.includes(s.key)
                                      ? prev.filter(x => x !== s.key)
                                      : [...prev, s.key]
                                  )
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Referral Bonus */}
                <Grid item xs={12} md={6}>
                  <Card variant='outlined'>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1FAE5', color: '#10B981' }}>
                            <Gift fontSize='small' />
                          </Box>
                          <Typography variant='h6' sx={{ fontWeight: 700 }}>Referral Bonus</Typography>
                        </Box>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Bonus Amount ($)'
                            type='number' value={referralBonusUsd}
                            onChange={e => setReferralBonusUsd(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                            helperText='Fixed dollar amount given to referrer (one time)'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth size='small' label='Conversion Rate (₦ per $1)'
                            type='number' value={referralBonusRate}
                            onChange={e => setReferralBonusRate(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                            helperText='Admin-set rate to convert $ to ₦'
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth size='small' label='Minimum Transaction Amount (₦)'
                            type='number' value={referralBonusMinTxn}
                            onChange={e => setReferralBonusMinTxn(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position='start'>₦</InputAdornment> }}
                            helperText='Referred user must transact at least this amount to trigger bonus'
                          />
                        </Grid>
                        {referralBonusUsd && referralBonusRate && (
                          <Grid item xs={12}>
                            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#D1FAE5' }}>
                              <Typography variant='body2' sx={{ fontWeight: 700, color: '#10B981' }}>
                                Preview: ${referralBonusUsd} × ₦{referralBonusRate} = ₦{(Number(referralBonusUsd) * Number(referralBonusRate)).toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant='body2' sx={{ fontWeight: 700, mb: 1 }}>
                            Qualifying Service Types
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                            Select which transaction types qualify to trigger this bonus
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {ALL_SERVICE_TYPES.map(s => (
                              <Chip
                                key={s.key}
                                label={s.label}
                                size='small'
                                clickable
                                color={referralBonusServices.includes(s.key) ? 'success' : 'default'}
                                variant={referralBonusServices.includes(s.key) ? 'filled' : 'outlined'}
                                onClick={() => {
                                  setReferralBonusServices(prev =>
                                    prev.includes(s.key)
                                      ? prev.filter(x => x !== s.key)
                                      : [...prev, s.key]
                                  )
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default AppSettings