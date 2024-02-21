import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { AuthContext } from 'src/@core/context/authContext';
import client from 'src/@core/context/client'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const ImgStyled = styled('img')(({ theme }) => ({
  width: 130,
  height: 100,
  marginRight: theme.spacing(6.25),
  marginTop: theme.spacing(3.30),
  borderRadius: theme.shape.borderRadius,

 // backgroundColor:"#1D2667",
}))

const VerticalNavHeader = props => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props

  const userLocal = localStorage.getItem('AppSettingData')
  const userTokenId = localStorage.getItem('userToken')
  const {appLogoMain, setAppLogoMain} = useContext(AuthContext)

  // get the editor api key from database via local storage

  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const getAppSetting = async() =>{
      setLoadingData(true);
      try {
        const res = await client.get(`/api/app_setting`, {
          headers: {
          'Authorization': 'Bearer '+userTokenId,
          }
        })
    if(res.data.msg =='201'){
      setAppLogoMain(res.data.feedAll[0]?.app_main_logo)
     }
      } catch (error) {
        console.log(error.message)
      }
      finally{
        setLoadingData(false)
      }
  }
  getAppSetting()

  // get local storage details
  }, [])


  // ** Hooks
  const theme = useTheme()

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
          <ImgStyled src={appLogoMain == '' || appLogoMain == null ? imgSrc: appLogoMain} alt='App_Logo' />
            {/* <Avatar
                alt={'Logo'}

                src={logo == '' || logo == null ? imgSrc : logo}
              /> */}
            <svg
              width={30}
              height={25}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'>
              </svg>
            <HeaderTitle variant='h6' sx={{ ml: 3 }}>
              {/* {appSettingDetails?.app_name} */}
            </HeaderTitle>
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
