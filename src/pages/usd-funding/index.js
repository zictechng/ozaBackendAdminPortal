
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UsdFundingTable from 'src/views/usd-funding'

const UsdFunding = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='USD Funding Requests'
          subtitle='Review and approve user USD wallet funding requests'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'USD Funding' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UsdFundingTable />
      </Grid>
    </Grid>
  )
}

export default UsdFunding