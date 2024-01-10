export interface Friends {
    AttrStatus: number,
    DisplayName: string,
    KeyWord: string,
    MemberList: [],
    MemberStatus: number,
    NickName: string,
    PYInitial: string,
    PYQuanPin: string,
    RemarkPYInitial: string,
    RemarkPYQuanPin: string,
    Uin: number,
    UserName: string,
}

export interface Message {
    'from_user_id': string,
    'from_user_nickname': string,
    'to_user_id': string,
    'to_user_nickname': string,
    'group_id': string,
    'group_name': string,
    'content': string,
    'create_time': number,
    'self': boolean,
    'group': boolean,
    'failed': boolean

}
