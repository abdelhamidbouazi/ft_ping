"use client"
import { useState , useContext, useEffect, useRef} from 'react';
import { DataContext} from './context';

import Modes from './Modes/modes';
import Templates from './Templates/templates';
import Startgame from './Game/mainGame';


function App() {

  const { component} = useContext(DataContext);
 
  return (
      <div className='h-full w-full'>
          {
            (component == "modes")       ? <Modes/>     : 
            (component == "templates")   ? <Templates/> : 
            (component === "startgame")  ? <Startgame/> : 
            <h1>you can&apos;t play you already logged in other place ... </h1>
          }
      </div>
    ); 
}

export default App;
