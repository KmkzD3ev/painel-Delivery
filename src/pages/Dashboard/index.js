import { useEffect, useState } from 'react';
import './dashboard.css';
import { db } from '../../services/firebaseconection'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Header from '../Components/Header';

const Dashboard = () => {
  const [contagemVendas, setContagemVendas] = useState([]);
  const [comprasUsuario, setComprasUsuario] = useState([]);
  const [pedidosUser, setPedidosUser] = useState([]);

  useEffect(() => {
    const fetchContagemVendas = async () => {
      const contagemVendasRef = collection(db, 'ContagemVendas');
      const contagemVendasSnapshot = await getDocs(contagemVendasRef);
      const contagemVendasData = contagemVendasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContagemVendas(contagemVendasData);
      console.log('Contagem de Vendas:', contagemVendasData); 
    };

    const fetchComprasUsuario = async () => {
      const comprasRef = collection(db, 'Compras');
      const comprasSnapshot = await getDocs(comprasRef);
      const comprasData = comprasSnapshot.docs.map((compraDoc) => {
        const data = compraDoc.data();
        return {
          id: compraDoc.id,
          valor: data.valor,
          data: data.data
        };
      });
      setComprasUsuario(comprasData);
      console.log('Compras:', comprasData); 
    };

    const fetchPedidosUsuario = async () => {
      const usuarioPedidosRef = collection(db, 'Pedidos_Adm');
      const usuarioPedidosSnapshot = await getDocs(usuarioPedidosRef);
      const pedidosData = usuarioPedidosSnapshot.docs.map((pedidoDoc) => {
        const data = pedidoDoc.data();
        console.log('Data recuperada do documento:', data);  // Adiciona log para verificar dados recuperados
      
        const dataCompra = data.dataCompra.toDate();
        return {
          id: pedidoDoc.id,
          valor: data.totalPedidos,
          dataCompra: dataCompra  
        };
      });
      setPedidosUser(pedidosData);
      console.log('Pedidos do Usuário:', pedidosData); 
    };

    const fetchData = async () => {
      await fetchContagemVendas();
      await fetchComprasUsuario();
      await fetchPedidosUsuario();
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header/>
      <div className='conteiner-grf'>
        <h1>Tela Dashboard</h1>
  
        <h2>Contagem de Vendas</h2>
      
        <BarChart width={800} height={300} data={contagemVendas} responsive>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="vendas" fill="#FFA500" />
        </BarChart>
  
        <h2>Compras do Usuário</h2>
        <BarChart width={800} height={300} data={comprasUsuario} responsive>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="valor" fill="#40E0D0" />
        </BarChart>

    


        <h2>Vendas do Dia</h2>
        <BarChart width={800} height={300} data={pedidosUser} responsive>
       <CartesianGrid strokeDasharray="2 2" />
           <XAxis dataKey="dataCompra" />
             <YAxis />
              <Tooltip />
               <Legend />
            <Bar dataKey="valor" fill="#008000" />
        </BarChart>

      
      </div>
    </div>
  );
};

export default Dashboard;