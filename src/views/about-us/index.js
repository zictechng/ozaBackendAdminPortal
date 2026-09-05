import { useState, useEffect, useRef } from 'react'
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
import Alert from '@mui/material/Alert'
import { Information, Domain, Email, Phone } from 'mdi-material-ui'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import client from 'src/@core/context/client'

const SectionCard = ({ title, icon, iconColor, iconBg, children }) => (
  <Card sx={{ mb: 4 }}>
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

const AboutUsView = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }
  const editorRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editorKey, setEditorKey] = useState('')
  
  const [form, setForm] = useState({
    company_name: '',
    company_desc: '',
    company_email: '',
    company_regId: '',
    company_address: '',
    company_phone: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('AppSettingData')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setEditorKey(parsed?.app_textEditor_key || '')
      } catch (e) {}
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await client.get('/api/allAbout_us', { headers })
      if (res.data.msg === '201' && res.data.feedAll?.[0]) {
        const d = res.data.feedAll[0]
        setForm({
          company_name: d.company_name || '',
          company_desc: d.company_desc || '',
          company_email: d.company_email || '',
          company_regId: d.company_regId || '',
          company_address: d.company_address || '',
          company_phone: d.company_phone || '',
        })
      }
    } catch (e) {
      toast.error('Failed to load company info')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const desc = editorRef.current ? editorRef.current.getContent() : form.company_desc

      const res = await client.post('/api/updateAbout_us', {
        ...form,
        company_desc: desc,
      }, { headers })

      if (res.data.msg === '201') {
        toast.success('Company information updated successfully')
      } else {
        toast.error(res.data.message || 'Failed to update')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>

  return (
    <Box>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button variant='contained' onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
          sx={{ borderRadius: 2, px: 4 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <SectionCard title='Basic Information' icon={<Information />} iconColor='#4C5FD5' iconBg='#EEF2FF'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Company Name'
                  value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Registration ID'
                  value={form.company_regId} onChange={e => handleChange('company_regId', e.target.value)} />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title='Contact Information' icon={<Email />} iconColor='#10B981' iconBg='#D1FAE5'>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Company Email'
                  type='email' value={form.company_email}
                  onChange={e => handleChange('company_email', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Phone Number'
                  value={form.company_phone} onChange={e => handleChange('company_phone', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Company Address' multiline rows={3}
                  value={form.company_address} onChange={e => handleChange('company_address', e.target.value)} />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title='Company Description' icon={<Domain />} iconColor='#F59E0B' iconBg='#FEF3C7'>
            <Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant='body2'>
                This description is shown to users on the About Us page. HTML formatting is supported.
              </Typography>
            </Alert>
            {editorKey ? (
              <Editor
                apiKey={editorKey}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={form.company_desc}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                    'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  content_style: 'body { font-family: Inter, sans-serif; font-size: 14px }',
                }}
              />
            ) : (
              <TextField
                fullWidth multiline rows={10}
                label='Company Description'
                value={form.company_desc}
                onChange={e => handleChange('company_desc', e.target.value)}
                placeholder='Enter company description here...'
                helperText={`${form.company_desc.length} characters`}
              />
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutUsView