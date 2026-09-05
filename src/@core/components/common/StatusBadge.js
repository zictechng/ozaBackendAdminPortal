
import Chip from '@mui/material/Chip'

const statusConfig = {
  active:     { label: 'Active',     color: 'success' },
  pending:    { label: 'Pending',    color: 'warning' },
  suspended:  { label: 'Suspended',  color: 'error'   },
  inactive:   { label: 'Inactive',   color: 'default' },
  approved:   { label: 'Approved',   color: 'success' },
  rejected:   { label: 'Rejected',   color: 'error'   },
  completed:  { label: 'Completed',  color: 'success' },
  failed:     { label: 'Failed',     color: 'error'   },
  success:    { label: 'Success',    color: 'success' },
  refunded:   { label: 'Refunded',   color: 'info'    },
  paused:     { label: 'Paused',     color: 'warning' },
  hidden:     { label: 'Hidden',     color: 'default' },
}

const StatusBadge = ({ status, customLabel }) => {
  const key = (status || '').toLowerCase()
  const config = statusConfig[key] || { label: status || 'Unknown', color: 'default' }

  return (
    <Chip
      label={customLabel || config.label}
      color={config.color}
      size='small'
      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
    />
  )
}

export default StatusBadge