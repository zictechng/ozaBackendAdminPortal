import React, {useContext, useEffect, useState, Fragment, forwardRef, useRef } from 'react'

import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react';
import Link from 'next/link'

// render version for deployment

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import client from 'src/@core/context/client'
import { Badge, TextareaAutosize, } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';

const AboutUsTable = () => {
  const router = useRouter()
  const [allAboutUsData, setAllAboutUsData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [updateLoadingData, setUpdateLoadingData] = useState(false);
  const [textEditorKey, setTextEditorKey] = useState('');
  const userTokenId = localStorage.getItem('userToken')

  const editorRef = useRef(null);

  const log = () => {

    if (editorRef.current) {
        //console.log(editorRef.current.getContent());
    }

  };

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
  const [companyName, setCompanyName] = useState({})

  const [companyName2, setCompanyName2] = useState("")
  const [companyDesc, setCompanyDesc] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyRegId, setCompanyRegId] = useState({})


useEffect(() => {
  userAuthCheck()

  const getAboutUs = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/allAbout_us`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
    //console.log('company info ' , res.data);

    setCompanyName(res.data.feedAll)

    setCompanyName2(res.data.feedAll[0]?.company_name)
    setCompanyDesc(res.data.feedAll[0]?.company_desc)
    setCompanyEmail(res.data.feedAll[0]?.company_email)
    setCompanyRegId(res.data.feedAll[0]?.company_regId)

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

//console.log(appSettingDetails.app_textEditor_key)
getAboutUs()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      company_name: companyName2,
      company_email: companyEmail,
      company_regId: companyRegId,
      description: editorRef.current.getContent()
    }
    setUpdateLoadingData(true)
    try {
      const res = await client.post(`/api/updateAbout_us`, data, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Updated  ' , res.data.msg);
  if(res.data.msg =='201'){
    //alert('updated successfully')

        toast.success('Updated successfully',
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
    else{
      toast.error('Sorry, something went wrong', {
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
                Information about the company
              </Typography>
            </Grid>
            <ToastContainer/>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>

                <TextField
                  required
                  label="Company Name"
                  name='company_name'
                  defaultValue={companyName2}
                  onChange={(e) => setCompanyName2(e.target.value)}
                  type={'text'}
                  fullWidth
                />

              </FormControl>

             </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Registration Number </InputLabel>
                <OutlinedInput
                  label='Registration Number'
                  name='company_regId'
                  onChange={(e) => setCompanyRegId(e.target.value)}
                  value={companyRegId}
                  type={'text'}
                  />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Company Email</InputLabel>
                <OutlinedInput
                   name='company_email'
                   onChange={(e) => setCompanyEmail(e.target.value)}
                   value={companyEmail}
                   label='Company Email'
                   type={'text'}
                  />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Editor
                  apiKey={textEditorKey}
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  init={{
                  height: 500,
                  menubar: false,
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist indent outdent | emoticons charmap | removeformat|backcolor |'
                  +'| casechange blocks|a11ycheck code table',
                  contentStyle: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </Grid>

          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          {/* <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'
          onClick={() => submitUpdate()}
          disabled={updateLoadingData}>
            <ToastContainer/>
            {updateLoadingData? <BtnLoaderIndicator /> : "Update"}
          </Button> */}
            <LoadingButton size='large' type='submit' sx={{ mr: 2}} loading={updateLoadingData} variant="contained"
            onClick={() => submitUpdate()}
            disabled={updateLoadingData}>
               Update
            </LoadingButton>

        </CardActions>
      </form>
      }
    </Card>
  )
}

export default AboutUsTable
