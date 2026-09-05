import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import { ShieldLock } from 'mdi-material-ui'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import client from 'src/@core/context/client'

const UserPolicyView = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const editorRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [policyContent, setPolicyContent] = useState('')
  const [policyStatus, setPolicyStatus] = useState('Active')
  const [editorKey, setEditorKey] = useState('')

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
        setPolicyContent(res.data.feedAll[0]?.company_privacy_policy || '')
        setPolicyStatus(res.data.feedAll[0]?.policy_status || 'Active')
      }
    } catch (e) {
      toast.error('Failed to load policy')
    } finally {
      setLoading(false)
    }
  }

   const handleSave = async () => {
    const content = editorRef.current ? editorRef.current.getContent() : policyContent
    if (!content.trim()) {
      toast.warning('Please enter user policy content')

      return
    }
    setSaving(true)
    try {
      const res = await client.post('/api/update_userPolicy', {
        user_policyDesc: content,
        policyStatus,
      }, { headers })
      if (res.data.msg === '201') {
        toast.success('User policy updated successfully')
      } else {
        toast.error(res.data.message || 'Failed to update')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (value) => setPolicyContent(value)

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>

  return (
    <Box>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1FAE5', color: '#10B981' }}>
                <ShieldLock />
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>User Policy</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Manage your platform privacy and user policy
                </Typography>
              </Box>
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
              <FormControl size='small' sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select label='Status' value={policyStatus} onChange={e => setPolicyStatus(e.target.value)}>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button variant='contained' onClick={handleSave} disabled={saving}
                startIcon={saving ? <CircularProgress size={16} color='inherit' /> : null}
                sx={{ borderRadius: 2, px: 4 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Alert severity='info' sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant='body2'>
              This content will be displayed to users on the Privacy Policy page. You can use HTML formatting for better presentation.
            </Typography>
          </Alert>

          {editorKey ? (
            <Editor
              apiKey={editorKey}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={policyContent}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family: Inter, sans-serif; font-size: 14px }',
              }}
            />
          ) : (
            <TextField
              fullWidth
              multiline
              rows={20}
              label='User Policy Content'
              value={policyContent}
              onChange={e => setPolicyContent(e.target.value)}
              placeholder='Enter your privacy policy here. HTML formatting is supported...'
              helperText={`${policyContent.length} characters`}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserPolicyView