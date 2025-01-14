const drawCircle = (context:any, x:number, y:number, radius:number, color:string) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  };
  
  export default drawCircle;