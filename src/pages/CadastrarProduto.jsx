import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const camposPorNicho = {
  mercado: { validade: true, tamanho: false, anvisa: false },
  roupas: { validade: false, tamanho: true, anvisa: false },
  farmacia: { validade: true, tamanho: false, anvisa: true },
  cosmeticos: { validade: true, tamanho: false, anvisa: false },
  eletronicos: { validade: false, tamanho: false, anvisa: false },
  autopecas: { validade: false, tamanho: false, anvisa: false },
  padaria: { validade: true, tamanho: false, anvisa: false },
  materialconstrucao: { validade: false, tamanho: false, anvisa: false },
};

function Produto() {
  const [produto, setProduto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [codigoFabricante, setCodigoFabricante] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [lucro, setLucro] = useState(0);
  const [margem, setMargem] = useState(0);
  const [estoque, setEstoque] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [unidade, setUnidade] = useState("");
  const [marca, setMarca] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [codigoAnvisa, setCodigoAnvisa] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [imagem, setImagem] = useState(null);

  const [tamanhos, setTamanhos] = useState([]);
  const [cores, setCores] = useState(["Branco", "Preto", "Azul"]);
  const [marcas, setMarcas] = useState(["Nike", "Adidas", "Sem Marca"]);
  const [categorias, setCategorias] = useState(["Camiseta", "Calça", "Tênis"]);
  const [unidades, setUnidades] = useState(["un", "kg", "lt"]);

  const [nicho, setNicho] = useState("");
  const [camposAtivos, setCamposAtivos] = useState({});

  // Carrega nicho e campos ativos da configuração salva
  useEffect(() => {
    const configStr = localStorage.getItem("configuracoesLoja");
    if (configStr) {
      const config = JSON.parse(configStr);
      setNicho(config.nicho || "");
      setCamposAtivos(camposPorNicho[config.nicho] || {});
    }
  }, []);

  // Calcular lucro e margem automaticamente
  useEffect(() => {
    const custo = parseFloat(precoCusto) || 0;
    const venda = parseFloat(precoVenda) || 0;
    const lucroCalc = venda - custo;
    setLucro(lucroCalc);
    setMargem(custo > 0 ? ((lucroCalc / custo) * 100).toFixed(2) : 0);
  }, [precoCusto, precoVenda]);

  const adicionarTamanho = () => {
    const novo = prompt("Digite um tamanho (ex: M, G, 42):");
    if (novo) setTamanhos([...tamanhos, novo]);
  };

  const handleImagemUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagem(URL.createObjectURL(file));
  };


    const salvarProduto = async () => {
    try {
      // montar o objeto produto que o backend espera, convertendo tipos onde necessário
      const produtoObj = {
        nome: produto,
        referencia,
        codigo_fabricante: codigoFabricante,
        codigo_barras: codigoBarras,
        descricao,
        categoria,
        preco_custo: parseFloat(precoCusto) || 0,
        preco_venda: parseFloat(precoVenda) || 0,
        lucro, // já calculado
        margem: parseFloat(margem) || 0,
        estoque: parseInt(estoque) || 0,
        estoque_minimo: parseInt(estoqueMinimo) || 0,
        unidade,
        marca,
        fornecedor,
        cor: corSelecionada,
        data_validade: dataValidade,
        codigo_anvisa: codigoAnvisa,
        status,
        imagem: imagem || null, // aqui você pode enviar a URL, ou melhor, salvar o arquivo e armazenar o path
        // id: opcional caso você implemente edição
      };

      await invoke("salvar_produto", { produto: produtoObj });
      alert("Produto salvo com sucesso!");
      // Limpar campos ou atualizar lista, se desejar
    } catch (error) {
      alert("Erro ao salvar produto: " + error);
    }
  };

  return (
    <div className="produto-container">
      <h1>Cadastro de Produto</h1>

      <div className="linha">
        <input
          type="text"
          placeholder="Nome do Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Código de Barras (EAN-13)"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
        />
      </div>

      <div className="linha">
        <input
          type="text"
          placeholder="Referência Interna / SKU"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
        <input
          type="text"
          placeholder="Código do Fabricante"
          value={codigoFabricante}
          onChange={(e) => setCodigoFabricante(e.target.value)}
        />
      </div>

      <div className="linha">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={marca} onChange={(e) => setMarca(e.target.value)}>
          <option value="">Marca</option>
          {marcas.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
          <option value="">Unidade</option>
          {unidades.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="linha">
        <input
          type="text"
          placeholder="Fornecedor"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />

        {/* Data de validade aparece só se ativo */}
        {camposAtivos.validade && (
          <input
            type="date"
            placeholder="Data de Validade"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
          />
        )}

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>

      {/* Código ANVISA aparece só se ativo */}
      {camposAtivos.anvisa && (
        <div className="linha">
          <input
            type="text"
            placeholder="Código ANVISA"
            value={codigoAnvisa}
            onChange={(e) => setCodigoAnvisa(e.target.value)}
          />
        </div>
      )}

      <div className="linha">
        <textarea
          placeholder="Descrição detalhada do produto..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
        />
      </div>

      <div className="linha">
        <input
          type="number"
          placeholder="Preço de Custo"
          value={precoCusto}
          onChange={(e) => setPrecoCusto(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço de Venda"
          value={precoVenda}
          onChange={(e) => setPrecoVenda(e.target.value)}
        />
        <input type="number" placeholder="Lucro" value={lucro} readOnly />
        <input type="number" placeholder="Margem %" value={margem} readOnly />
      </div>

      <div className="linha">
        <input
          type="number"
          placeholder="Estoque atual"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
        />
        <input
          type="number"
          placeholder="Estoque mínimo"
          value={estoqueMinimo}
          onChange={(e) => setEstoqueMinimo(e.target.value)}
        />
        <select
          value={corSelecionada}
          onChange={(e) => setCorSelecionada(e.target.value)}
        >
          <option value="">Cor</option>
          {cores.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>




      <div className="linha">
        <input type="file" accept="image/*" onChange={handleImagemUpload} />
        {imagem && <img src={imagem} alt="preview" width="100" />}
      </div>

      <div className="linha-botoes">
         <button className="btn-confirmar" type="button" onClick={salvarProduto}>
          Salvar Produto
        </button>
        <button className="btn-limpar" onClick={() => window.location.reload()}>
          Limpar
        </button>
      </div>
    </div>
  );
}

export default Produto;
