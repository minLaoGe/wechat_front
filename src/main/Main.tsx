import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import {useContext, useEffect, useRef, useState} from "react";
import {useFetch} from "../hooks/useFetch";
import {getChatRooms, getFriends} from "../common/const";
import {Friends,Message} from "../common/friends";
import {Divider} from "@mui/material";
import io from "socket.io-client";
import {useCreateReducer} from "../hooks/useCreateReducer";
import {HomeInitialState, initialState} from "../common/home.state";
import HomeContext from "../common/home.context";



interface Right{
    unreadmessage: number,
    type: string,
    count: number,
    NickName: string,
    UserName: string,
    MemberList: Friends[],
}
interface  Prop{
    onClickChange: ()=>void,
}
export default function PermanentDrawerRight(prop: Prop) {
    const [rightRoom,setRightRoom] = useState<Right[]>([]);
    const [rightFriends, setRightFriends]= useState<any[]>([]);
    const thisFetch = useFetch();
    const [allRightMess,setAllRightMess] = useState<any[]>([]);
    const [openmsg,setOpenMsg] =useState<any>({open: false,msg: '',from: ''})
    const socketRef  = useRef<any>(null);

    const {
        state: {
            userInfo,
            messageList
        },
        dispatch
    } = useContext(HomeContext);

    const initHistory = (to_userid:string) => {
        let temp = localStorage.getItem(to_userid);
        if (temp){
            let msgListStr: Message[] = JSON.parse(temp);
            dispatch({field: 'messageList', value: msgListStr})
        }else {
            dispatch({field: 'messageList', value: []})
        }

    }
    const  getFullURL = ()=> {
        const protocol = window.location.protocol; // 获取协议（例如 'http:' 或 'https:'）
        const hostname = window.location.hostname; // 获取主机名
        const port = window.location.port;         // 获取端口号

        // 如果端口号是 80 (或在 HTTPS 下是 443)，通常不需要在 URL 中指定
        if (port === "80" || port === "443" || port === "") {
            return `${protocol}//${hostname}`;
        } else {
            return `${protocol}//${hostname}:${port}`;
        }
    }

    // 创建WebSocket连接的函数
    const connectWebSocket = () => {
       let   url = ''
        if ( process.env.NODE_ENV === 'production'){
            url = getFullURL()+"/wechatFront/config/test";
        }else {
            url = "http://127.0.0.1:8080/config/test";
        }
        console.log(url)
        socketRef.current = io(url);

        socketRef.current.onmessage = (event: any) => {
            console.log('Message from server ', event.data);
        };

        socketRef.current.onerror = (error: any) => {
            console.error('WebSocket Error ', error);
        };
        socketRef.current.on('msg_True', (data: any) => {
            console.log('Message from group server: ', data);

        });
        socketRef.current.on('msg_False', (data: any) => {
            console.log('Message from person server: ', data);
            data = JSON.parse(data)
            let fromuserid = data['from_user_id']
            let message = {
                'from_user_id': fromuserid,
                'from_user_nickname': data['from_user_nickname'],
                'to_user_id': data['to_user_id'],
                'to_user_nickname': data['to_user_nickname'],
                'content': data['content'],
                'create_time': data['create_time'],
                'self': false,
                'group': false,
            }
            let msgList: any[]=  []
            let key = data['from_user_nickname']+'_'+message.group
            let msgListStr = localStorage.getItem(key);
            if(msgListStr){
                msgList = JSON.parse(msgListStr)||[];
            }else {
                msgList = []
            }
            msgList.push(message);

            let mess = {
                from: data['from_user_nickname'],
                open: true,
                msg: data['content'],
            }
            setOpenMsg(mess)
            const lastmsg = JSON.stringify(msgList);
            //持久化收到的消息
            localStorage.setItem(key,lastmsg)
            if (userInfo.current_to_userid===fromuserid){
                dispatch({field: 'messageList', value: msgList})
            }
        });

        socketRef.current.onclose = (event: any) => {
            console.log('WebSocket connection closed: ', event);
            if (!event.wasClean ) { // 如果连接不是正常关闭且重试次数少于5次
                // tryReconnect(); // 尝试重新连接
            }
        };
    };
    const checktoThisOne= async (UserName: string,NickName: string,group: boolean)=>{
        let userInfo = {
            current_to_userid:  UserName,
            current_to_nickname: NickName,
            group: group,
        }
        dispatch({field: 'userInfo', value: userInfo})
        initHistory(NickName+'_'+group);
    }

    const beiginChatRoome = async ()=>{
        const res = await thisFetch.get(getChatRooms)
        let rooms= []
        for (let resKey of res) {
           let obj: Right = {
                "NickName": resKey.NickName,
                "UserName": resKey.UserName,
                'type': 'room',
                'count': resKey.MemberList.length,
                'unreadmessage': 0,
               'MemberList': resKey.MemberList,
            }
            rooms.push(obj)
        }
        console.log(rooms)
        setRightRoom(rooms)
    }
    useEffect(() => {
        console.log("messageList 更新：", messageList);
    }, [messageList]);
    const resizeMessage= ()=>{
        let all = rightFriends.concat(rightRoom)
        console.log("all=",all)
        all.sort((a,b)=>a.unreadmessage- b.unreadmessage)
        setAllRightMess(all);
        if (!userInfo.current_to_userid){
            let currentuser = all[0]
            if (currentuser){
                let userInfo = {
                    current_to_userid:  currentuser.UserName,
                    current_to_nickname: currentuser.NickName,
                    group: false,
                }
                dispatch({field: 'userInfo', value: userInfo})
                initHistory(currentuser.NickName+'_'+userInfo.group);
            }

        }
    }
    //朋友聊天数组
    const beginChatFrineds = async () =>{
        const res = await thisFetch.get(getFriends)
        let friends= []
        for (let resKey of res) {
            let obj: Right = {
                "NickName": resKey.NickName,
                "UserName": resKey.UserName,
                'type': 'friend',
                'count': 0,
                'unreadmessage': 0,
                'MemberList': [],
            }
            friends.push(obj)
        }
        setRightFriends(friends)

    }
    useEffect( ()=>{
        connectWebSocket();
        beiginChatRoome()
        beginChatFrineds()
        // 组件卸载时清理资源
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    },[])

    useEffect(() => {
        // 当 rightFriends 或 rightRoom 更新时，重新计算 allRightMess
        resizeMessage();
    }, [rightFriends, rightRoom]); // 添加依赖数组


    return (

           <Grid container className='h-full'>
                <Grid item className='h-full' xs={10}>

                            {messageList.length >0 ?(messageList.map((text,index)=>{
                                return <Typography key = {index} paragraph>
                                    <Grid  key = {index} container>
                                        <Grid item  xs={1}>
                                            {text.from_user_nickname}:
                                        </Grid>
                                        <Grid item xs={11}>
                                            {text.content}
                                        </Grid>
                                    </Grid>

                                </Typography>
                            })): "暂无消息"}


                </Grid>
               <Grid item xs={2} className='h-full' sx={{ border: '1px solid black'}}>
                   {openmsg.open? <Alert onClose={() => {setOpenMsg({open: false,msg: '',from: ''})}}>{openmsg.msg}! {openmsg.from}</Alert> : ''}


                   <List  className='h-full flex flex-col flex-nowrap'  sx={{padding: 0,overflowY: 'auto'}} >
                       {allRightMess.map((text, index) => (
                           <ListItem key={text.UserName} className=' flex' sx={{border: '1px solid grey'}}  >
                               <ListItemButton onClick={()=>{checktoThisOne(text.UserName,text.NickName, text.type ==='room')}}>
                                   <ListItemIcon>
                                       {text.type  === 'room' ? <InboxIcon /> : <MailIcon />}
                                   </ListItemIcon>
                                   <ListItemText primary={text.NickName+'::'+text.unreadmessage+'::'+text.UserName.substring(text.UserName.length - 10)} />
                               </ListItemButton>
                           </ListItem>
                       ))}
                   </List>
               </Grid>
           </Grid>

    );
}
