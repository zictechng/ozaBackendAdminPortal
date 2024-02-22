import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import client from 'src/@core/context/client'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import BeatLoader from "react-spinners/BeatLoader";
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import { Bounce, ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';
import { AuthContext } from 'src/@core/context/authContext';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const AppLogoView = () => {
  const router = useRouter()
  const {logo, setLogo, appLogoMain, setAppLogoMain} = useContext(AuthContext)

  const [loadingData, setLoadingData] = useState(false);
  const [updateLoadingData, setUpdateLoadingData] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const userTokenId = localStorage.getItem('userToken')

    // check user login authentication

    const userAuthCheck = () =>{
      const handleRedirect = PageRedirect('/pages/login')

      AuthenticateUserCheck(userTokenId).then((res)=>
        {
          if(res.status == '401'){
            router.replace(handleRedirect)
            localStorage.clear()
          }
          else if(res.status == '402'){
            router.replace(handleRedirect)
            localStorage.clear()
          }
         });
    }

   // get current user transaction stats here
  const [longDesc, setLongDesc] = useState("")
  const [appTitle, setAppTitle] = useState("")
  const [appTitleLocal, setAppTitleLocal] = useState()
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [appLogoSrc, setAppLogoScr] = useState('/images/avatars/1.png')
  const [image, setImage] = useState(null);
  const [mainLogo, setMainLogo] = useState(null);

  // const onChange = file => {
  //   const reader = new FileReader()
  //   const { files } = file.target
  //   const fileUpload = file.target.files[0]
  //   if (files && files.length !== 0) {
  //     reader.onload = () => setImgSrc(reader.result)

  //     reader.readAsDataURL(files[0])
  //     setImage((fileUpload));

  //     //console.log("Image loaded" , files)
  //   }
  // }

  function handleChange(e) {
    setImage(e.target.files[0]);
    setImgSrc(URL.createObjectURL(e.target.files[0]))
    setLogo(URL.createObjectURL(e.target.files[0]))
  }

  const resetImagePicker = () =>{
    setImgSrc('/images/avatars/1.png')
    setUpdateLoadingData(false)
  }

  function handleChangeMain(event) {
    setMainLogo(event.target.files[0]);
    setAppLogoScr(URL.createObjectURL(event.target.files[0]))
    setAppLogoMain(URL.createObjectURL(event.target.files[0]))
  }

  const resetMainImagePicker = () =>{
    setAppLogoScr('/images/avatars/1.png')
    setUpdateLoading(false)
  }

useEffect(() => {
  userAuthCheck()

  const getAppSetting = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/app_setting`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    let appTitleLocal = res.data.infoData;
    setLongDesc(res.data.feedAll[0]?.app_launch_desc)
    setAppTitle(res.data.feedAll[0]?.app_launch_title)
    setLogo(res.data.feedAll[0]?.app_logo)
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
const userLocal = localStorage.getItem('AppSettingData')

// get the editor api key from database via local storage

}, [userTokenId])

  // function to upload photo here
  const submitUpdate = async (e) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", image);

    if(image == undefined || image =='' || image ==null) {
      return toast.error('Please select file to upload',
          {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          newestOnTop: false,
          theme: "colored",
          });
          }

   setUpdateLoadingData(true)
    try {
      const res = await client.post(`/api/uploadApp_logo`, formData,{
      })
  if(res.data.msg =='201'){
    setLogo(res.data.info)
    toast.success(res.data.message,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          newestOnTop: false,
          theme: "light",
          });

    // setAppTitleLocal(res.data.infoData)
    // localStorage.setItem('AppSettingData',  JSON.stringify( appTitleLocal));

    }
    else if(res.data.status =='500'){
      toast.error(res.data.message, {
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
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setUpdateLoadingData(false)
    }
  }

  // here upload app logo
  const submitUpdateMain = async() => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", mainLogo);

    if(mainLogo == undefined || mainLogo =='' || mainLogo ==null) {
      return toast.error('Please select file to upload',
          {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          newestOnTop: false,
          theme: "colored",
          });
          }

      setUpdateLoading(true)
    try {
      const res = await client.post(`/api/uploadMain_logo`, formData,{
      })
  if(res.data.msg =='201'){
    setAppLogoMain(res.data.info)
    toast.success(res.data.message,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          newestOnTop: false,
          theme: "light",
          });

    // setAppTitleLocal(res.data.infoData)
    // localStorage.setItem('AppSettingData',  JSON.stringify( appTitleLocal));

    }
    else if(res.data.status =='500'){
      toast.error(res.data.message, {
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
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setUpdateLoading(false)
    }
  }
  console.log("New Logo" , mainLogo);

  return (
    <Grid item xs={12}>
    <Card>
      <Divider sx={{ margin: 0 }} />
      {loadingData ?
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={10}
                  margin={5}
                />
              </Box>
              :
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Information about the company logo
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={logo == '' || logo == null ? imgSrc: logo} alt='Profile Pic' />
                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload New Logo
                      <input
                        hidden
                        type='file'
                        onChange={handleChange}
                        accept='image/png, image/jpeg'
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => resetImagePicker()}
                    >
                      Reset
                    </ResetButtonStyled>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Email Logo: Allowed PNG or JPEG. Max size of 5MB.
                    </Typography>
                  </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={appLogoMain == '' || appLogoMain == null ? appLogoSrc: appLogoMain} alt='App Logo' />
                  <Box>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image2'>
                      Upload New App Logo
                      <input
                        hidden
                        type='file'
                        onChange={handleChangeMain}
                        accept='image/png, image/jpeg'
                        id='account-settings-upload-image2'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color='error'
                      variant='outlined'
                      onClick={() => resetMainImagePicker()}>
                      Reset
                    </ResetButtonStyled>
                      <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Application Logo: Allowed PNG or JPEG. Max size of 5MB.
                    </Typography>
                  </Box>
                </Box>
            </Grid>

            <Grid item xs={12} sm={10}>

            </Grid>

          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
          <Grid item>
              <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'
          onClick={() => submitUpdate()}
          disabled={updateLoadingData}>
           {updateLoadingData? <BtnLoaderIndicator /> : "Update Logo"}
          </Button>
          </Grid>

          <Grid item>
              <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'
          onClick={() => submitUpdateMain()}
          disabled={updateLoading}>
           {updateLoading? <BtnLoaderIndicator /> : "Update App Logo"}
          </Button>
          </Grid>
          </Grid>
        </CardActions>
      </form>
      }
    </Card>
      </Grid>

  )
}

export default AppLogoView
