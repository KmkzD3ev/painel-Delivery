import { Routes,Route } from "react-router-dom";
import Singin from "../pages/Singin";
import Home from "../pages/Home/Home";
import Pedidos from "../pages/Pedidos";
import Dashboard from "../pages/Dashboard";


function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={<Singin/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Pedidos" element={<Pedidos/>}/>
            <Route path="/Dashboard" element={<Dashboard/>
        }/>

        </Routes>
    )
}
export default RoutesApp;