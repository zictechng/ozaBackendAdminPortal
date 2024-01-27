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
import { Badge, TextareaAutosize, } from '@mui/material';
import BeatLoader from "react-spinners/BeatLoader";
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Select from '@mui/material/Select'

import 'react-toastify/dist/ReactToastify.css';

// ** Third Party Imports
import { AuthenticateUserCheck, PageRedirect } from 'src/@core/function/controlFunction';
import { BtnLoaderIndicator } from 'src/@core/function/btnIndicator';

const TermsConditionsView = () => {
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

  const [termsCondition, setTermCondition] = useState("")
  const [termStatus, setTermStatus] = useState("")


useEffect(() => {
  userAuthCheck()

  const getAboutUs = async() =>{
    setLoadingData(true);
    try {
      const res = await client.get(`/api/terms_condition`, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    //console.log('Pending users ' , res.data);
  if(res.data.msg =='201'){
     setTermCondition(res.data.feedAll[0]?.term_condition)
     setTermStatus(res.data.feedAll[0]?.term_status)

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
getAboutUs()

}, [userTokenId])

  // handle update info
  const submitUpdate = async (e) => {
    event.preventDefault()

    const data ={
      "desc": editorRef.current.getContent(),
      "termStatus": termStatus
    }
    setUpdateLoadingData(true)
    try {
      const res = await client.post(`/api/update_termCondition`, data, {
        headers: {
        'Authorization': 'Bearer '+userTokenId,
        }
      })

    console.log('Updated  ' , res.data);
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
                Information about the company terms and conditions of the product
              </Typography>
            </Grid>
            <ToastContainer/>

            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Status</InputLabel>
                <Select
                  label='Status'
                  defaultValue={termStatus}
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
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue={termsCondition}
                  onChange={(e) => setTermCondition(e.target.value)}
                  init={{
                  height: 500,
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
  )
}

export default TermsConditionsView
