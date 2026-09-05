
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FileDocumentOutline } from 'mdi-material-ui'

const EmptyState = ({ title, message, icon }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, px: 4 }}>
      <Box sx={{ color: 'text.disabled', mb: 2 }}>
        {icon || <FileDocumentOutline sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
        {title || 'No Records Found'}
      </Typography>
      <Typography variant='body2' sx={{ color: 'text.disabled', textAlign: 'center', maxWidth: 300 }}>
        {message || 'There are no records to display at this time.'}
      </Typography>
    </Box>
  )
}

export default EmptyState