import { FiX, FiUpload } from 'react-icons/fi';
import { useState } from 'react';
import './modal.css';

export default function Modal({ produto, close, atualizarComFoto, atualizarSemFoto, deletar, adicionarNovoProduto, isAddingNew }) {
  const [novoNome, setNovoNome] = useState(isAddingNew ? '' : produto.nome);
  const [novaDescricao, setNovaDescricao] = useState(isAddingNew ? '' : produto.descricao);
  const [novoPreco, setNovoPreco] = useState(isAddingNew ? '' : produto.preco);
  const [novaImagem, setNovaImagem] = useState(null);

  const handleSave = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!novoNome || !novaDescricao || !novoPreco) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    if (isAddingNew) {
      // Chama a função para adicionar um novo produto
      adicionarNovoProduto({
        nome: novoNome,
        descricao: novaDescricao,
        preco: novoPreco,
        foto: novaImagem
      });
    } else {
      handleUpdate();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setNovaImagem(image);
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG");
        setNovaImagem(null);
      }
    }
  };

  const handleUpdate = () => {
    const produtoAtualizado = {
      ...produto,
      nome: novoNome,
      descricao: novaDescricao,
      preco: novoPreco,
      foto: novaImagem || produto.foto,
    };
    if (novaImagem) {
      atualizarComFoto(produtoAtualizado);
    } else {
      atualizarSemFoto(produtoAtualizado);
    }
  };

  return (
    <div className="modal">
      <div className="conteiner">
        <button className="close" onClick={close}>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>{isAddingNew ? 'Adicionar Novo Produto' : 'Detalhes do Produto'}</h2>

          <div className="row">
            <label>Nome:</label>
            <input className='caixas' type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
          </div>

          <div className="row">
            <label>Descrição:</label>
            <textarea className='caixas' value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} />
          </div>

          <div className="row">
            <label>Preço:</label>
            <input className='caixas' type="number" value={novoPreco} onChange={(e) => setNovoPreco(e.target.value)} />
          </div>

          <div className="row">
            <label>Foto:</label>
            <div className="file-input">
              <FiUpload color="black" size={25} />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            {novaImagem ? (
              <img src={URL.createObjectURL(novaImagem)} alt={produto.nome} />
            ) : (
              !isAddingNew && <img src={produto.foto} alt={produto.nome} />
            )}
          </div>

          <div className="row">
            <button onClick={handleSave}>{isAddingNew ? 'Adicionar' : 'Atualizar'}</button>
          </div>

          {!isAddingNew && (
            <div>
              <button onClick={() => deletar(produto.id)}>Deletar Produto</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
