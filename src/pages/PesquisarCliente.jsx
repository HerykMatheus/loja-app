import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function PesquisarCliente() {
  const [clientes, setClientes] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Carrega clientes do backend
  const carregarClientes = async () => {
    setLoading(true);
    try {
      const lista = await invoke("listar_clientes");
      setClientes(lista);
    } catch (error) {
      alert("Erro ao buscar clientes: " + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Atualiza campo do cliente selecionado no formulário
  const atualizarCampo = (campo, valor) => {
    setSelecionado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Salvar edição
  const salvarEdicao = async () => {
    if (!selecionado || !selecionado.id) {
      alert("Nenhum cliente selecionado para editar.");
      return;
    }

    setLoading(true);
    try {
      await invoke("editar_cliente", { cliente: selecionado });
      alert("Cliente atualizado com sucesso!");
      setSelecionado(null);
      await carregarClientes();
    } catch (error) {
      alert("Erro ao atualizar cliente: " + error);
    }
    setLoading(false);
  };

  // Excluir cliente
  const excluirCliente = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    setLoading(true);
    try {
      await invoke("excluir_cliente", { id });
      alert("Cliente excluído com sucesso!");
      if (selecionado && selecionado.id === id) setSelecionado(null);
      await carregarClientes();
    } catch (error) {
      alert("Erro ao excluir cliente: " + error);
    }
    setLoading(false);
  };

  // Filtra clientes pelo nome ou CPF/CNPJ conforme o filtro
  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = filtro.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.cpf_cnpj.toLowerCase().includes(termo)
    );
  });

  return (
    <div style={{ display: "flex", gap: 40, padding: 20 }}>
      <div style={{ flex: 1 }}>
        <h2>Lista de Clientes</h2>

        {/* Campo de busca com ícone lupa */}
        <div style={{ marginBottom: 10, position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
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
        {!loading && clientesFiltrados.length === 0 && <p>Nenhum cliente encontrado.</p>}
        {!loading && clientesFiltrados.length > 0 && (
          <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 400, overflowY: "auto" }}>
            {clientesFiltrados.map((cliente) => (
              <li
                key={cliente.id}
                onClick={() => setSelecionado(cliente)}
                style={{
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: selecionado?.id === cliente.id ? "#e6f7ff" : "transparent",
                }}
              >
                {cliente.nome} ({cliente.cpf_cnpj})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h2>Editar Cliente</h2>
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
              CPF/CNPJ:
              <input
                type="text"
                value={selecionado.cpf_cnpj || ""}
                onChange={(e) => atualizarCampo("cpf_cnpj", e.target.value)}
                required
              />
            </label>

            <label>
              Tipo:
              <input
                type="text"
                value={selecionado.tipo || ""}
                onChange={(e) => atualizarCampo("tipo", e.target.value)}
              />
            </label>

            <label>
              E-mail:
              <input
                type="email"
                value={selecionado.email || ""}
                onChange={(e) => atualizarCampo("email", e.target.value)}
              />
            </label>

            <label>
              Telefone:
              <input
                type="text"
                value={selecionado.telefone || ""}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
              />
            </label>

            <label>
              Fornecedor:
              <input
                type="checkbox"
                checked={selecionado.fornecedor || false}
                onChange={(e) => atualizarCampo("fornecedor", e.target.checked)}
              />
            </label>

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
                onClick={() => excluirCliente(selecionado.id)}
              >
                × Excluir
              </button>

              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
                onClick={() => setSelecionado(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <p>Selecione um cliente da lista para editar.</p>
        )}
      </div>
    </div>
  );
}
