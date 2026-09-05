
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const StatsCard = ({ title, value, subtitle, icon, iconColor, iconBg, trend, trendValue }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant='h5' sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography
                  variant='caption'
                  sx={{ color: trend === 'up' ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  {trend === 'up' ? '+' : '-'}{trendValue}
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: iconBg || 'primary.light',
              color: iconColor || 'primary.main',
              flexShrink: 0,
            }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsCard