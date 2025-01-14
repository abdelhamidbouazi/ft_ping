import React, { useState } from "react";
import { Image } from "@nextui-org/react";
import achievement1 from "../../../../public/one.png";
import achievement2 from "../../../../public/two.png";
import achievement3 from "../../../../public/three.png";
import achievement4 from "../../../../public/four.png";
import achievement5 from "../../../../public/five.png";
import achievement6 from "../../../../public/six.png";

const Achievement = ({ user }) => {
  const [loading, setLoading] = useState(true);

  let imagesrc = "blur-[3px] grayscale";
  const nameAchievements = ['Newbie','AMATUR', 'SEMI-PRO', 'PRO', 'MASTER' ]
  const AchievementArray = new Array<string>(
    achievement1.src,
    achievement2.src,
    achievement3.src,
    achievement4.src,
    achievement5.src,
    achievement6.src
  );

  return (
    <div className="grid md:grid-cols-6 grid-cols-4 md:gap-14 gap-8">
      {user.achievements &&
        AchievementArray.map((item, index) => {
          if (user.achievements[index] && (nameAchievements.includes(user.achievements[index]))) imagesrc = '';
          else imagesrc = "blur-[5px] grayscale";
          return (
            <div key={index} className={`${imagesrc}`}>
              <Image alt={item} src={AchievementArray[index]} width={150}/>
              <p className="text-midnight-secondary">
                {user.achievements[index] ? user.achievements[index] : "????"}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Achievement;

