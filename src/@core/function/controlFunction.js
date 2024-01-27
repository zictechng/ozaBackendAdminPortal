import * as React from 'react';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import SnackbarContent from '@mui/material/SnackbarContent';

// ** MUI Imports
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';


import CloseIcon from '@mui/icons-material/Close';
import { blue, green, orange, red, yellow } from '@mui/material/colors';

import client from '../context/client';

// check if user tokens exist
export const AuthenticateUser = () => {

}

export const PageRedirect = (goToPage) => {
  const url = goToPage;
    if (url) {
      return url;
    }
    else {
      return null;
    }
}

//function to check if user tokens exist and is valid or expired
export const AuthenticateUserCheck = async(tokenData) => {
  try {
    const res = await client.get('/api/authenticate_user', {
      headers: {
      'Authorization': 'Bearer '+tokenData,
      }
    })
if(res.data.msg =='200'){
  return res.data
  }
else if(res.data.status == '401') {
  //console.log('Login required ' , res.data);
  return res.data
    }
  else if(res.data.status == '402') {
    //console.log('Authentication Session expired! Login again ' ,res.data);

    return res.data
      }
  } catch (error) {
    //console.log(error.message)
    if(error.message == 'Network Error'){
      console.log('Login required ' ,error.message + ' occurred');
      }
    }
}

// custom function to show full page loader indicator
export const FullPageIndicator = (open) => {
  return (
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}>
          <CircularProgress color="primary" />
      </Backdrop>
  )
}

// custom function to show user account state action dialog
export const AccountStateDialog = ({openState, transitionState, closeState, actionBtn1, actionBtn2, icon1, icon2, loadingState})=>{
  return (
    <Dialog
        open={openState}
        TransitionComponent={transitionState}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Take action on user account state?</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeState}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <Typography variant='body2' sx={{marginLeft:6, marginRight:6, marginBottom:8 }} dividers>
            Please, be mindful before you take any action on users account, this might impact the user.
          </Typography>


          {loadingState == true ?
          <FullPageIndicator />
          : null}

          <List sx={{ pt: 0, width:400 }}>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: yellow[100], color: yellow[600] }}>
                    {icon1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Suspend Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn2}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    {icon2}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Activate Account" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
  )
}

// custom function to show user account state action dialog
export const AccountApprovalStateDialog = ({openState, transitionState, closeState, actionBtn1, actionBtn2, actionBtn3, icon1, icon2, icon3, loadingState})=>{
  return (
    <Dialog
        open={openState}
        TransitionComponent={transitionState}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Take action on user account approval?</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeState}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <Typography variant='body2' sx={{marginLeft:6, marginRight:6, marginBottom:8 }} dividers>
            Please, be mindful before you take any action on users account, this might impact the user.
          </Typography>
          {loadingState == true ?
          <FullPageIndicator />
          : null}

          <List sx={{ pt: 0, width:400 }}>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: yellow[100], color: yellow[600] }}>
                    {icon1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Suspend Approval" />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn2}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[100], color: red[600] }}>
                    {icon2}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Reject Approval" />
              </ListItemButton>
            </ListItem>

            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn3}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    {icon3}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Approve Account" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
  )
}

// custom function to show user account state action dialog
export const UserAccountActionDialog = ({openState, transitionState, closeState, actionBtn1, actionBtn2, actionBtn3, actionBtn4, icon1, icon2, icon3, icon4, loadingState})=>{
  return (
    <Dialog
        open={openState}
        TransitionComponent={transitionState}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>What action do you want to take?</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeState}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <Typography variant='body2' sx={{marginLeft:6, marginRight:6, marginBottom:8 }} dividers>
            Please, be mindful before you take any action on users account, this might impact the user.
          </Typography>
          {loadingState == true ?
          <FullPageIndicator />
          : null}

          <List sx={{ pt: 0, width:400 }}>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: yellow[100], color: yellow[600] }}>
                    {icon1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Block Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn2}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: orange[100], color: orange[600] }}>
                    {icon2}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Suspend Account" />
              </ListItemButton>
            </ListItem>

            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn3}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    {icon3}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Activate Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn4}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[100], color: red[600] }}>
                    {icon4}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Delete Account" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
  )
}

// custom function to show confirm dialog
export const ConfirmDialog = ({openState, transitionState, closeState, actionBtn1, icon1, title, desc, loadingState})=>{
  return (
    <Dialog
        open={openState}
        TransitionComponent={transitionState}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{title}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeState}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <Typography variant='body2' sx={{marginLeft:6, marginRight:6, marginBottom:8 }} dividers>
            {desc}
          </Typography>
          {loadingState == true ?
          <FullPageIndicator />
          : null}

          <List sx={{ pt: 0, width:400 }}>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                    {icon1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Approved this document" />
              </ListItemButton>
            </ListItem>
            </List>
        </DialogContent>
      </Dialog>
  )
}

// custom function to show confirm dialog
export const ConfirmDialogDelete = ({openState, transitionState, closeState, actionBtn1, icon1, title, desc, loadingState, btnLable})=>{
  return (
    <Dialog
        open={openState}
        TransitionComponent={transitionState}
        keepMounted
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{title}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeState}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <Typography variant='body2' sx={{marginLeft:6, marginRight:6, marginBottom:8 }} dividers>
            {desc}
          </Typography>
          {loadingState == true ?
          <FullPageIndicator />
          : null}

          <List sx={{ pt: 0, width:400 }}>
            <ListItem disableGutters>
              <ListItemButton
                autoFocus
                onClick={actionBtn1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: red[100], color: red[600] }}>
                    {icon1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={btnLable} />
              </ListItemButton>
            </ListItem>
            </List>
        </DialogContent>
      </Dialog>
  )
}

// Snackbar notifications custom components here
export const ShowSnackbar = ({openAction, hideDuration, onCloseAction, type, bgColored, length, desc, transitionState}) =>{
  return (
    <Snackbar open={openAction} autoHideDuration={hideDuration} onClose={onCloseAction}
        TransitionComponent={transitionState}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}>
        <Alert
          onClose={onCloseAction}
          severity={type}
          variant="filled"
          sx={{ width: length, bgcolor: bgColored, color:'white', fontSize:15 }}>
          {desc}
        </Alert>
          {/* <Alert variant="filled" severity="success">
            <Typography variant='h6'
            style={{
              color:'white',
            }}>
              This is a filled error Alert.
            </Typography>
          </Alert> */}
    </Snackbar>
  )
}

// confirm with input text dialog custom function here

export const ConfirmDialogInput = ({title, desc, inputLabel, btnClose, bntSubmit, openState, closeState}) => {
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
    </Dialog>
  )
}


