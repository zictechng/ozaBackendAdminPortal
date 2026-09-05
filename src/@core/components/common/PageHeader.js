
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import MuiLink from '@mui/material/Link'

const PageHeader = ({ title, subtitle, breadcrumbs, action }) => {
  return (
    <Box sx={{ mb: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        {breadcrumbs && (
          <Breadcrumbs sx={{ mb: 1 }}>
            {breadcrumbs.map((crumb, i) =>
              crumb.href ? (
                <Link href={crumb.href} key={i} passHref>
                  <MuiLink underline='hover' color='inherit' variant='caption'>
                    {crumb.label}
                  </MuiLink>
                </Link>
              ) : (
                <Typography key={i} variant='caption' color='text.primary'>
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  )
}

export default PageHeader