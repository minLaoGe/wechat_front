import * as React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {useCreateReducer} from "../hooks/useCreateReducer";
import {HomeInitialState, initialState} from "../common/home.state";
import {useFetch} from "../hooks/useFetch";
import {sendMessage} from "../common/const";
import {useContext, useState} from "react";
import HomeContext from "../common/home.context";

interface Props {
    socket: any
}
export default function Buttom(props: Props) {
    const thisFetch = useFetch();
    const [currentMsg,setCurrentMsg] = useState<string>('');

    const {
        state: {
            userInfo
        },
        dispatch
    } = useContext(HomeContext);
    const clickSend = async () => {
        let UserName = userInfo.current_to_userid;
        let nickname = userInfo.current_to_nickname;
        if(UserName){
            let body ={
                'message': currentMsg,
                'userNameId': UserName,
                'userName': ''
            }
            const res = await  thisFetch.post(sendMessage,{
                body
            })
            let failed = false;
            if ('error'=== res){
                failed=true
            }
            const timestamp = new Date().getTime();
            let message = {
                'from_user_id': 'Self',
                'from_user_nickname': 'Self',
                'to_user_id': UserName,
                'to_user_nickname': nickname,
                'content': currentMsg,
                'create_time': timestamp,
                'self': true,
                'group': false,
                failed
            }
            let msgList: any[]=  []
            let msgListStr = localStorage.getItem(nickname+'_'+message.group);
            if(msgListStr){
                msgList = JSON.parse(msgListStr)||[];
            }else {
                msgList = []
            }
            msgList.push(message)
            localStorage.setItem(nickname+'_'+message.group,JSON.stringify(msgList))
            dispatch({field: 'messageList', value: msgList})
        }else {
            alert("请先选择对象")
        }

    }
    return (
        < >
            <Grid item xs={10} >
                <textarea className='w-full h-full' onChange={(df)=>{
                    setCurrentMsg(df.target.value)
                }}>

                </textarea>

            </Grid>

            <Grid item xs={2}>
                <Button variant="contained" sx={{height: '100%'}} fullWidth onClick={()=>{clickSend()}} endIcon={<SendIcon />}>
                    Send
                </Button>
            </Grid>
        </>
    );
}