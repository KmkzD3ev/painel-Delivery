import Header from "../Components/Header";
import './pedidos.css'
import { PDFDocument, rgb } from 'pdf-lib';
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseconection';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function formatarTextoPedido(pedido) {
    const { id, celular, endereco, entregastatus, nomeUsuario, pedidoiD, pontoRefere, status_pagamentos, usuarioId } = pedido;

    return `
        ID do Pedido: ${id}
        Nome do Usuário: ${nomeUsuario}
        Celular: ${celular}
        Endereço: ${endereco}
        Status de Pagamentos: ${status_pagamentos}
    `;
}

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pedidosCollection = collection(db, 'Pedidos_Adm');
                const pedidosSnapshot = await getDocs(pedidosCollection);
                const pedidosList = pedidosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    celular: doc.data().celular,
                    endereco: doc.data().endereco,
                    entregastatus: doc.data().entregastatus,
                    listaprodutos: doc.data().listaprodutos,
                    nomeUsuario: doc.data().nomeUsuario,
                    pedidoiD: doc.data().pedidoiD,
                    pontoRefere: doc.data().pontoRefere,
                    status_pagamentos: doc.data().status_pagamentos,
                    usuarioId: doc.data().usuarioId
                }));
                console.log(pedidosList);
                setPedidos(pedidosList);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };
        fetchData();
    }, []);

    async function gerarPDF(pedido) {
        try {
            // Cria um novo documento PDF
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
    
            // Adiciona o conteúdo do pedido ao PDF
            const textoFormatado = formatarTextoPedido(pedido);
            page.drawText(textoFormatado, { x: 50, y: 800, size: 10 });
    
            // Serializa o PDF para bytes
            const pdfBytes = await pdfDoc.save();
    
            // Cria um Blob a partir dos bytes do PDF
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
            // Cria uma URL do Blob para abrir o PDF
            const url = URL.createObjectURL(blob);
    
            // Abre o PDF em uma nova aba
            window.open(url);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    }

    async function attEntregaPedidoAdm(statusEntrega, pedidoId) {
        try {
            const pedidoRef = doc(db, 'Pedidos_Adm', pedidoId);
            await updateDoc(pedidoRef, { entregastatus: statusEntrega });
            console.log('Status de entrega atualizado com sucesso.');
            // Atualizar o estado local para refletir a mudança
            setPedidos(prevPedidos => prevPedidos.map(pedido => 
                pedido.id === pedidoId ? { ...pedido, entregastatus: statusEntrega } : pedido
            ));
            toast.success('Status de entrega atualizado com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar status de entrega:', error);
        }
    }
    
    return (
        <div className="container1">
            <Header />
            <div className="card-container1">
                <ToastContainer/>
                {pedidos.map(pedido => (
                    <div key={pedido.id} className={`card1 ${pedido.entregastatus === 'Em Andamento' ? 'inProgress' : 'delivered'}`}>
                        <h2>{pedido.nomeUsuario}</h2>
                        <p>Celular: <br/>{pedido.celular}</p>
                        <p>Endereço: <br/>{pedido.endereco}</p>
                        <p>Status de Entrega: <br/>{pedido.entregastatus}</p>
                        <h3>Lista de Produtos:</h3>
                        <br/>
                        <ul>
                            {pedido.listaprodutos.map(produto => (
                                <li key={produto.id}>{produto.nome} - Preço: {produto.preco}</li>
                            ))}
                        </ul>
                        <br/>
                        <p>ID do Pedido: <br/>{pedido.pedidoiD}</p>
                        <br/>
                        <p>Ponto de Referência: <br/>{pedido.pontoRefere}</p>
                        <br/>
                        <p>Status de Pagamentos: <br/>{pedido.status_pagamentos}</p>
                        <br/>
                        <p>ID do Usuário: <br/>{pedido.usuarioId}</p>
                        <button onClick={() => gerarPDF(pedido)}>Gerar PDF</button>
                        <div className="status-selector">
                            <label>
                                <input 
                                    type="radio" 
                                    name={`status${pedido.id}`} 
                                    className="custom-radio1"
                                    value="Entregue"
                                    checked={pedido.entregastatus === 'Entregue'}
                                    onChange={() => attEntregaPedidoAdm('Entregue', pedido.id)}
                                />
                                Entregue
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name={`status${pedido.id}`} 
                                    className="custom-radio2"
                                    value="Saiu pra Entrega"
                                    checked={pedido.entregastatus === 'Saiu pra Entrega'}
                                    onChange={() => attEntregaPedidoAdm('Saiu pra Entrega', pedido.id)}
                                />
                                Saiu pra Entrega
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
