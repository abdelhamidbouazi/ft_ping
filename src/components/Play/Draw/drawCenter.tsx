import React , {useContext} from 'react';
import drawRect from  './drawRect'


const drawCenter = (context:any, net:any) => {

  for (let i = 0; i <= net.canvasHeight; i += 15) {
    drawRect(context, net.x, net.y + i, net.width, net.height, net.color);
  }
};

export default drawCenter;