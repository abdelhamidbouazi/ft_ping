export interface Game {
    width: number;
    height: number;
}

export interface Bot {
    username : string;
    score : number;
    avatar : string;
    isHard : boolean;
    state : string;
}
