// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = () => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Today Sale </Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          All daily transactions overview
        </Typography>
        <Typography variant='h5' sx={{ my: 6, color: 'primary.main' }}>

        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 600, fontSize: '2.125rem', color: 'primary.main' }}>
            $24,895
          </Typography>
          {/* <Box sx={{ display: 'flex', alignItems:'flex-end', color: 'success.main' }}>
              <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'info.main'
              }}
            >
              <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
            </Avatar>

          </Box> */}
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>

            </Typography>
          </Box>
        </Box>

        </Typography>
        <Button size='small' variant='contained'>
          View Sales
        </Button>

        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        {/* <TrophyImg alt='trophy' src='/images/misc/trophy.png' /> */}

      </CardContent>
    </Card>
  )
}

export default Trophy
