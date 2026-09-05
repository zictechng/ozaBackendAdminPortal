import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import AllTransactionsTable from 'src/views/all-transaction'

const AllTransactions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='All Transactions'
          subtitle='View all platform transactions across all users'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'All Transactions' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <AllTransactionsTable />
      </Grid>
    </Grid>
  )
}

export default AllTransactions