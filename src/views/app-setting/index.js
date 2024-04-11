import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import client from 'src/@core/context/client'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import BeatLoader from "react-spinners/BeatLoader";
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
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

const AppSettingsView = () => {
  const router = useRouter()
  const [loadingData, setLoadingData] = useState(false);
  const [updateLoadingData, setUpdateLoadingData] = useState(false);
  const userTokenId = localStorage.getItem('userToken')

  const editorRef = useRef(null);

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

  const [appName, setAppName] = useState("")
  const [shortName, setShortName] = useState("")
  const [appVersion, setAppVersion] = useState("")
  const [updateShowIcon, setUpdateShowIcon] = useState("")
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateNote, setUpdateNote] = useState("")
  const [updateBtnText, setUpdateBtnText] = useState("")

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
    //console.log('App users ' , res.data);
    setAppName(res.data.feedAll[0]?.app_name)
    setShortName(res.data.feedAll[0]?.app_short_name)
    setAppVersion(res.data.feedAll[0]?.app_version)
    setAppVersion(res.data.feedAll[0]?.app_updateTitle)
    setAppVersion(res.data.feedAll[0]?.app_updateShowIcon)
    setAppVersion(res.data.feedAll[0]?.app_update_btn_text)
    setAppVersion(res.data.feedAll[0]?.app_update_note)
    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
}

// get local storage details
const userLocal = localStorage.getItem('userToken')
getAppSetting()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      "appDesc": editorRef.current.getContent(),
      "appName": appName,
      "appVersion": appVersion,
      "updateIcon": updateShowIcon,
      "updateTitle": updateTitle,
      "updateNote": updateNote,
      "updateBtnText": updateBtnText,
    }

    if(data.appName == ''){
       return toast.warn('Please enter App Name',
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
    if(data.appDesc == ''){
      return toast.warn('Please enter short description',
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
      const res = await client.post(`/api/update_appName`, data, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })
  if(res.data.msg =='201'){
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
                Information about the app and update Notifications
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>App Name</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="Enter App Name"
                  name='company_name'
                  defaultValue={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>App Version</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="Enter App Version"
                  name='appVersion'
                  defaultValue={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
            <InputLabel id='form-layouts-separator-select-label'>Short Description [This will show in the app dashboard heading]</InputLabel>
            {/* <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Personal Info
              </Typography> */}
              <FormControl>

              <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  placeholder="User Policy"
                  initialValue={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  init={{
                  height: 200,
                  menubar: false,
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist indent outdent | emoticons charmap | removeformat|backcolor |'
                  +'| casechange blocks|a11ycheck code table',
                  contentStyle: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <br/>
              <Typography variant='body2' sx={{ fontWeight: 900, color:'#1D2667', fontSize:20 }}>
              App Update Notification Setup
              </Typography>
              <Divider sx={{ margin: 0 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Update Title</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="Enter Update Title"
                  name='update_title'
                  defaultValue={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Update Note</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="Enter Update Note"
                  name='update_note'
                  defaultValue={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Button Text</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="Enter Button Text"
                  name='update_btn_text'
                  defaultValue={updateBtnText}
                  onChange={(e) => setUpdateBtnText(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>Show Icon</InputLabel>
            <FormControl fullWidth>
            <Select
                  label='Paypal Sale Status'
                  defaultValue={updateShowIcon}
                  id='form-layouts-separator-select'
                  onChange={(e) => setUpdateShowIcon(e.target.value)}
                  labelId='form-layouts-separator-select-label'>
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Pending</MenuItem>
             </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'
          onClick={() => submitUpdate()}
          disabled={updateLoadingData}>

            {updateLoadingData? <BtnLoaderIndicator /> : "Update"}
          </Button>
        </CardActions>
      </form>
      }
    </Card>
      </Grid>
  )
}

export default AppSettingsView
