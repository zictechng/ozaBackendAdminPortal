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
import { ScaleBalance } from 'mdi-material-ui'
import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import client from 'src/@core/context/client'

const TermsConditionsView = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const editorRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [termsContent, setTermsContent] = useState('')
  const [termStatus, setTermStatus] = useState('Active')
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
        setTermsContent(res.data.feedAll[0]?.company_term_conditions || '')
        setTermStatus(res.data.feedAll[0]?.term_status || 'Active')
      }
    } catch (e) {
      toast.error('Failed to load terms')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const content = editorRef.current ? editorRef.current.getContent() : termsContent
    if (!content.trim()) {
      toast.warning('Please enter terms and conditions content')

      return
    }
    setSaving(true)
    try {
      const res = await client.post('/api/update_termCondition', {
        desc: content,
        termStatus,
      }, { headers })
      if (res.data.msg === '201') {
        toast.success('Terms and conditions updated successfully')
      } else {
        toast.error(res.data.message || 'Failed to update')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

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
              <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', color: '#4C5FD5' }}>
                <ScaleBalance />
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>Terms & Conditions</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Manage your platform terms and conditions
                </Typography>
              </Box>
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 2 }}>
              <FormControl size='small' sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select label='Status' value={termStatus} onChange={e => setTermStatus(e.target.value)}>
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
              This content will be displayed to users on the Terms & Conditions page. You can use HTML formatting for better presentation.
            </Typography>
          </Alert>

          {editorKey ? (
            <Editor
              apiKey={editorKey}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={termsContent}
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
              label='Terms & Conditions Content'
              value={termsContent}
              onChange={e => setTermsContent(e.target.value)}
              placeholder='Enter your terms and conditions here. HTML formatting is supported...'
              helperText={`${termsContent.length} characters`}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default TermsConditionsView