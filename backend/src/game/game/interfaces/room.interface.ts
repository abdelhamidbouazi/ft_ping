export interface Ball {
    
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
    speed: number;
}


export interface Player{
    socketid : string;
    y : number;
}

export interface Rooms_{
    players : Player[];
    ball : Ball;
    state : boolean;
};