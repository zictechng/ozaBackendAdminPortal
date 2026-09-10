import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import PageHeader from 'src/@core/components/common/PageHeader'
import WithdrawalTable from 'src/views/withdrawal'

const tabConfig = [
  { label: 'Pending',  value: 'pending',  color: 'warning' },
  { label: 'Approved', value: 'approved', color: 'success' },
  { label: 'Rejected', value: 'rejected', color: 'error'   },
]

const Withdrawal = () => {
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Withdrawal Requests'
          subtitle='Review, approve and track all user withdrawal requests'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'Withdrawals' },
          ]}
        />
      </Grid>

      {/* Tabs */}
      <Grid item xs={12}>
        <Box sx={{
          borderBottom: 1, borderColor: 'divider',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='body2' sx={{ fontWeight: activeTab === tab.value ? 700 : 500 }}>
                      {tab.label}
                    </Typography>
                    <Chip
                      label={tab.label[0]}
                      size='small'
                      color={tab.color}
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        opacity: activeTab === tab.value ? 1 : 0.5,
                        display: 'none',
                      }}
                    />
                  </Box>
                }
                sx={{ py: 2, minHeight: 48 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          {activeTab === 'pending'  && <WithdrawalTable statusType='pending'  key='pending' />}
          {activeTab === 'approved' && <WithdrawalTable statusType='approved' key='approved' />}
          {activeTab === 'rejected' && <WithdrawalTable statusType='rejected' key='rejected' />}
        </Box>
      </Grid>
    </Grid>
  )
}

export default Withdrawal