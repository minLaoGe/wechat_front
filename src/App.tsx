import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Slider from '@mui/material/Slider';
import PopoverMenu from './PopoverMenu';
import ProTip from './ProTip';
import Main from "./main/Main";
import Grid from "@mui/material/Grid";
import {TextField} from "@mui/material";
import Buttom from "./main/Buttom";
import HomeContext from "./common/home.context";
import {useCreateReducer} from "./hooks/useCreateReducer";
import {HomeInitialState, initialState} from "./common/home.state";
import {useEffect, useRef, useState} from "react";



function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
    const [retryCount, setRetryCount] = useState(0);

    const contextValue = useCreateReducer<HomeInitialState>({
        initialState,
    });
    // 尝试重新连接的函数
    const tryReconnect = () => {
        setTimeout(() => {
            console.log(`尝试第 ${retryCount + 1} 次重连...`);
            setRetryCount(retryCount + 1);
        }, 3000); // 3秒后重连
    };



    const onClickChatChange= async ()=>{

    }
    const {
        state: {
            userInfo
        },
        dispatch
    } = contextValue;

    useEffect(()=>{



    },[retryCount])

  return (
      <HomeContext.Provider
          value={{
              ...contextValue
          }}
      >
    <div className="h-full p-0 m-0 w-full" >
        <Grid container className='h-full'>
               <Grid container className='h-5/6'>
                       <Main onClickChange={onClickChatChange}/>
               </Grid>
            <Grid container className='h-1/6'>
                <Buttom socket={''}/>
            </Grid>

        </Grid>

    </div>
      </HomeContext.Provider>

  );
}
