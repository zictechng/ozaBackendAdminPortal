import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { ArrowLeft, FileCheck, FileCancel } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

import StatusBadge from 'src/@core/components/common/StatusBadge'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 600 }}>{value || 'N/A'}</Typography>
  </Box>
)

const DocumentViewPage = () => {
  const router = useRouter()
  const { docId } = router.query
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [docData, setDocData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchDocument = async () => {
    if (!docId) return
    setLoading(true)
    try {
      const res = await client.get(`/api/adminGet_documentDetails/${docId}`, { headers })
      if (res.data.msg === '200') {
        setDocData(res.data.feedAll)
      }
    } catch (e) {
      toast.error('Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (docId) fetchDocument()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId])

  const handleAction = (action) => {
    setConfirmAction(action)
    setConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    setActionLoading(true)
    try {
      const endpoint = confirmAction === 'approve'
        ? '/api/adminApprove_document'
        : '/api/adminRejected_documentUpload'

      const res = await client.post(endpoint, {
        doc_id: docId,
        user_id: docData?.user_id,
        doc_name: docData?.document_name,
      }, { headers })

      if (res?.data?.msg === '201' || res?.data?.msg === '200') {
        toast.success(`Document ${confirmAction === 'approve' ? 'approved' : 'rejected'} successfully`)
        fetchDocument()
      } else {
        toast.error(res?.data?.message || 'Action failed')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setActionLoading(false)
      setConfirmOpen(false)
      setConfirmAction(null)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (!docData) {
    return (
      <Alert severity='error' sx={{ m: 6 }}>
        Document not found or failed to load.
      </Alert>
    )
  }

  const isPending = docData.document_status === 'Pending'

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>Document Review</Typography>
            <Typography variant='body2' color='text.secondary'>
              {docData.document_name} — {docData.owners_name}
            </Typography>
          </Box>
          <Button variant='outlined' startIcon={<ArrowLeft />} onClick={() => router.back()}>
            Back
          </Button>
        </Box>
      </Grid>

      {/* Document Image */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Document Image</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Uploaded document for review</Typography>}
          />
          <Divider />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            {docData.document_url ? (
              <Box
                component='img'
                src={docData.document_url}
                alt='Document'
                sx={{
                  maxWidth: '100%',
                  maxHeight: 500,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>
                  No document image available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Document Details + Actions */}
      <Grid item xs={12} md={5}>
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Document Details</Typography>}
          />
          <Divider />
          <CardContent>
            <InfoRow label='Document ID' value={docData.track_document} />
            <InfoRow label='Owner Name' value={docData.owners_name} />
            <InfoRow label='Document Type' value={docData.document_name} />
            <InfoRow label='Status' value={
              <StatusBadge status={docData.document_status?.toLowerCase()} />
            } />
            <InfoRow label='Submitted' value={moment(docData.createdOn).format('DD MMM YYYY, hh:mm A')} />
            {docData.reject_document_reason && (
              <InfoRow label='Rejection Reason' value={docData.reject_document_reason} />
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Actions</Typography>}
            subheader={<Typography variant='body2' color='text.secondary'>Review and take action on this document</Typography>}
          />
          <Divider />
          <CardContent>
            {!isPending ? (
              <Alert severity={docData.document_status === 'Approved' ? 'success' : 'error'}>
                <Typography variant='body2'>
                  This document has been {docData.document_status?.toLowerCase()}.
                  No further action is required.
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant='contained'
                  color='success'
                  size='large'
                  startIcon={<FileCheck />}
                  onClick={() => handleAction('approve')}>
                  Approve Document
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  color='error'
                  size='large'
                  startIcon={<FileCancel />}
                  onClick={() => handleAction('reject')}>
                  Reject Document
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null) }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction === 'approve' ? 'Approve Document' : 'Reject Document'}
        message={
          confirmAction === 'approve'
            ? 'Are you sure you want to approve this document? The user will be notified.'
            : 'Are you sure you want to reject this document? The user will be notified.'
        }
        confirmLabel={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={confirmAction === 'approve' ? 'success' : 'error'}
      />
    </Grid>
  )
}

export default DocumentViewPage