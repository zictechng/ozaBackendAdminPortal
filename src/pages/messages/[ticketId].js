
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { ArrowLeft, CheckCircle } from 'mdi-material-ui'
import SendIcon from '@mui/icons-material/Send'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PageHeader from 'src/@core/components/common/PageHeader'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const ticketStatusColor = (status) => {
  const s = status?.toLowerCase()
  if (s === 'completed' || s === 'closed') return 'success'
  if (s === 'replied' || s === 'ongoing') return 'warning'

  return 'default'
}

const InfoItem = ({ label, value }) => (
  <Box sx={{ textAlign: 'center', px: 2 }}>
    <Typography variant='body2' color='text.secondary'>{label}</Typography>
    <Typography variant='body2' sx={{ fontWeight: 700 }}>{value || '—'}</Typography>
  </Box>
)

const TicketDetailPage = () => {
  const router = useRouter()
  const { ticketId } = router.query
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [closing, setClosing] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const bottomRef = useRef(null)

  const fetchTicket = async () => {
    if (!ticketId) return
    setLoading(true)
    try {
      const res = await client.get(`/api/getUser_message/${ticketId}`, { headers })
      if (res.data.msg === '201') setTicket(res.data.feedAll)
      else toast.error('Failed to load ticket')
    } catch (e) {
      toast.error('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ticketId) fetchTicket()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.replies])

  const handleReply = async () => {
    if (!replyText.trim()) 
        { toast.warning('Please enter a reply');

        return 
        }
    setReplying(true)
    try {
      const res = await client.post('/api/messageFeedback_send', {
        tran_id: ticketId,
        sendMessage: replyText.trim(),
        feedback_message: replyText.trim(),
      }, { headers })
      if (res.data.msg === '201') {
        toast.success('Reply sent successfully')
        setReplyText('')
        fetchTicket()
      } else {
        toast.error(res.data.message || 'Failed to send reply')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setReplying(false)
    }
  }

  const handleCloseTicket = async () => {
    setClosing(true)
    try {
      const res = await client.post('/api/closeUserTicket_message', {
        tran_id: ticketId,
      }, { headers })
      if (res.data.msg === '201') {
        toast.success('Ticket closed successfully')
        fetchTicket()
      } else {
        toast.error(res.data.message || 'Failed to close ticket')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setClosing(false)
    }
  }

  const isClosed = ticket?.ticket_closed === 'Completed' || ticket?.ticket_closed === 'Closed'
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (!ticket) {
    return <Alert severity='error' sx={{ m: 6 }}>Ticket not found.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      <Grid item xs={12}>
        <PageHeader
          title={`Ticket #${ticket.tick_id}`}
          subtitle={ticket.subject}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Support Tickets', href: '/messages' },
            { label: `#${ticket.tick_id}` },
          ]}
          action={
            <Button variant='outlined' startIcon={<ArrowLeft />} onClick={() => router.back()}>
              Back
            </Button>
          }
        />
      </Grid>

      {/* Left — Ticket Info */}
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}>
                {getInitials(ticket.sender_name)}
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {ticket.sender_name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>{ticket.email}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Ticket Meta */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <InfoItem label='Status' value={
                <Chip
                  label={ticket.ticket_closed || 'Opened'}
                  size='small'
                  color={ticketStatusColor(ticket.ticket_closed)}
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              } />
              <Divider orientation='vertical' flexItem />
              <InfoItem label='Type' value={ticket.ticket_type} />
              <Divider orientation='vertical' flexItem />
              <InfoItem label='Replies' value={ticket.replies?.length || 0} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>Submitted</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {moment(ticket.createdOn).format('DD MMM YYYY')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>Last Reply</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {ticket.tick_response_date
                    ? moment(ticket.tick_response_date).format('DD MMM YYYY')
                    : 'No reply yet'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>Ticket ID</Typography>
                <Typography variant='body2' sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                  #{ticket.tick_id}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            {!isClosed ? (
              <Button
                fullWidth
                variant='outlined'
                color='error'
                startIcon={closing ? <CircularProgress size={14} color='inherit' /> : <CheckCircle />}
                disabled={closing}
                onClick={() => setConfirmClose(true)}>
                {closing ? 'Closing...' : 'Close Ticket'}
              </Button>
            ) : (
              <Alert severity='success' sx={{ borderRadius: 2 }}>
                <Typography variant='body2'>Ticket has been closed.</Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Right — Conversation */}
      <Grid item xs={12} md={8}>
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>
          <CardHeader
            title={<Typography variant='h6' sx={{ fontWeight: 700 }}>Conversation</Typography>}
            subheader={
              <Typography variant='body2' color='text.secondary'>
                {ticket.subject}
              </Typography>
            }
          />
          <Divider />

          {/* Chat Area */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Original Message */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.400', fontSize: '0.8rem', flexShrink: 0 }}>
                {getInitials(ticket.sender_name)}
              </Avatar>
              <Box sx={{ maxWidth: '75%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>{ticket.sender_name}</Typography>
                  <Typography variant='body2' color='text.disabled' sx={{ fontSize: '0.72rem' }}>
                    {moment(ticket.createdOn).format('DD MMM, hh:mm A')}
                  </Typography>
                  <Chip label='Original' size='small' variant='outlined' sx={{ fontSize: '0.65rem', height: 18 }} />
                </Box>
                <Box sx={{
                  p: 2, borderRadius: '0 12px 12px 12px',
                  backgroundColor: 'action.hover',
                  border: '1px solid', borderColor: 'divider',
                }}>
                  <Typography variant='body2' sx={{ lineHeight: 1.8 }}>{ticket.ticket_message}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Reply Thread */}
            {ticket.replies?.map((reply, i) => {
              const isAdmin = reply.sender === 'admin'

              return (
                <Box key={i} sx={{
                  display: 'flex',
                  flexDirection: isAdmin ? 'row-reverse' : 'row',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}>
                  <Avatar sx={{
                    width: 36, height: 36, flexShrink: 0,
                    bgcolor: isAdmin ? 'primary.main' : 'grey.400',
                    fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    {isAdmin ? 'A' : getInitials(ticket.sender_name)}
                  </Avatar>
                  <Box sx={{ maxWidth: '75%' }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1, mb: 0.5,
                      flexDirection: isAdmin ? 'row-reverse' : 'row',
                    }}>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {reply.sender_name}
                      </Typography>
                      <Typography variant='body2' sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>
                        {moment(reply.sent_at).format('DD MMM, hh:mm A')}
                      </Typography>
                    </Box>
                    <Box sx={{
                      p: 2,
                      borderRadius: isAdmin ? '12px 0 12px 12px' : '0 12px 12px 12px',
                      backgroundColor: isAdmin ? 'primary.main' : 'action.hover',
                      border: isAdmin ? 'none' : '1px solid',
                      borderColor: 'divider',
                    }}>
                      <Typography variant='body2' sx={{ lineHeight: 1.8, color: isAdmin ? '#ffffff' : 'text.primary' }}>
                        {reply.message}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}

            <div ref={bottomRef} />
          </Box>

          <Divider />

          {/* Reply Input */}
          <Box sx={{ p: 3 }}>
            {isClosed ? (
              <Alert severity='success' sx={{ borderRadius: 2 }}>
                <Typography variant='body2'>
                  This ticket is closed. No further replies can be sent.
                </Typography>
              </Alert>
            ) : (
              <>
                <Alert severity='info' sx={{ mb: 2, borderRadius: 2, py: 0 }}>
                  <Typography variant='body2'>
                    Your reply will be sent to the user by email and saved to their account.
                    The user will be instructed to reply via their account only.
                  </Typography>
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size='small'
                    placeholder='Type your reply...'
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.ctrlKey) handleReply()
                    }}
                  />
                  <Tooltip title='Send Reply (Ctrl+Enter)'>
                    <span>
                      <Button
                        variant='contained'
                        onClick={handleReply}
                        disabled={replying || !replyText.trim()}
                        sx={{ height: 56, minWidth: 56, borderRadius: 2 }}>
                        {replying
                          ? <CircularProgress size={20} color='inherit' />
                          : <SendIcon />}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
                <Typography variant='body2' color='text.disabled' sx={{ mt: 1 }}>
                  Press Ctrl + Enter to send
                </Typography>
              </>
            )}
          </Box>
        </Card>
      </Grid>
      
    <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => { setConfirmClose(false); handleCloseTicket() }}
        loading={closing}
        title='Close Ticket'
        message='Are you sure you want to close this ticket? This action cannot be undone and the user will no longer be able to receive replies.'
        confirmLabel='Close Ticket'
        confirmColor='error'
      />
</Grid>
  )
}

export default TicketDetailPage