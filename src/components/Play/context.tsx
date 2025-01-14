"use client"
import { useState , createContext, useRef} from 'react';

export const DataContext = createContext<any>(undefined);

//interfaces
interface player1   {username:string, skills : string,image : string , score : number};
interface player2   {username:string, skills : string,image : string , score : number};
interface Data {win : boolean ,isjoin : boolean ,start : boolean , roomId : number};

export const DataProvider = ({ children }) => {

  const [player1  , setPlayer1      ]  = useState <player1> ({username:"waiting...", skills : "noob",image : "" , score : 0});
  const [player2  , setPlayer2      ]  = useState <player2> ({username:"waiting...", skills : "pro",image : "" , score : 0});
  const [data     , setData         ]  = useState <Data>    ({win : false ,isjoin : false ,start : false , roomId : -1});
  const [socket   , setSocket       ]  = useState           (null);
  const [globalSocket   , setGlobalSocket       ]  = useState           (null);
  const [component, setComponent    ]  = useState <string>  ("modes");
  const [color  , setColor          ]  = useState("black");
  const [invite, setInvite    ]  = useState(false);
  let log = useRef(true);
  const sharedValue = {invite , setInvite , log,globalSocket, setGlobalSocket, player1,player2,socket,component,data,color,setColor,setPlayer1,setPlayer2,setSocket,setComponent,setData};

return (
    <DataContext.Provider value={sharedValue}>
      {children}
    </DataContext.Provider>
);
}