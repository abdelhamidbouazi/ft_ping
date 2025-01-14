export  type ChannelType =  {
    id: number;
    title: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    Avatar_URL: string;
}

export type UserType=  {   
    Avatar_URL: string;
    achievements: string[];
    color: string;
    displayName: string;
    id: string;
    isSettingSetted: boolean;
    isTwoFactorEnable: boolean;
    is_looged: boolean;
    ladder_lvl: number;
    mode: string;
    nickname: string;
    role: string;
    score: number;
    socket: string;
    state: string;
    status: string;
    total_matches: number;
    twoFactorAuthSecret: string;
    username: string;
    wins: number;
}


export type DataType = {
    id: number;
    channel: ChannelType;
    isMuted: boolean;
    muteStartTimestamp: string;
    role: string;
    status: string;
    users: UserType[];
}