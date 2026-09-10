
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import WithdrawalTable from 'src/views/withdrawal'

const RejectedWithdrawals = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Rejected Withdrawals'
          subtitle='All rejected withdrawal requests with reasons'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Withdrawals', href: '/withdrawal' },
            { label: 'Rejected' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <WithdrawalTable statusType='rejected' />
      </Grid>
    </Grid>
  )
}

export default RejectedWithdrawals