// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const userLocal = localStorage.getItem('AppSettingData')

//console.log("Local ", userLocal);

// get the editor api key from database via local storage
const appSettingDetails = JSON.parse(userLocal)

  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, ${appSettingDetails?.app_name}` + ` App `}
        {/* <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box> */}
        {` by `}
        <Link target='_blank' href='https://zictech-ng.com/'>
          Zictech Technologies
        </Link>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link
            target='_blank'
            href=''>
            Support
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
