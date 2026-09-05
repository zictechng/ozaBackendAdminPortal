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
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { styled } from '@mui/material/styles'
import {
  ArrowLeft,
  FileCheck,
  FileCancel,
  FileDocument,
  CheckCircle,
  CloseCircle,
  Clock,
} from 'mdi-material-ui'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

// ── Styled Components ─────────────────────────────
const DocumentImageBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  backgroundColor: theme.palette.action.hover,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    '& .image-overlay': {
      opacity: 1,
    },
  },
}))

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.2s ease',
}))

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

// ── Status config ─────────────────────────────────
const getStatusConfig = (status) => {
  const s = status?.toLowerCase()
  if (s === 'approved') return { color: 'success', icon: <CheckCircle fontSize='small' />, label: 'Approved' }
  if (s === 'rejected') return { color: 'error', icon: <CloseCircle fontSize='small' />, label: 'Rejected' }

  return { color: 'warning', icon: <Clock fontSize='small' />, label: 'Pending Review' }
}

// ── Info Row ──────────────────────────────────────
const InfoRow = ({ label, value, highlight }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    py: 1.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
    gap: 2,
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, minWidth: 130 }}>
      {label}
    </Typography>
    <Typography
      variant='body2'
      sx={{
        fontWeight: 600,
        textAlign: 'right',
        color: highlight || 'text.primary',
        wordBreak: 'break-word',
      }}>
      {value || '—'}
    </Typography>
  </Box>
)

