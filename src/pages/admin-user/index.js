import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import AdminUsersTable from 'src/views/admin-users'

const AdminUsers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Admin Users'
          subtitle='View and manage all administrator accounts'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Admin Users' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <AdminUsersTable />
      </Grid>
    </Grid>
  )
}

export default AdminUsers