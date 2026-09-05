import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import DocumentsTable from 'src/views/documents/DocumentsTable'

const ApprovedDocuments = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Approved Documents'
          subtitle='All KYC documents that have been approved'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'KYC Documents' },
            { label: 'Approved' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <DocumentsTable docType='approved' />
      </Grid>
    </Grid>
  )
}

export default ApprovedDocuments