import React from 'react';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

const NoRecordFund = () =>{
  return (
    <Box sx={{ display: "flex", color:'#aaa', justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
      No records at the moment
    </Box>
  );
}

export default NoRecordFund
