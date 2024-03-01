import React, { useContext, useEffect, useState, CSSProperties } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import DocumentViewPage from 'src/views/documents/documentViewTable'

const ViewDocuments = () => {
  const router = useRouter()
  const { docId } = router.query

  //console.log('Document ID ', docId)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
           User Documents OverView
            <Link href='#' passHref>
              <ArrowCircleLeftOutlinedIcon fontSize='large' color={'#595F90'} cursor='pointer'
               onClick={() => router.back()}
               />
            </Link>
          </Stack>
        </Typography>
        <Typography
          variant='body2'
          style={{
            height: '3vh',
            paddingTop: '15px'
          }}
        >
          Preview of user document and take actions{' '}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <DocumentViewPage />
      </Grid>

      {/* <Grid item xs={12} marginTop={10}>
        <Card>
          <CardHeader title='Dense Table' titleTypographyProps={{ variant: 'h6' }} />
          <OtherDocumentViewPage />
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default ViewDocuments
