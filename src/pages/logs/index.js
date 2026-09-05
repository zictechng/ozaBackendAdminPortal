import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import SystemLogsTable from 'src/views/logs'

const Logs = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='System Logs'
          subtitle='Monitor user login activity and system events'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'System Logs' },
            { label: 'Logs' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <SystemLogsTable />
      </Grid>
    </Grid>
  )
}

export default Logs