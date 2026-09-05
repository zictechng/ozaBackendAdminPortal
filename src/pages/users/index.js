import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserTableData from 'src/views/users/UsersTable'

const ActiveUsers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Active Users'
          subtitle='All currently active user accounts in the system'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Users' },
            { label: 'Active' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UserTableData userType='active' />
      </Grid>
    </Grid>
  )
}

export default ActiveUsers