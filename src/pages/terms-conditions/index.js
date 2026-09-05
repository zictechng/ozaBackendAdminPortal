import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/common/PageHeader'
import TermsConditionsView from 'src/views/term-condition'

const TermsConditions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title='Terms & Conditions'
          subtitle='Manage your platform terms and conditions'
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Application Settings' },
            { label: 'Terms & Conditions' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <TermsConditionsView />
      </Grid>
    </Grid>
  )
}

export default TermsConditions