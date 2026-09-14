
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import NewsletterTable from 'src/views/newsletter'

const Newsletter = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Newsletter Subscribers'
          subtitle='View all users who subscribed to the newsletter from the website'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Marketing' },
            { label: 'Newsletter' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <NewsletterTable />
      </Grid>
    </Grid>
  )
}

export default Newsletter