// pages/Mode.js
import Mode from "./mode";
import { DataContext } from "../context";
import { useContext, useEffect } from "react";


const Modes = () => {
  const { log, invite, setInvite } = useContext(DataContext);

  useEffect(() => {
    // Perform side effects here (runs after component mount)
    setInvite(false);
    log.current = true;

    // Clean-up function (optional)
    return () => {
      // Any clean-up code if needed
    };
  }, []);
  
  const data = [
    { imagePath: "/images/ImageFriend.png", modeName: "Difficult Bot" },
    { imagePath: "/images/ImageRandom.png", modeName: "Random" },
    { imagePath: "/images/ImageRobot.png", modeName: "Bot" },
  ];


  return (
    <div className=" w-full  h-[92%] flex flex-col justify-around items-center rounded-2xl">
               
                <div className="h-4/6  w-5/6 md:h-5/6 lg:h-4/6 2xl:h-5/6 border border-midnight-border  rounded-2xl flex justify-around flex-col" >
                    <div className= " h-4/5 md:h-5/6 w-full flex justify-center flex-wrap gap-6" >
                    <h5 className=" w-full text-midnight-secondary text-center text-2xl " >POOONG! Let`s play. Choose an option to start</h5>
                        {data && data.map((item, index) => (<Mode key={index} name={item.modeName} image={item.imagePath} />))}
                    </div>
                </div>
            </div>
  );
};

export default Modes;