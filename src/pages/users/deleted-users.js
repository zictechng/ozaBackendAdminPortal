import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import UserTableData from 'src/views/users/UsersTable'

const DeletedUsers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Deleted Users'
          subtitle='User accounts that have been deleted from the system'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Users' },
            { label: 'Deleted' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <UserTableData userType='deleted' />
      </Grid>
    </Grid>
  )
}

export default DeletedUsers