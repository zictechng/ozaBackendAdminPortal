import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import BuyingTable from 'src/views/buying'

const Buying = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Buying Orders'
          subtitle='Review and approve user buying orders'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'Buying' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <BuyingTable />
      </Grid>
    </Grid>
  )
}

export default Buying