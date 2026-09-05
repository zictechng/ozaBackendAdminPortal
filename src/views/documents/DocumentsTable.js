
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Magnify, DotsVertical, Eye, FileCheck, FileCancel } from 'mdi-material-ui'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import StatusBadge from 'src/@core/components/common/StatusBadge'
import EmptyState from 'src/@core/components/common/EmptyState'
import ConfirmDialog from 'src/@core/components/common/ConfirmDialog'
import client from 'src/@core/context/client'

const endpointMap = {
  approved: '/api/approvedDocument_details',
  pending:  '/api/pendingDocument_details',
  rejected: '/api/rejectedDocument_details',
}

const RowActions = ({ doc, onAction, docType }) => {
  const [anchor, setAnchor] = useState(null)

  return (
    <>
      <Tooltip title='Actions'>
        <IconButton size='small' onClick={e => setAnchor(e.currentTarget)}>
          <DotsVertical fontSize='small' />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { minWidth: 180, boxShadow: 3 } }}>
        <MenuItem onClick={() => { setAnchor(null); onAction('view', doc) }}>
          <Eye fontSize='small' sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant='body2'>View Document</Typography>
        </MenuItem>
        {docType === 'pending' && (
          <>
            <MenuItem onClick={() => { setAnchor(null); onAction('approve', doc) }}>
              <FileCheck fontSize='small' sx={{ mr: 1.5, color: 'success.main' }} />
              <Typography variant='body2' color='success.main'>Approve</Typography>
            </MenuItem>
            <MenuItem onClick={() => { setAnchor(null); onAction('reject', doc) }}>
              <FileCancel fontSize='small' sx={{ mr: 1.5, color: 'error.main' }} />
              <Typography variant='body2' color='error.main'>Reject</Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  )
}

const DocumentsTable = ({ docType = 'pending' }) => {
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : ''
  const headers = { Authorization: 'Bearer ' + token }

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const pageLimit = 15

  const fetchDocuments = async (pageNum = 1) => {
    setLoading(true)
    try {
      const res = await client.get(
        `${endpointMap[docType]}?pageNumber=${pageNum}&pageLimit=${pageLimit}`,
        { headers }
      )
      if (res.data.msg === '201') {
        setDocuments(res.data.feedAll || [])
        setTotalPages(res.data.totalPage || 1)
        setTotal(res.data.totalCount || res.data.feedAll?.length || 0)
      }
    } catch (e) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) { fetchDocuments(1); 
        
        return 
    }
    setSearchLoading(true)
    try {
      const res = await client.post(
        '/api/searchUsersDocument_database',
        { dataInfo: search.trim() },
        { headers }
      )
      if (res.data.msg === '201') {
        router.push(`/documents/view-document/${res.data.feedAll._id}`)
      } else {
        toast.warning(res.data.message || 'No document found')
      }
    } catch (e) {
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleAction = (action, doc) => {
    if (action === 'view') {
      router.push(`/documents/view-document/${doc._id}`)

      return
    }
    setConfirmAction({ action, doc })
    setConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return
    const { action, doc } = confirmAction
    setActionLoading(true)
    try {
      let res
      if (action === 'approve') {
        res = await client.post('/api/adminApprove_document',
          { doc_id: doc._id, user_id: doc.user_id }, { headers })
      } else if (action === 'reject') {
        res = await client.post('/api/adminRejected_documentUpload',
          { doc_id: doc._id, user_id: doc.user_id }, { headers })
      }
      if (res?.data?.msg === '200') {
        toast.success(`Document ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
        fetchDocuments(page)
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

  const handlePageChange = (e, value) => {
    setPage(value)
    fetchDocuments(value)
  }

  useEffect(() => {
    fetchDocuments(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType])

  return (
    <Card>
      <ToastContainer position='top-right' autoClose={3000} />
      <CardHeader
        title={
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            {docType.charAt(0).toUpperCase() + docType.slice(1)} Documents
            {total > 0 && (
              <Typography component='span' variant='body2'
                sx={{ ml: 1.5, color: 'text.secondary', fontWeight: 400 }}>
                ({total.toLocaleString()} total)
              </Typography>
            )}
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size='small'
              placeholder='Search by name or email'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Magnify fontSize='small' />
                  </InputAdornment>
                ),
                endAdornment: searchLoading
                  ? <InputAdornment position='end'><CircularProgress size={16} /></InputAdornment>
                  : null,
              }}
            />
            <Button variant='contained' size='small' onClick={handleSearch} disabled={searchLoading}>
              Search
            </Button>
          </Box>
        }
      />
      <Divider />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <EmptyState
          title='No Documents Found'
          message={`No ${docType} documents found in the system.`}
        />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>User</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Document Type</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Tag ID</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Status</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Submitted</Typography></TableCell>
                  <TableCell><Typography variant='body2' sx={{ fontWeight: 700 }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                          {doc.user_name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {doc.user_name || 'Unknown'}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {doc.user_email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {doc.doc_type || doc.document_type || 'KYC Document'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {doc.user_tag || doc.tag_id || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={doc.doc_status?.toLowerCase() || docType} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {moment(doc.createdOn).format('DD MMM, YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <RowActions doc={doc} onAction={handleAction} docType={docType} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              Page {page} of {totalPages}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color='primary'
              shape='rounded'
            />
          </Box>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmAction(null) }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmAction?.action === 'approve' ? 'Approve Document' : 'Reject Document'}
        message={
          confirmAction?.action === 'approve'
            ? 'Are you sure you want to approve this document? The user will be notified.'
            : 'Are you sure you want to reject this document? The user will be notified.'
        }
        confirmLabel={confirmAction?.action === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={confirmAction?.action === 'approve' ? 'success' : 'error'}
      />
    </Card>
  )
}

export default DocumentsTable