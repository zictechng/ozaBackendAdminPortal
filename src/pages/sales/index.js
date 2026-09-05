import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import SalesTable from 'src/views/sale'

const Sales = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Sales Orders'
          subtitle='Review and approve user sales transactions'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'Sales' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <SalesTable />
      </Grid>
    </Grid>
  )
}

export default Sales