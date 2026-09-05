import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import AccountFundingTable from 'src/views/account-founding'

const AccountFunding = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Account Funding'
          subtitle='Review and approve user account funding requests'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Transactions' },
            { label: 'Account Funding' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <AccountFundingTable />
      </Grid>
    </Grid>
  )
}

export default AccountFunding