// ** React Imports
import { useState, useContext, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Hook Import
import { AuthContext } from 'src/@core/context/authContext'
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import client from 'src/@core/context/client'

  // minified version is also included
  // import 'react-toastify/dist/ReactToastify.min.css';

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 130,
  height: 100,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,

 // backgroundColor:"#1D2667",
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    email: '',
    showPassword: false
  })

  const [authenticateUser, setAuthenticateUser] = useState(false)
  const [loginForm, setLoginForm] = useState(false)

  const {test, isLoading, isButtonLoading, loginAction} = useContext(AuthContext)

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const [loadingData, setLoadingData] = useState(false);
  const [appLogoMain, setAppLogoMain] = useState('')

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleLoginAction = () => {
    event.preventDefault()

    // console.log(' details ', values.password, values.email)
    if(values.password == '' || values.email == ''){
      return toast.warning('Password or email missing', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

    loginAction(values.email, values.password)
  }


  useEffect(() => {
    // check if user has already logged in and redirect to home page
    let isAuth = localStorage.getItem('userToken')
    if(isAuth && isAuth !== null) {
      setAuthenticateUser(true)
      setLoginForm(false)
       router.push('/')
    }

    // reset the login to visible state
    else if(isAuth == '' || isAuth == null){
      setLoginForm(true)
    }

    const getAppSetting = async() =>{
      setLoadingData(true);
      try {
        const res = await client.get(`/api/app_settingPage`)
    if(res.data.msg =='201'){
      setAppLogoMain(res.data.feedAll[0]?.app_main_logo)
      console.log('Logo ', res.data.feedAll[0]?.app_main_logo)
     }
      } catch (error) {
        console.log(error.message)
      }
      finally{
        setLoadingData(false)
      }
  }
  getAppSetting()

 }, [router])

  return (
    <Box className='content-center'>
        {authenticateUser && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ScaleLoader
                color={'#1D2667'}
                loading={true}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </Box>
          )}
      {loginForm &&
      <Card sx={{ zIndex: 1 }}>

        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loadingData ?
              <ScaleLoader
                color={'#1D2667'}
                loading={true}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />:
              <ImgStyled src={appLogoMain == '' || appLogoMain == null ? "Oza App": appLogoMain} alt='App_Logo' />
              }
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}
            </Typography>
            <Typography variant='body2'>Please sign-in to admin control panel</Typography>
          </Box>
          <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
          />
          <form noValidate autoComplete='off'>
            {/* <TextField autoFocus fullWidth id='email' label='Email' sx={{ marginBottom: 4 }} /> */}
            <FormControl fullWidth sx={{ marginBottom: 8 }}>
              <InputLabel autoFocus htmlFor='auth-login-email'>Email</InputLabel>
              <OutlinedInput
                label='Email Address'
                value={values.email}
                id='auth-login-email'
                onChange={handleChange('email')}

                //onChange={e => setUsernameReg(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}

                //onChange={e => setUsernameReg(e.target.value)}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link>
            </Box>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={() => handleLoginAction()}>

              {isButtonLoading == true ? 'Loading...': 'Login'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Don't have login details?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='#'>
                  <LinkStyled>Contact Admin</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}></Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/*<Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
               <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>

              <Link href='/' passHref>
                <IconButton component='a' onClick={e => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link> */}
            </Box>
          </form>
        </CardContent>

      </Card>
      }

      {loginForm && <FooterIllustrationsV1 /> }
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
