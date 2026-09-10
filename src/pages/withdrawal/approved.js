
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import WithdrawalTable from 'src/views/withdrawal'

const ApprovedWithdrawals = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Approved Withdrawals'
          subtitle='All approved withdrawal requests'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Withdrawals', href: '/withdrawal' },
            { label: 'Approved' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <WithdrawalTable statusType='approved' />
      </Grid>
    </Grid>
  )
}

export default ApprovedWithdrawals