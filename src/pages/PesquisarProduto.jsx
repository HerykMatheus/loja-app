import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function PesquisarProduto() {
  const [produtos, setProdutos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const lista = await invoke("listar_produtos");
      setProdutos(lista);
    } catch (error) {
      alert("Erro ao buscar produtos: " + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const atualizarCampo = (campo, valor) => {
    setSelecionado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const salvarEdicao = async () => {
    if (!selecionado || !selecionado.id) {
      alert("Nenhum produto selecionado para editar.");
      return;
    }

    setLoading(true);
    try {
      // Se algum campo numérico veio como string, converta aqui antes de enviar
      const produtoParaSalvar = {
        ...selecionado,
        preco_custo: Number(selecionado.preco_custo) || 0,
        preco_venda: Number(selecionado.preco_venda) || 0,
        lucro: Number(selecionado.lucro) || 0,
        margem: Number(selecionado.margem) || 0,
        estoque: Number(selecionado.estoque) || 0,
        estoque_minimo: Number(selecionado.estoque_minimo) || 0,
      };

      await invoke("editar_produto", { produto: produtoParaSalvar });
      alert("Produto atualizado com sucesso!");
      setSelecionado(null);
      await carregarProdutos();
    } catch (error) {
      alert("Erro ao atualizar produto: " + error);
    }
    setLoading(false);
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    setLoading(true);
    try {
      await invoke("excluir_produto", { id });
      alert("Produto excluído com sucesso!");
      if (selecionado && selecionado.id === id) setSelecionado(null);
      await carregarProdutos();
    } catch (error) {
      alert("Erro ao excluir produto: " + error);
    }
    setLoading(false);
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = filtro.toLowerCase();
    return produto.nome.toLowerCase().includes(termo);
  });

  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      <div style={{ flex: 1 }}>
        <h2>Lista de Produtos</h2>

        <div style={{ marginBottom: 10, position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ width: "100%", padding: "8px 30px 8px 8px", boxSizing: "border-box" }}
          />
          <span
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#888",
              fontSize: 18,
            }}
          >
            🔍
          </span>
        </div>

        {loading && <p>Carregando...</p>}
        {!loading && produtosFiltrados.length === 0 && <p>Nenhum produto encontrado.</p>}
        {!loading && produtosFiltrados.length > 0 && (
          <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 400, overflowY: "auto" }}>
            {produtosFiltrados.map((produto) => (
              <li
                key={produto.id}
                onClick={() => setSelecionado(produto)}
                style={{
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: selecionado?.id === produto.id ? "#e6f7ff" : "transparent",
                }}
              >
                {produto.nome} - R$ {(produto.preco_venda ?? 0).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h2>Editar Produto</h2>
        {selecionado ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              salvarEdicao();
            }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <label>
              Nome:
              <input
                type="text"
                value={selecionado.nome || ""}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
                required
              />
            </label>

            <label>
              Referência:
              <input
                type="text"
                value={selecionado.referencia || ""}
                onChange={(e) => atualizarCampo("referencia", e.target.value)}
              />
            </label>

            <label>
              Código do Fabricante:
              <input
                type="text"
                value={selecionado.codigo_fabricante || ""}
                onChange={(e) => atualizarCampo("codigo_fabricante", e.target.value)}
              />
            </label>

            <label>
              Código de Barras:
              <input
                type="text"
                value={selecionado.codigo_barras || ""}
                onChange={(e) => atualizarCampo("codigo_barras", e.target.value)}
              />
            </label>

            <label>
              Categoria:
              <input
                type="text"
                value={selecionado.categoria || ""}
                onChange={(e) => atualizarCampo("categoria", e.target.value)}
              />
            </label>

            <label>
              Preço de Custo:
              <input
                type="number"
                step="0.01"
                value={selecionado.preco_custo || ""}
                onChange={(e) => atualizarCampo("preco_custo", e.target.value)}
              />
            </label>

            <label>
              Preço de Venda:
              <input
                type="number"
                step="0.01"
                value={selecionado.preco_venda || ""}
                onChange={(e) => atualizarCampo("preco_venda", e.target.value)}
              />
            </label>

            <label>
              Lucro:
              <input
                type="number"
                step="0.01"
                value={selecionado.lucro || ""}
                onChange={(e) => atualizarCampo("lucro", e.target.value)}
                readOnly
              />
            </label>

            <label>
              Margem (%):
              <input
                type="number"
                step="0.01"
                value={selecionado.margem || ""}
                onChange={(e) => atualizarCampo("margem", e.target.value)}
                readOnly
              />
            </label>

            <label>
              Estoque:
              <input
                type="number"
                value={selecionado.estoque || ""}
                onChange={(e) => atualizarCampo("estoque", e.target.value)}
              />
            </label>

            <label>
              Estoque Mínimo:
              <input
                type="number"
                value={selecionado.estoque_minimo || ""}
                onChange={(e) => atualizarCampo("estoque_minimo", e.target.value)}
              />
            </label>

            <label>
              Unidade:
              <input
                type="text"
                value={selecionado.unidade || ""}
                onChange={(e) => atualizarCampo("unidade", e.target.value)}
              />
            </label>

            <label>
              Marca:
              <input
                type="text"
                value={selecionado.marca || ""}
                onChange={(e) => atualizarCampo("marca", e.target.value)}
              />
            </label>

            <label>
              Fornecedor:
              <input
                type="text"
                value={selecionado.fornecedor || ""}
                onChange={(e) => atualizarCampo("fornecedor", e.target.value)}
              />
            </label>

            <label>
              Cor:
              <input
                type="text"
                value={selecionado.cor || ""}
                onChange={(e) => atualizarCampo("cor", e.target.value)}
              />
            </label>

            <label>
              Data de Validade:
              <input
                type="date"
                value={selecionado.data_validade || ""}
                onChange={(e) => atualizarCampo("data_validade", e.target.value)}
              />
            </label>

            <label>
              Código ANVISA:
              <input
                type="text"
                value={selecionado.codigo_anvisa || ""}
                onChange={(e) => atualizarCampo("codigo_anvisa", e.target.value)}
              />
            </label>

            <label>
              Status:
              <select
                value={selecionado.status || "Ativo"}
                onChange={(e) => atualizarCampo("status", e.target.value)}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </label>

            <label>
              Descrição:
              <textarea
                rows={3}
                value={selecionado.descricao || ""}
                onChange={(e) => atualizarCampo("descricao", e.target.value)}
              />
            </label>

            {/* Se quiser, pode implementar preview/edição da imagem aqui */}

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "yellowgreen",
                  color: "#000",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                ✓ Salvar
              </button>

              <button
                type="button"
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
                onClick={() => excluirProduto(selecionado.id)}
              >
                × Excluir
              </button>

              <button
                type="button"
                style={{ padding: "8px 16px", cursor: "pointer" }}
                onClick={() => setSelecionado(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <p>Selecione um produto da lista para editar.</p>
        )}
      </div>
    </div>
  );
}
