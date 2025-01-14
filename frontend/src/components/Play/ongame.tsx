
import  { useContext } from "react";
import { DataContext } from "./context";
function OnGame(){
    const {setComponent} = useContext(DataContext);
    return (
        <div>
            <h1> you are already on game , do you want to quit ? </h1>
            <div>
                <button>yes</button>
                <button>no</button>
            </div>
        </div>
    );
}
export default OnGame