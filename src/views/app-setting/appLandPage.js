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

const AppLandPageView = () => {
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
  const [longDesc, setLongDesc] = useState("")
  const [appTitle, setAppTitle] = useState("")

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
    setLongDesc(res.data.feedAll[0]?.app_launch_desc)
    setAppTitle(res.data.feedAll[0]?.app_launch_title)
    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
}
getAppSetting()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      "appTitle": appTitle,
      "appDesc": editorRef.current.getContent(),
    }

    if(data.appTitle == ''){
       return toast.warn('Please enter title',
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
      return toast.warn('Please enter a description',
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
      const res = await client.post(`/api/update_landPage`, data, {
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
                Information about the company user policy of the product
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
            <InputLabel id='form-layouts-separator-select-label'>App Landing Page Title</InputLabel>
            <FormControl fullWidth>
                <TextField
                  required
                  label="App Title"
                  name='appTitle'
                  defaultValue={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  type={'text'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={10}>
            <InputLabel id='form-layouts-separator-select-label'>App Landing Page Description</InputLabel>
              <FormControl>
              <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  placeholder="Landing Description"
                  initialValue={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',
                    'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
                    'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
                  ],
                  toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                  contentStyle: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
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

export default AppLandPageView
