import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import SystemActivityTable from 'src/views/system-activity'

const SystemActivity = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='System Activity'
          subtitle='Monitor all system activities and user actions'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'System Logs' },
            { label: 'System Activity' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <SystemActivityTable />
      </Grid>
    </Grid>
  )
}

export default SystemActivity