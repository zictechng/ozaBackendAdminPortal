// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import { AccountAlert, AccountCancel, AccountCheck, AccountRemove, Bank, ChartBar, CreditCardCheck, CreditCardMinus, CreditCardPlus, CreditCardScan, CurrencyUsd, FileAlert, FileCancel, FileChart, FileChartOutline, FileCheck, FileCloud, FileDocumentMultiple, Information, InformationOutline, Lifebuoy, RadioboxBlank, ScaleBalance } from 'mdi-material-ui'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'Users'
    },

    {
      title: 'Active Users',
      icon: AccountCheck,

      //path: '/active-users'
      path: '/users/active-users'
    },
    {
      title: 'Pending Users',
      icon: AccountAlert,

      //path: '/active-users'
      path: '/users/pending-users'
    },
    {
      title: 'Suspended Users',
      icon: AccountCancel,

      //path: '/active-users'
      path: '/users/suspended-users'
    },
    {
      title: 'Deleted Users',
      icon: AccountRemove,

      //path: '/active-users'
      path: '/users/deleted-users'
    },

    // {
    //   title: 'Login',
    //   icon: Login,
    //   path: '/pages/login',
    //   openInNewTab: true
    // },

    {
      sectionTitle: 'Documents'
    },
    {
      title: 'Approved',
      icon: FileCheck,
      path: '/documents/approved',
      openInNewTab: true
    },
    {
      title: 'Pending',
      icon: FileAlert,
      path: '/documents/pending',
      openInNewTab: true
    },
    {
      title: 'Rejected',
      icon: FileCancel,
      path: '/documents/rejected',
      openInNewTab: true
    },

    {
      sectionTitle: 'User Bank'
    },
    {
      title: 'Bank Details',
      icon: Bank,
      path: '/typography'
    },

    {
      sectionTitle: 'User Account Statement'
    },
    {
      title: 'Funding',
      path: '/icons',
      icon: FileChart
    },
    {
      title: 'Sales',
      icon: FileChartOutline,
      path: '/cards'
    },
    {
      title: 'Buying',
      icon: FileCloud,
      path: '/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/form-layouts'
    },

    {
      sectionTitle: 'Transaction'
    },
    {
      icon: CreditCardPlus,
      title: 'Funding',
      path: '/form-layouts'
    },
    {
      icon: CreditCardCheck,
      title: 'Sales',
      path: '/form-layouts'
    },
    {
      icon: CreditCardScan,
      title: 'Buying',
      path: '/form-layouts'
    },

    {
      sectionTitle: 'Ticket'
    },
    {
      icon: Lifebuoy,
      title: 'Support Ticket',
      path: '/form-layouts'
    },
    {
      icon: ChartBar,
      title: 'Report',
      path: '/form-layouts'
    },

    {
      sectionTitle: 'Application Settings'
    },
    {
      icon: Information,
      title: 'About Us',
      path: '/form-layouts'
    },
    {
      icon: CurrencyUsd,
      title: 'Trade Rate',
      path: '/form-layouts'
    },
    {
      icon: RadioboxBlank,
      title: 'Terms & Conditions',
      path: '/form-layouts'
    },
    {
      icon: ScaleBalance,
      title: 'User Policy',
      path: '/form-layouts'
    },
    {
      icon: InformationOutline,
      title: 'Company Info',
      path: '/form-layouts'
    },

    {
      sectionTitle: 'Admin Users'
    },
    {
      title: 'Active Users',
      icon: AccountCheck,

      //path: '/active-users'
      path: '/adminUsers/active-users'
    },
    {
      title: 'Pending Users',
      icon: AccountAlert,

      //path: '/active-users'
      path: '/adminUsers/pending-users'
    },
    {
      title: 'Suspended Users',
      icon: AccountCancel,

      //path: '/active-users'
      path: '/adminUsers/suspended-users'
    },
    {
      title: 'Deleted Users',
      icon: AccountRemove,

      //path: '/active-users'
      path: '/adminUsers/deleted-users'
    },
  ]
}

export default navigation
