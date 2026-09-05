import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserTableData from 'src/views/users/UsersTable'

const SuspendedUsers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Suspended Users'
          subtitle='User accounts that have been suspended'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Users' },
            { label: 'Suspended' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UserTableData userType='suspended' />
      </Grid>
    </Grid>
  )
}

export default SuspendedUsers