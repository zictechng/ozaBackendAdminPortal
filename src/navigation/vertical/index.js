
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import {
  AccountAlert, AccountCancel, AccountCheck, AccountRemove,
  Bank, CreditCardCheck, CreditCardPlus, CreditCardScan,
  CubeOutline, CurrencyUsd, FileAlert, FileCancel, FileCheck,
  AccountGroup, Information, InformationOutline, Lifebuoy, // Changed GroupAddSharp to AccountGroup
  RadioboxBlank, ScaleBalance, BellOutline,
  Flash, AccessPoint, Television, School, // Changed LightningBolt to Flash
  Cellphone, Gift, Cog, Star, ViewGrid,
  ShieldAccount, History, Autorenew,
} from 'mdi-material-ui'

//import { Autorenew } from 'mdi-material-ui'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/',
    },

    { sectionTitle: 'Users' },
    {
      title: 'Active Users',
      icon: AccountCheck,
      path: '/users',
    },
    {
      title: 'Pending Users',
      icon: AccountAlert,
      path: '/users/pending-users',
    },
    {
      title: 'Suspended Users',
      icon: AccountCancel,
      path: '/users/suspended-users',
    },
    {
      title: 'Deleted Users',
      icon: AccountRemove,
      path: '/users/deleted-users',
    },

    { sectionTitle: 'KYC Documents' },
    {
      title: 'Approved',
      icon: FileCheck,
      path: '/documents/approved',
    },
    {
      title: 'Pending',
      icon: FileAlert,
      path: '/documents/pending',
    },
    {
      title: 'Rejected',
      icon: FileCancel,
      path: '/documents/rejected',
    },

    { sectionTitle: 'Bank Details' },
    {
      title: 'User Bank Details',
      icon: Bank,
      path: '/bank-details',
    },

    { sectionTitle: 'Transactions' },
    {
      icon: CreditCardPlus,
      title: 'Account Funding',
      path: '/account-funding',
    },
    {
      icon: CreditCardCheck,
      title: 'Sales',
      path: '/sales',
    },
    {
      icon: CreditCardScan,
      title: 'Buying',
      path: '/buying',
    },
    {
      icon: CubeOutline,
      title: 'All Transactions',
      path: '/all-transactions',
    },
    {
      icon: CubeOutline,
      title: 'Bills Transactions',
      path: '/bills/transactions',
    },

    { sectionTitle: 'Service Provider' },
    {
      icon: ViewGrid,
      title: 'Providers',
      path: '/bills/providers',
    },
    {
      icon: Cog,
      title: 'Service Config',
      path: '/bills/services',
    },
    
    { sectionTitle: 'Rewards & Coins' },
    {
      icon: Star,
      title: 'Rewards Settings',
      path: '/rewards/settings',
    },
    {
      icon: Gift,
      title: 'Coins History',
      path: '/rewards/coins-history',
    },
    {
      icon: AccountGroup, // Updated here
      title: 'Referral Bonus',
      path: '/referrals',
    },

    { sectionTitle: 'Support' },
    {
      icon: Lifebuoy,
      title: 'Support Tickets',
      path: '/messages',
    },
    {
      icon: BellOutline,
      title: 'Notifications',
      path: '/notifications',
    },

    { sectionTitle: 'Application Settings' },
    {
      icon: Information,
      title: 'About Us',
      path: '/about-us',
    },
    {
      icon: CurrencyUsd,
      title: 'Trade Rate',
      path: '/service-rate',
    },
    {
      icon: RadioboxBlank,
      title: 'Terms & Conditions',
      path: '/terms-conditions',
    },
    {
      icon: ScaleBalance,
      title: 'User Policy',
      path: '/user-policy',
    },
    {
      icon: InformationOutline,
      title: 'App Settings',
      path: '/app-setting',
    },

    { sectionTitle: 'Admin Users' },
    {
      title: 'Active Admins',
      icon: ShieldAccount,
      path: '/admin-user',
    },

    { sectionTitle: 'System Logs' },
    {
      title: 'Logs',
      icon: Autorenew,
      path: '/logs',
    },
    {
      title: 'System Activity',
      icon: History,
      path: '/system-activity',
    },
  ]
}

export default navigation