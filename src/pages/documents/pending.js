import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import DocumentsTable from 'src/views/documents/DocumentsTable'

const PendingDocuments = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Pending Documents'
          subtitle='KYC documents awaiting review and approval'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'KYC Documents' },
            { label: 'Pending' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <DocumentsTable docType='pending' />
      </Grid>
    </Grid>
  )
}

export default PendingDocuments