import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserTableData from 'src/views/users/UsersTable'

const tabConfig = [
  { label: 'Active',    value: 'active',    color: '#10B981' },
  { label: 'Pending',   value: 'pending',   color: '#F59E0B' },
  { label: 'Suspended', value: 'suspended', color: '#EF4444' },
  { label: 'Deleted',   value: 'deleted',   color: '#6B7280' },
]

const Users = () => {
  const [activeTab, setActiveTab] = useState('active')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='User Management'
          subtitle='View, manage and take action on all user accounts'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Users' },
          ]}
        />
      </Grid>

      <Grid item xs={12}>
        {/* Tab Bar */}
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          borderRadius: '12px 12px 0 0',
          px: 2,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor='primary'
            indicatorColor='primary'>
            {tabConfig.map(tab => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: activeTab === tab.value ? 700 : 500 }}>
                    {tab.label}
                  </Typography>
                }
                sx={{ py: 2, minHeight: 48 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          {tabConfig.map(tab => (
            activeTab === tab.value && (
              <UserTableData
                key={tab.value}
                userType={tab.value}
              />
            )
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}

export default Users