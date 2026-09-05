import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import AllMessagesTable from 'src/views/message'

const MessageSupport = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Support Tickets'
          subtitle='View, reply and manage all user support tickets'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Support' },
            { label: 'Tickets' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <AllMessagesTable />
      </Grid>
    </Grid>
  )
}

export default MessageSupport