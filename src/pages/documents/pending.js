import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import PageHeader from 'src/@core/components/common/PageHeader'
import DocumentsTable from 'src/views/documents/DocumentsTable'

const tabConfig = [
  { label: 'Pending',  value: 'pending'  },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const KYCDocuments = () => {
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='KYC Documents'
          subtitle='Review, approve and manage all submitted KYC documents'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'KYC Documents' },
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

        {/* Tab Content — each tab keeps its own state via key prop */}
        <Box sx={{ borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          {tabConfig.map(tab => (
            activeTab === tab.value && (
              <DocumentsTable
                key={tab.value}
                docType={tab.value}
              />
            )
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}

export default KYCDocuments