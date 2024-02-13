// ** React Imports
import { useState, useContext, useEffect, } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Components
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AuthContext } from '../context/authContext'
import ScaleLoader from "react-spinners/ScaleLoader";
import { AuthenticateUserCheck, PageRedirect } from '../function/controlFunction'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import client from '../context/client'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  const router = useRouter()

  // ** Props
  const { settings, children, scrollToTop } = props

  const {userInfo, setUserInfo, userToken, setUserToken} = useContext(AuthContext)

  // ** Vars
  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize

  // ** States
  const [navVisible, setNavVisible] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [notifyStatus, setNotifyStatus] = useState('')

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)
  const authorizedUser = PageRedirect('/pages/login')

    useEffect(() =>{
      const userLocal = localStorage.getItem('userToken')
      const userInfo = localStorage.getItem('userInfo')

      const verifyUserLogin =  ()=>{
        let verifyToken = AuthenticateUserCheck(userLocal)

        //console.log("Toke check ", verifyToken)
        verifyToken.then(function(result){

          console.log("check Auth ", result)

          if(result?.status =='402'){
            router.push(authorizedUser)
            localStorage.clear()
            toast.error('Error! Session expired, login again', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
           }
           else if(result?.status == '401'){
            router.push(authorizedUser)
            localStorage.clear()
            toast.error('Failed! Please login required', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
           }
           else{
            //console.log("Authenticated Successfully");
            }

        })
        setPageLoading(false);
        }

      const setUserToken = localStorage.getItem('userToken')
      if (userLocal == null || userLocal == '') {
          router.push(authorizedUser)

          //console.log('Login access denied');
      }

         setTimeout(async() =>{
          verifyUserLogin()

       }, 2000)

    }, [authorizedUser, router])

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {!pageLoading && <Navigation
          navWidth={navWidth}
          navVisible={navVisible}
          setNavVisible={setNavVisible}
          toggleNavVisibility={toggleNavVisibility}
          {...props}
        />}

        <MainContentWrapper className='layout-content-wrapper'>
        {pageLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:110, }}>
              <ScaleLoader
                color={'#1D2667'}
                loading={true}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </Box>
          ):
          <>
          <AppBar toggleNavVisibility={toggleNavVisibility} {...props} />
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          <Footer {...props} />

          <DatePickerWrapper sx={{ zIndex: 11 }}>
            <Box id='react-datepicker-portal'></Box>
          </DatePickerWrapper>
          </>
          }
        </MainContentWrapper>
     </VerticalLayoutWrapper>

      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default VerticalLayout
