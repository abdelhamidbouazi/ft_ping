const drawRect = (context:any, x:number, y:number, w:number, h:number, color:string) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  };
  
  export default drawRect;