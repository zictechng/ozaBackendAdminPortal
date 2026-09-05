import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import ServiceRateView from 'src/views/service-rate'

const ServiceRate = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Trade Rates'
          subtitle='Configure buying and selling rates for PayPal, Payoneer and Bitcoin'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Application Settings' },
            { label: 'Trade Rate' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <ServiceRateView />
      </Grid>
    </Grid>
  )
}

export default ServiceRate