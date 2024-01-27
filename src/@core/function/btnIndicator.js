import React from 'react';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import BeatLoader from "react-spinners/BeatLoader";

export const BtnLoaderIndicator = () => {
  return (
          <>
              <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#fff' : '#fff'),
                    animationDuration: '550ms',
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: 'round',
                    },
                  }}
                  size={20}
                  thickness={4}

                />
          </>
  );
}

export const LoaderIndicator = () => {
  return (
          <>
              <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: 'round',
                    },
                  }}
                  size={40}
                  thickness={4}

                />
          </>
  );
}

export const ActivitiesLoader = () =>{
  return(
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:5, marginBottom:5 }}>
                 <BeatLoader
                  color={'#1D2667'}
                  loading={true}
                  size={10}
                  margin={5}
                />
              </Box>
        )
}
