import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import client from 'src/@core/context/client'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import BeatLoader from "react-spinners/BeatLoader";
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Bounce, ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';
import Select from '@mui/material/Select'

const UserPolicyView = () => {
  const router = useRouter()
  const [loadingData, setLoadingData] = useState(false);
  const [updateLoadingData, setUpdateLoadingData] = useState(false);
  const [textEditorKey, setTextEditorKey] = useState('');
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

  const [termsCondition, setTermCondition] = useState("")
  const [policyStatus, setPolicyStatus] = useState("")


useEffect(() => {
  userAuthCheck()

  const getUserPolicy = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/allAbout_us`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    console.log('Pending users ' , res.data.policy_status);
  if(res.data.msg =='201'){
     setTermCondition(res.data.feedAll[0]?.company_privacy_policy)
     setPolicyStatus(res.data.feedAll[0]?.policy_status)

    }
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setLoadingData(false)
    }
}

// get local storage details
const userLocal = localStorage.getItem('AppSettingData')

// get the editor api key from database via local storage
const appSettingDetails = JSON.parse(userLocal)
setTextEditorKey(appSettingDetails.app_textEditor_key)

getUserPolicy()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      "user_policyDesc": editorRef.current.getContent(),
      "policyStatus": policyStatus
    }

    if(data.user_policyDesc == ''){
       return toast.warn('Please enter a user policy content',
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
    if(data.policy_status == ''){
      return toast.warn('Please select policy status',
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
      const res = await client.post(`/api/update_userPolicy`, data, {
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
            <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Status</InputLabel>
                <Select
                  label='Status'
                  defaultValue={policyStatus}
                  id='form-layouts-separator-select'
                  onChange={(e) => setPolicyStatus(e.target.value)}
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value=''></MenuItem>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={10}>
              <FormControl>
              <Editor
                apiKey='ejtsvhwpodr92mffqzn9yhr7oo4xjfw4tmy4eycq8jagks5u'
                onInit={(evt, editor) => editorRef.current = editor}
                placeholder="User Policy"
                initialValue={termsCondition}
                onChange={(e) => setTermCondition(e.target.value)}
                init={{
                height: 500,
                menubar: false,
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist indent outdent | emoticons charmap | removeformat|backcolor |'
                +'| casechange blocks|a11ycheck code table',
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
  )
}

export default UserPolicyView