// ── Activity Timeline Item ────────────────────────
const TimelineItem = ({ icon, title, desc, color }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
    <Box sx={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      backgroundColor: `${color}.light`,
      color: `${color}.main`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant='body2' sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant='caption' color='text.secondary'>{desc}</Typography>
    </Box>
  </Box>
)

// ── Main Component ────────────────────────────────
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

  // ── Image lightbox state ──────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const fetchDocument = async () => {
    if (!docId) return
    setLoading(true)
    try {
      const res = await client.get(`/api/adminGet_documentDetails/${docId}`, { headers })
      if (res.data.msg === '200') {
        setDocData(res.data.feedAll)
      } else {
        toast.error('Document not found')
      }
    } catch (e) {
      toast.error('Failed to load document details')
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
        toast.error(res?.data?.message || 'Action failed. Please try again.')
      }
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setActionLoading(false)
      setConfirmOpen(false)
      setConfirmAction(null)
    }
  }

  // ── Open document in new browser tab ─────────
  const openInBrowser = () => {
    if (docData?.document_url) {
      window.open(docData.document_url, '_blank', 'noopener,noreferrer')
    }
  }

  // ── Download document ─────────────────────────
  const downloadDocument = () => {
    if (docData?.document_url) {
      const link = document.createElement('a')
      link.href = docData.document_url
      link.download = `${docData.document_name || 'document'}_${docData.track_document || ''}`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const statusConfig = getStatusConfig(docData?.document_status)
  const isPending = docData?.document_status === 'Pending'

  // ── Loading State ─────────────────────────────
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: 3,
      }}>
        <CircularProgress size={52} thickness={4} />
        <Typography variant='body2' color='text.secondary'>
          Loading document details...
        </Typography>
      </Box>
    )
  }

  // ── Error State ───────────────────────────────
  if (!docData) {
    return (
      <Box sx={{ m: 6 }}>
        <Alert
          severity='error'
          sx={{ borderRadius: 2 }}
          action={
            <Button color='error' size='small' startIcon={<RefreshIcon />} onClick={fetchDocument}>
              Retry
            </Button>
          }>
          Document not found or failed to load. Please try again.
        </Alert>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      {/* ── Page Header ──────────────────────────── */}
      <Grid item xs={12}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 3,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant='h5' sx={{ fontWeight: 700 }}>
                Document Review
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                color={statusConfig.color}
                size='small'
                variant='filled'
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {docData.document_name} · Submitted by{' '}
              <Typography component='span' variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                {docData.owners_name}
              </Typography>
              {' '}· {moment(docData.createdOn).format('DD MMM YYYY')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant='outlined'
              startIcon={<FileDocument />}
              onClick={fetchDocument}
              disabled={loading}
              sx={{ borderRadius: 2 }}>
              Refresh
            </Button>
            <Button
              variant='outlined'
              startIcon={<ArrowLeft />}
              onClick={() => router.back()}
              sx={{ borderRadius: 2 }}>
              Back
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* ── Document Image ────────────────────────── */}
      <Grid item xs={12} md={7}>
        <StatCard>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FileDocument color='primary' />
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  Document Image
                </Typography>
              </Box>
            }
            subheader='Click the image to view full size or open in browser'
            action={
              docData.document_url && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title='Download document'>
                    <IconButton onClick={downloadDocument} size='small'>
                      <DownloadIcon fontSize='small' />         
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Open in new tab'>
                     <IconButton onClick={openInBrowser} size='small' color='primary'>
                      <OpenInNewIcon fontSize='small' />       
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          />
          <Divider />
          <CardContent sx={{ p: 4 }}>
            {docData.document_url ? (
              <>
                {/* ── Clickable Document Image ──────── */}
                <DocumentImageBox onClick={() => setLightboxOpen(true)}>
                  <Box
                    component='img'
                    src={docData.document_url}
                    alt={docData.document_name || 'Document'}
                    sx={{
                      width: '100%',
                      maxHeight: 480,
                      objectFit: 'contain',
                      display: 'block',
                      p: 2,
                    }}
                  />
                  <ImageOverlay className='image-overlay'>
                    <Tooltip title='View full size'>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: '#fff' },
                        }}
                        onClick={(e) => { e.stopPropagation(); setLightboxOpen(true) }}>
                        <ZoomInIcon /> 
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Open in browser'>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: '#fff' },
                        }}
                        onClick={(e) => { e.stopPropagation(); openInBrowser() }}>
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Download'>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: '#fff' },
                        }}
                        onClick={(e) => { e.stopPropagation(); downloadDocument() }}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </ImageOverlay>
                </DocumentImageBox>

                {/* ── Quick action links below image ── */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  mt: 2,
                }}>
                  <Button
                    size='small'
                    startIcon={<ZoomInIcon fontSize='small' />}
                    onClick={() => setLightboxOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}>
                    View Full Size
                  </Button>
                  <Button
                    size='small'
                    startIcon={<OpenInNewIcon fontSize='small' />}
                    onClick={openInBrowser}
                    sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Open in Browser
                  </Button>
                  <Button
                    size='small'
                    startIcon={<DownloadIcon fontSize='small' />}
                    onClick={downloadDocument}
                    sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Download
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{
                py: 10,
                textAlign: 'center',
                backgroundColor: 'action.hover',
                borderRadius: 2,
              }}>
                <FileDocument sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant='body2' color='text.secondary'>
                  No document image available
                </Typography>
              </Box>
            )}
          </CardContent>
        </StatCard>
      </Grid>

      {/* ── Right Column ─────────────────────────── */}
      <Grid item xs={12} md={5}>

        {/* Document Details */}
        <StatCard sx={{ mb: 4 }}>
          <CardHeader
            title={
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                Document Details
              </Typography>
            }
            subheader='Full information about this submission'
          />
          <Divider />
          <CardContent>
            <InfoRow label='Document ID' value={docData.track_document} />
            <InfoRow label='Owner Name' value={docData.owners_name} />
            <InfoRow label='Document Type' value={docData.document_name} />
            <InfoRow
              label='Status'
              value={
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  color={statusConfig.color}
                  size='small'
                  variant='filled'
                  sx={{ fontWeight: 600 }}
                />
              }
            />
            <InfoRow
              label='Submitted'
              value={moment(docData.createdOn).format('DD MMM YYYY, hh:mm A')}
            />
            {docData.approved_date && (
              <InfoRow
                label='Reviewed'
                value={moment(docData.approved_date).format('DD MMM YYYY, hh:mm A')}
              />
            )}
            {docData.reject_document_reason && (
              <InfoRow
                label='Rejection Reason'
                value={docData.reject_document_reason}
                highlight='error.main'
              />
            )}
          </CardContent>
        </StatCard>

        {/* Action Card */}
        <StatCard sx={{ mb: 4 }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Actions</Typography>}
            subheader='Review and take action on this document'
          />
          <Divider />
          <CardContent>
            {!isPending ? (
              <Alert
                severity={docData.document_status === 'Approved' ? 'success' : 'error'}
                icon={docData.document_status === 'Approved' ? <CheckCircle /> : <CloseCircle />}
                sx={{ borderRadius: 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Document {docData.document_status}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  This document has already been reviewed. No further action required.
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity='info' sx={{ borderRadius: 2, mb: 1 }}>
                  <Typography variant='caption'>
                    Review the document image carefully before approving or rejecting.
                  </Typography>
                </Alert>
                <Button
                  fullWidth
                  variant='contained'
                  color='success'
                  size='large'
                  startIcon={<FileCheck />}
                  onClick={() => handleAction('approve')}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    py: 1.5,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 2 },
                  }}>
                  Approve Document
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  color='error'
                  size='large'
                  startIcon={<FileCancel />}
                  onClick={() => handleAction('reject')}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    py: 1.5,
                  }}>
                  Reject Document
                </Button>
              </Box>
            )}
          </CardContent>
        </StatCard>

        {/* Activity Timeline */}
        <StatCard>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Activity</Typography>}
          />
          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TimelineItem
                icon={<FileDocument fontSize='small' />}
                title='Document Submitted'
                desc={moment(docData.createdOn).format('DD MMM YYYY, hh:mm A')}
                color='info'
              />
              {docData.document_status === 'Approved' && (
                <TimelineItem
                  icon={<CheckCircle fontSize='small' />}
                  title='Document Approved'
                  desc={docData.approved_date
                    ? moment(docData.approved_date).format('DD MMM YYYY, hh:mm A')
                    : 'Date not recorded'}
                  color='success'
                />
              )}
              {docData.document_status === 'Rejected' && (
                <TimelineItem
                  icon={<CloseCircle fontSize='small' />}
                  title='Document Rejected'
                  desc={docData.reject_document_reason || 'No reason provided'}
                  color='error'
                />
              )}
              {isPending && (
                <TimelineItem
                  icon={<Clock fontSize='small' />}
                  title='Awaiting Review'
                  desc='Pending admin action'
                  color='warning'
                />
              )}
            </Box>
          </CardContent>
        </StatCard>
      </Grid>

      {/* ── Lightbox Dialog ───────────────────────── */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth='lg'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#000',
          },
        }}>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          py: 1.5,
          px: 3,
        }}>
          <Typography variant='h6' sx={{ fontWeight: 600, color: '#fff' }}>
            {docData.document_name || 'Document'} — {docData.owners_name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title='Download'>
              <IconButton onClick={downloadDocument} sx={{ color: '#fff' }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Open in browser'>
              <IconButton onClick={openInBrowser} sx={{ color: '#fff' }}>
                <OpenInNewIcon  />
              </IconButton>
            </Tooltip>
            <Tooltip title='Close'>
              <IconButton onClick={() => setLightboxOpen(false)} sx={{ color: '#fff' }}>
                <CloseIcon  />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent sx={{
          p: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          backgroundColor: '#111',
        }}>
          <Box
            component='img'
            src={docData.document_url}
            alt={docData.document_name || 'Document'}
            sx={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ── Confirm Dialog ────────────────────────── */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null) }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction === 'approve' ? '✅ Approve Document' : '❌ Reject Document'}
        message={
          confirmAction === 'approve'
            ? `Are you sure you want to approve the ${docData.document_name} submitted by ${docData.owners_name}? The user will be notified immediately.`
            : `Are you sure you want to reject the ${docData.document_name} submitted by ${docData.owners_name}? The user will be notified immediately.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
        confirmColor={confirmAction === 'approve' ? 'success' : 'error'}
      />
    </Grid>
  )
}

export default DocumentViewPage