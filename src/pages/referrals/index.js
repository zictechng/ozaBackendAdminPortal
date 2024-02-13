
import React, {useContext, useEffect, useState, CSSProperties } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import ReferralProgramTable from 'src/views/referral';


const ReferralPrograms = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
           User Referral Details
        </Typography>
        <Typography variant='body2'>View all users referrals details in the system </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ReferralProgramTable />
        </Card>
      </Grid>

    </Grid>
  )
}

export default ReferralPrograms
