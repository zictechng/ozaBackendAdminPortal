import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserPolicyView from 'src/views/user-policy'

const UserPolicy = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='User Policy'
          subtitle='Manage your platform privacy and user policy'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Application Settings' },
            { label: 'User Policy' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UserPolicyView />
      </Grid>
    </Grid>
  )
}

export default UserPolicy