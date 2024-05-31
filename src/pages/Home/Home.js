import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { auth, signOut } from '../../services/firebaseconection';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseconection';
import Modal from '../Components/Modal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './layout.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const navigate = useNavigate();
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtosCollection = collection(db, 'Produtos');
        const produtosSnapshot = await getDocs(produtosCollection);
        const produtosList = produtosSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProdutos(produtosList);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    fetchData();
  }, []);

  const atualizarComFoto = async (produtoAtualizado) => {
    try {
      if (produtoAtualizado.foto instanceof File) {
        const storageRef = ref(storage, `produtos/${produtoAtualizado.foto.name}`);
        await uploadBytes(storageRef, produtoAtualizado.foto);
        produtoAtualizado.foto = await getDownloadURL(storageRef);
      }
      const produtoRef = doc(db, 'Produtos', produtoAtualizado.id);
      await updateDoc(produtoRef, {
        nome: produtoAtualizado.nome,
        descricao: produtoAtualizado.descricao,
        preco: produtoAtualizado.preco,
        foto: produtoAtualizado.foto
      });
      setProdutos((prevProdutos) => prevProdutos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
      setProdutoSelecionado(null);
      toast.success("Produto atualizado com Sucesso")
    } catch (error) {
        toast.error("Ops! erro ao atualizar Produto")
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const atualizarSemFoto = async (produtoAtualizado) => {
    try {
      const produtoRef = doc(db, 'Produtos', produtoAtualizado.id);
      await updateDoc(produtoRef, {
        nome: produtoAtualizado.nome,
        descricao: produtoAtualizado.descricao,
        preco: produtoAtualizado.preco
      });
      setProdutos((prevProdutos) => prevProdutos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
      setProdutoSelecionado(null);
      toast.success("Produto atualizado com Sucesso")
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const deletar = async (id) => {
    try {
      const produtoRef = doc(db, 'Produtos', id);
      await deleteDoc(produtoRef);
      setProdutos((prevProdutos) => prevProdutos.filter(p => p.id !== id));
      toast.success("Produto Deletado com Sucesso")
    } catch (error) {
        toast.error("Ops! erro ao Deletar Produto")
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleAddProd = () => {
    setProdutoSelecionado(null);
    setIsAddingNew(true);
  };

  const handleSignout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const adicionarNovoProduto = async (novoProduto) => {
    try {
      // Verifica se todos os campos obrigatórios estão preenchidos
      if (!novoProduto.nome || !novoProduto.descricao || !novoProduto.preco) {
        throw new Error('Todos os campos são obrigatórios.');
      }
      if (novoProduto.foto instanceof File) {
        // Se a foto for um arquivo, faz o upload para o Firebase Storage
        const storageRef = ref(storage, `produtos/${novoProduto.foto.name}`);
        await uploadBytes(storageRef, novoProduto.foto);
        novoProduto.foto = await getDownloadURL(storageRef);
      }
      // Adiciona um novo documento na coleção de produtos com os dados do novo produto
      const produtoRef = await addDoc(collection(db, 'Produtos'), {
        nome: novoProduto.nome,
        descricao: novoProduto.descricao,
        preco: novoProduto.preco,
        foto: novoProduto.foto || ''
      });
      // Atualiza o estado dos produtos com o novo produto
      setProdutos([...produtos, { id: produtoRef.id, ...novoProduto }]);
      setIsAddingNew(false);
      toast.success("Produto adcionado com Sucesso")
    } catch (error) {
      console.error('Erro ao adicionar novo produto:', error);
      toast.error("Ops! erro ao atualizar Produto")
    }
  };

  return (
    <div>
      <Header />
      <div className="content-container">
      <ToastContainer />
        <div className='title-pag'>
          <h1>Supermercado Borcele</h1>
          <button className='adcProduto' onClick={handleAddProd}>Adicionar Produto</button>
          <button className='logof' onClick={handleSignout}>Sair</button>
        </div>
        <div className="card-container">
          {produtos.map(produto => (
            <div key={produto.id} className="card" onClick={() => { setProdutoSelecionado(produto); setIsAddingNew(false); }}>
              <h2>{produto.nome}</h2>
              <p>{produto.descricao}</p>
              <img src={produto.foto} alt={produto.nome} />
              <p>
                <span className="preco-texto">Preço:</span>{' '}
                <span className="preco-valor">{produto.preco}</span>
              </p>
            </div>
          ))}
        </div>
        {(produtoSelecionado || isAddingNew) && (
          <Modal
            produto={produtoSelecionado || {}}
            close={() => { setProdutoSelecionado(null); setIsAddingNew(false); }}
            atualizarComFoto={atualizarComFoto}
            atualizarSemFoto={atualizarSemFoto}
            deletar={deletar}
            adicionarNovoProduto={adicionarNovoProduto}
            isAddingNew={isAddingNew}
          />
        )}
      </div>
    </div>
  );
}
