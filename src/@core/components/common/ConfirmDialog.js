
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel, confirmColor, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title || 'Confirm Action'}</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary'>
          {message || 'Are you sure you want to proceed?'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant='outlined' color='inherit' disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color={confirmColor || 'primary'}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color='inherit' /> : null}>
          {loading ? 'Processing...' : (confirmLabel || 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog