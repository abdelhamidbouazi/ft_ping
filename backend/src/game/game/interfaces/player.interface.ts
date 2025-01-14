export interface playersConnected {
    //when connecting
    id       : number;
    username : string;
    avatar   : string;

    //during game
    state    : string;
    score    : number;
    isHard   : boolean;

    //during connection
    mode     : string;
    color    : string;
}