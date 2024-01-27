import React, {useContext, useEffect, useState, CSSProperties } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { Bitcoin, CashMultiple } from 'mdi-material-ui'
import client from 'src/@core/context/client'
import { NumberValueFormat } from 'src/@core/function/formatNumberValue'
import { NumberDollarValueFormat } from 'src/@core/function/formatDollarNumber'


const salesData = [
  {
    stats: '200k',
    title: 'Paypal',
    color: 'primary',
    icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '12.5k',
    title: 'User Funding',
    color: 'success',
    icon: <CashMultiple sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Bitcoin',
    icon: <Bitcoin sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '$88k',
    color: 'info',
    title: 'Payoneer',
    icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
  }
]

const renderStats = () => {

  return salesData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = ({payPalSales, payoneerSales, bitcoinSales, acctFund}) => {

  return (
    <Card>
      <CardHeader
        title='Statistics Board'
        subheader={
          <>
          <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          All service categories transaction summary statistics
        </Typography>
          <Typography variant='body3'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>
          </Typography>
          </>
          }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {/* Paypal stat */}
      <Grid item xs={12} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: 'primary.main'
          }}
        >
        <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>Paypal</Typography>
          <Typography variant='h6'><NumberDollarValueFormat value={payPalSales} /></Typography>
        </Box>
      </Box>
        </Grid>
          {/* Naira, user funding */}
        <Grid item xs={12} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: 'success.main'
          }}
        >
        <CashMultiple sx={{ fontSize: '1.75rem' }} />
        </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>User Funding</Typography>
            <Typography variant='h6'><NumberValueFormat value={acctFund} /></Typography>
          </Box>
        </Box>
        </Grid>

          {/* Bitcoin stat */}
        <Grid item xs={12} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: 'warning.main'
          }}
        >
        <Bitcoin sx={{ fontSize: '1.75rem' }} />
        </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>Bitcoin</Typography>
            <Typography variant='h6'><NumberDollarValueFormat value={bitcoinSales} /></Typography>
          </Box>
        </Box>
        </Grid>
          {/* Payoneer stat */}
        <Grid item xs={12} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: 'info.main'
          }}
        >
        <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
        </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>Payoneer</Typography>
            <Typography variant='h6'><NumberDollarValueFormat value={payoneerSales} /></Typography>
          </Box>
        </Box>
        </Grid>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
