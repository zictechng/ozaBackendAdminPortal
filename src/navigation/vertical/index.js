// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import { AccountAlert, AccountCancel, AccountCheck, AccountRemove, Bank, ChartBar, CreditCardCheck, CreditCardMinus, CreditCardPlus, CreditCardScan, CurrencyUsd, FileAlert, FileCancel, FileChart, FileChartOutline, FileCheck, FileCloud, FileDocumentMultiple, Information, InformationOutline, Lifebuoy, RadioboxBlank, ScaleBalance, ShareAll, ShareCircle } from 'mdi-material-ui'
import { AutoMode, GroupAddSharp, ManageHistory } from '@mui/icons-material'

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
      path: '/users'
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

      //openInNewTab: true
    },
    {
      title: 'Pending',
      icon: FileAlert,
      path: '/documents/pending',

      //openInNewTab: true
    },
    {
      title: 'Rejected',
      icon: FileCancel,
      path: '/documents/rejected',

     // openInNewTab: true
    },

    {
      sectionTitle: 'User Bank'
    },
    {
      title: 'Bank Details',
      icon: Bank,
      path: '/bank-details'
    },

    {
      sectionTitle: 'User Account Statement'
    },

    // {
    //   title: 'Funding',
    //   path: '/account-funding',
    //   icon: FileChart
    // },
    // {
    //   title: 'Sales',
    //   icon: FileChartOutline,
    //   path: '/sales'
    // },
    // {
    //   title: 'Buying',
    //   icon: FileCloud,
    //   path: '/buying'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'All Transactions',
    //   path: '/all-transactions'
    // },

    {
      sectionTitle: 'Transaction'
    },
    {
      icon: CreditCardPlus,
      title: 'Funding',
      path: '/account-funding'
    },
    {
      icon: CreditCardCheck,
      title: 'Sales',
      path: '/sales'
    },
    {
      icon: CreditCardScan,
      title: 'Buying',
      path: '/buying'
    },
    {
      icon: CubeOutline,
      title: 'All Transactions',
      path: '/all-transactions'
    },

    {
      sectionTitle: 'Ticket'
    },
    {
      icon: Lifebuoy,
      title: 'Support Ticket',
      path: '/messages'
    },

    // {
    //   icon: ChartBar,
    //   title: 'Report',
    //   path: '/form-layouts'
    // },

    {
      sectionTitle: 'Application Settings'
    },
    {
      icon: Information,
      title: 'About Us',
      path: '/about-us'
    },
    {
      icon: CurrencyUsd,
      title: 'Trade Rate',
      path: '/service-rate'
    },
    {
      icon: RadioboxBlank,
      title: 'Terms & Conditions',
      path: '/terms-conditions'
    },
    {
      icon: ScaleBalance,
      title: 'User Policy',
      path: '/user-policy'
    },
    {
      icon: InformationOutline,
      title: 'App Settings',
      path: '/app-setting'
    },

    {
      sectionTitle: 'Admin Users'
    },
    {
      title: 'Active Users',
      icon: AccountCheck,
      path: '/admin-user'
    },
    {
      title: 'Pending Users',
      icon: AccountAlert,
      path: '/admin-user/pending'
    },
    {
      title: 'Suspended Users',
      icon: AccountCancel,
      path: '/admin-user/suspended'
    },
    {
      title: 'Deleted User',
      icon: AccountRemove,
      path: '/admin-user/deleted'
    },

    {
      sectionTitle: 'System Logs'
    },
    {
      title: 'Logs',
      icon: AutoMode,
      path: '/logs'
    },
    {
      title: 'System Activity',
      icon: ManageHistory,
      path: '/system-activity'
    },

    {
      sectionTitle: 'Referral Programs'
    },
    {
      title: 'Referral Bonus',
      icon: GroupAddSharp,
      path: '/referrals'
    },

  ]
}

export default navigation
