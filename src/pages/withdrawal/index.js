
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import WithdrawalTable from 'src/views/withdrawal'

const Withdrawal = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Withdrawal Requests'
          subtitle='Review and process user withdrawal requests'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'Withdrawals' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <WithdrawalTable />
      </Grid>
    </Grid>
  )
}

export default Withdrawal