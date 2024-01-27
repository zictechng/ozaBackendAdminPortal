// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import ProfileAccountTabView from 'src/views/admin-users/profileTab'
import ProfileSecurityTabView from 'src/views/admin-users/profileSecurityTab'
import OtherInfoTabView from 'src/views/admin-users/otherInfoTab'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AdminViewUserDetails = () => {

   // ** State
   const [value, setValue] = useState('account')

   const handleChange = (event, newValue) => {
     setValue(newValue)
   }
    console.log('ID ', )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} marginBottom={10}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
          Admin User Details

        </Typography>
      </Grid>

      <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountOutline />
                <TabName>Account Profile</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockOpenOutline />
                <TabName>Account Security</TabName>
              </Box>
            }
          />
          <Tab
            value='info'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InformationOutline />
                <TabName>Other Info</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='account'>
          <ProfileAccountTabView />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <ProfileSecurityTabView />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='info'>
          <OtherInfoTabView />
        </TabPanel>
      </TabContext>
    </Card>

    </Grid>
  )
}

export default AdminViewUserDetails
