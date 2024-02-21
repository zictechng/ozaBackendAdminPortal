import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import UserProvider from 'src/@core/context/userProvider'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  // const userLocal = localStorage?.getItem('AppSettingData')
  // const userTokenId = localStorage?.getItem('userToken')
  // const appSettingDetails = JSON.parse(userLocal)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [appDetails, setAppDetails] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // useEffect(() => {
  //   const getAppSetting = async() =>{
  //     setLoadingData(true);
  //     try {
  //       const res = await client.get(`/api/app_setting`, {
  //         headers: {
  //         'Authorization': 'Bearer '+userTokenId,
  //         }
  //       })

  //     console.log('Pending users ' , res.data.feedAll);
  //   if(res.data.msg =='201'){
  //     setLongDesc(res.data.feedAll[0]?.app_launch_desc)
  //     setAppTitle(res.data.feedAll[0]?.app_launch_title)
  //     setAppDetails(res.data.feedAll)
  //     }
  //     } catch (error) {
  //       console.log(error.message)
  //     }
  //     finally{
  //       setLoadingData(false)
  //     }
  // }
  // getAppSetting()

  // // get local storage details
  // const userLocal = localStorage.getItem('AppSettingData')

  // // get the editor api key from database via local storage
  // const appSettingDetails = JSON.parse(userLocal)

  // //setLogo(appSettingDetails?.app_logo)

  // }, [])

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{ `${'Oza'} Mobile Admin`}</title>
        <meta
          name='description'
          content={`${'Oza'} – Most reliable and profitable way to sale and buy virtual funds – is the most friendly & highly profitable system you can trust with all your virtual funds deals on the go.`}
        />
        <meta name='keywords' content='Online business, Virtual funds, Sale paypal funds, Bitcoin, Payoneer, Work from home' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <UserProvider>
      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
      </UserProvider>
    </CacheProvider>
  )
}

export default App
