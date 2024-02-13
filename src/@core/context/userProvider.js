import React, {useState, useEffect} from "react";
import { useRouter } from 'next/router'
import { AuthContext } from "./authContext";
import { Alert } from "mdi-material-ui";
import client from "./client";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const UserProvider = ({children}) =>{

  const router = useRouter()

  const [test, setTest] = useState('Test Value');
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appSettingDetails, setAppSettingDetails] = useState();

  // login action function
  const loginAction = async (username, password)=>{
      setIsButtonLoading(true);
    try {
      const res = await client.post('/api/loginAdmin', {
        username,
        password
    })

  //console.log(res.data);
  if(res.data.msg =='200'){
    //console.log('Login details ' ,res.data);
    let userInfo = res.data;
    let appSettingDetails = res.data.appData;
      setUserInfo(userInfo)
      setUserToken(userInfo.token)

      //setAppSettingDetails(appSettingDetails)
      localStorage.setItem('userToken', userInfo.token);
      localStorage.setItem('AppSettingData',  JSON.stringify( appSettingDetails));
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      router.replace('/')
      }
    else if(res.data.status == '401') {
      return toast.error('Failed! No user record found', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      }
        else if(res.data.status == '404'){

      return toast.error('Failed! Username or Password incorrect', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
          }
        else if(res.data.status == '402'){
          return toast.error('Failed!' + res.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          }
        else if(res.data.status == '400'){
          return toast.error('Error! Username or Password missing', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          }
        else {
          return toast.error('Error! Sorry, something went wrong', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
            }
      } catch (error) {
        console.log(error.message)
        if(error.message == 'Network Error'){
          return toast.error('Failed! '+ error.message +' occurred', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });

          }
      }
      finally {
        //setIsBtnLoading(false);
        setIsButtonLoading(false);
        }
      }

  // is logged in function here
  const isLoggedIn = async ()=>{
    try {
      setIsLoading(true);
      let userToken = localStorage.getItem('userToken');
      let userInfo = localStorage.getItem('userInfo');
      let appSettingDetails = localStorage.getItem('AppSettingData');

        userInfo = JSON.parse(userInfo)
        appSettingDetails = JSON.parse(appSettingDetails)
        if(userInfo){
          setUserToken(userToken);
          setUserInfo(userInfo);
          setAppSettingDetails(appSettingDetails)
          console.log('User LoggedIn ')
        }
     } catch (error) {
      console.log(`Login error ${error.message}`);

    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{test, setTest,
    isLoading,
    setIsLoading,
    isButtonLoading,
    userToken, setUserToken,
    userInfo, setUserInfo,
    loginAction,
    isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default UserProvider
