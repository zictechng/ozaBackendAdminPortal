import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import ReferralTable from 'src/views/referral'

const Referrals = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Referral Bonus'
          subtitle='View and approve user referral bonus rewards'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Rewards & Coins' },
            { label: 'Referral Bonus' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <ReferralTable />
      </Grid>
    </Grid>
  )
}

export default Referrals