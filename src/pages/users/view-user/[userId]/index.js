// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'

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
import Stack from '@mui/material/Stack';

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Icon from '@mdi/react';
import { mdiArrowLeftCircleOutline } from '@mdi/js';

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import ProfileUserAccountTabView from 'src/views/users/profileTab'
import ProfileUserSecurityTabView from 'src/views/users/profileSecurityTab'
import OtherUserInfoTabView from 'src/views/users/otherInfoTab'

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

const ViewUserDetails = () => {
  const router = useRouter()
  const {userId} = router.query;

   // ** State
   const [value, setValue] = useState('account')

   const handleChange = (event, newValue) => {
     setValue(newValue)
   }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} marginBottom={10}>
        <Typography variant='h5'>
          {/* <Link href='https://mui.com/components/tables/' target='_blank'>
            Active Users
          </Link> */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems:'center' }}>
          <Link href='/'>
           User Details
          </Link>
          <Link href='#'>
            <Icon path={mdiArrowLeftCircleOutline} size={1.5} color={'#595F90'} cursor={'pointer'}
            onClick={() => router.back()} />
          </Link>
        </Stack>

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
          <ProfileUserAccountTabView />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <ProfileUserSecurityTabView />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='info'>
          <OtherUserInfoTabView />
        </TabPanel>
      </TabContext>
    </Card>

    </Grid>
  )
}

export default ViewUserDetails
