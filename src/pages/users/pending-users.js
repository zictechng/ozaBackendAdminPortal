import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserTableData from 'src/views/users/UsersTable'

const PendingUsers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Pending Users'
          subtitle='User accounts awaiting activation or approval'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Users' },
            { label: 'Pending' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UserTableData userType='pending' />
      </Grid>
    </Grid>
  )
}

export default PendingUsers