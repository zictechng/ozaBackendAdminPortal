import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import DocumentsTable from 'src/views/documents/DocumentsTable'

const RejectedDocuments = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Rejected Documents'
          subtitle='KYC documents that have been rejected'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'KYC Documents' },
            { label: 'Rejected' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <DocumentsTable docType='rejected' />
      </Grid>
    </Grid>
  )
}

export default RejectedDocuments