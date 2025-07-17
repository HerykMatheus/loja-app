import React, { useState, useEffect } from "react";
import "../style/formulario.css";

function Produto() {
  const [produto, setProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [lucro, setLucro] = useState(0);
  const [estoque, setEstoque] = useState("");
  const [unidade, setUnidade] = useState("");
  const [marca, setMarca] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");
  const [status, setStatus] = useState("Ativo");

  const [tamanhos, setTamanhos] = useState([]);
  const [cores, setCores] = useState(["Branco", "Preto", "Azul"]);
  const [marcas, setMarcas] = useState(["Nike", "Adidas", "Sem Marca"]);
  const [unidades, setUnidades] = useState(["un", "kg", "lt"]);

  const adicionarTamanho = () => {
    const novo = prompt("Digite um tamanho (ex: M, G, 42):");
    if (novo) setTamanhos([...tamanhos, novo]);
  };

  // Calcular lucro automaticamente
  useEffect(() => {
    const custo = parseFloat(precoCusto) || 0;
    const venda = parseFloat(precoVenda) || 0;
    setLucro(venda - custo);
  }, [precoCusto, precoVenda]);

  return (
    <div className="produto-container">
      <h1>Cadastro de Produto</h1>

      <div className="linha">
        <input
          type="text"
          placeholder="Produto ..."
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        />
      </div>

      <div className="linha">
        <input
          type="text"
          placeholder="Ref. Produto SKU interno ou Cód Fabricante"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />

        <select value={marca} onChange={(e) => setMarca(e.target.value)}>
          <option value="">Selecione a marca</option>
          {marcas.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="linha">
        <input
          type="number"
          placeholder="Preço Custo"
          value={precoCusto}
          onChange={(e) => setPrecoCusto(e.target.value)}
        />

        <input
          type="number"
          placeholder="Preço Venda"
          value={precoVenda}
          onChange={(e) => setPrecoVenda(e.target.value)}
        />

        <input
          type="number"
          placeholder="Lucro"
          value={lucro}
          readOnly
        />
      </div>

      <div className="linha">
        <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
          <option value="">Unidade</option>
          {unidades.map((u, i) => (
            <option key={i} value={u}>{u}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Estoque atual"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>

      <div className="linha">
        <select value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)}>
          <option value="">Selecione a cor</option>
          {cores.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="linha">
        <button type="button" className="btn-card" onClick={adicionarTamanho}>
          ➕ Tamanho
        </button>

        <button type="button" className="btn-card">
          ➕ Cor
        </button>
      </div>

      <div className="linha-botoes">
        <button className="btn-confirmar">Gerar Produtos</button>
        <button className="btn-limpar" onClick={() => window.location.reload()}>
          Limpar
        </button>
      </div>
    </div>
  );
}

export default Produto;
