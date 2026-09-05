import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import AboutUsView from 'src/views/about-us'

const AboutUs = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='About Us'
          subtitle='Manage your company information and contact details'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Application Settings' },
            { label: 'About Us' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <AboutUsView />
      </Grid>
    </Grid>
  )
}

export default AboutUs