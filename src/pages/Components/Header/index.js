import './header.css';

import { Link } from 'react-router-dom'
import logo from "./logo2.png";


import { FiHome,FiUser, FiSettings,FiBarChart2 } from 'react-icons/fi'


export default function Header(){



    return(
        <div className="sidebar">
            <div>
            <img src={logo} alt="Logo" />
            </div>

        <Link to={'/Home'}>
        <FiHome color="#fff" size={24}/>
        Home
        </Link>

        <Link to ='/Dashboard'>
        <FiBarChart2 color="#FFF" size={24}/>
        Estatisticas e vendas
        </Link>

        <Link to ='/Pedidos'>
        <FiUser color="#fff" size={24}/>
        Pedidos
        </Link>

      





        </div>
    )
}

