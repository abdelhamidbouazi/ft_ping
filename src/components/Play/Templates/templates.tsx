
import Template from './temp';
import { DataContext } from '../context';
import { useContext } from 'react';
import { Button } from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';

const Templates = (props: any) => {

  const data = [{ color: 'green', text: "Green Temp" }, { color: 'orange', text: "Orange Temp" }, { color: 'black', text: "Default" }];
  const { setComponent } = useContext(DataContext);
  return (
    <div className="  w-full  h-[92%] flex flex-col justify-around items-center rounded-2xl" >
      <div className=" w-full h-full flex flex-wrap flex-col lg:flex-row justify-around items-center">
        <Button startContent={<Icon
          icon="solar:arrow-left-bold-duotone"
        />} className="border border-midnight-border text-midnight-secondary bg-midnight hover:bg-midnight-secondary hover:text-midnight" onClick={() => { setComponent("modes"); }}>Back</Button>
        {data.map((item, index) => (<Template key={index} color={item.color} text={item.text} />))}
      </div>
    </div>);
};

export default Templates;



