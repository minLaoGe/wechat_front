import {userInfo} from './userInfo'
import {Message} from "@/common/friends";

export interface HomeInitialState {
    apiKey: string;
    loading: boolean;
    lightMode: 'light' | 'dark';
    messageIsStreaming: boolean;
    login_code: string;
    token: string;
    leftCount: number|0;
    userInfo: userInfo;
    onlineCount: number|0;
    sumCount: number|0;
    offlienCount: number|0;
    temperature: number;
    showChatbar: boolean;
    showPromptbar: boolean;
    messageError: boolean;
    searchTerm: string;
    messageList: Message[];
    serverSideApiKeyIsSet: boolean;
}

export const initialState: HomeInitialState = {
    apiKey: '',
    userInfo: {
        current_to_userid: '',
        current_to_nickname: '',
        current_from_nickname: '',
        current_from_userid: '',
        group: false,
    },
    leftCount: 0,
    messageList: [],
    loading: false,
    lightMode: 'dark',
    messageIsStreaming: false,
    login_code: '',
    onlineCount: 0,
    sumCount: 0,
    offlienCount: 0,
    token: '',
    temperature: 1,
    showPromptbar: true,
    showChatbar: true,
    messageError: false,
    searchTerm: '',
    serverSideApiKeyIsSet: false,
};
