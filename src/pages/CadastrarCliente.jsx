import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";


function Clientes() {
  const [formData, setFormData] = useState({
    tipo: "Física",
    cpf_cnpj: "",
    nome: "",
    rg_ie: "",
    orgao_expedidor: "",
    email: "",
    cep: "",
    uf: "",
    pais: "BRASIL",
    municipio: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    telefone: "",
    situacao: "Ativo",
    fornecedor: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await invoke("cadastrar_cliente", { cliente: formData });
    alert("Cliente cadastrado com sucesso!");

    // Limpa os campos do formulário
  setFormData({
  tipo: "Física",
  cpf_cnpj: "",
  nome: "",
  rg_ie: "",
  orgao_expedidor: "",
  email: "",
  cep: "",
  uf: "",
  pais: "BRASIL",
  municipio: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  telefone: "",
  situacao: "Ativo",
  fornecedor: false
});

  } catch (error) {
  console.error("Erro ao cadastrar:", error);
  alert("Erro ao cadastrar cliente: " + (error?.toString() || "Erro desconhecido"));
}
};

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Pessoa</h1>

      <form className="form-pessoa" onSubmit={handleSubmit}>
        <div className="linha">
          <label>
            Tipo
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option>Física</option>
              <option>Jurídica</option>
            </select>
          </label>

          <label>
            CPF / CNPJ
            <input type="text" name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} />
          </label>

          <label className="fornecedor-label">
            Fornecedor
            <input type="checkbox" name="fornecedor" checked={formData.fornecedor} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            Nome
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            RG / Inscrição Estadual
            <input type="text" name="rg_ie" value={formData.rg_ie} onChange={handleChange} />
          </label>

          <label>
            Órgão Expedidor
            <input type="text" name="orgao_expedidor" value={formData.orgao_expedidor} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>

          <label>
            CEP
            <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
          </label>

          <label>
            UF
            <input type="text" name="uf" value={formData.uf} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            País
            <input type="text" name="pais" value={formData.pais} disabled />
          </label>

          <label>
            Município
            <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            Logradouro
            <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            Número
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
          </label>

          <label>
            Complemento
            <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
          </label>
        </div>

        <div className="linha">
          <label>
            Bairro
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
          </label>

          <label>
            Telefone
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
          </label>

          <label>
            Situação
            <select name="situacao" value={formData.situacao} onChange={handleChange}>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </label>
        </div>

        <div className="linha-botoes">
          <button type="submit" className="btn-confirmar">Confirmar</button>
          <button type="button" className="btn-excluir">Excluir</button>
          <button type="reset" className="btn-limpar" onClick={() => setFormData({
            tipo: "Física",
            cpf_cnpj: "",
            nome: "",
            rg_ie: "",
            orgao_expedidor: "",
            email: "",
            cep: "",
            uf: "",
            pais: "BRASIL",
            municipio: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            telefone: "",
            situacao: "Ativo",
            fornecedor: false
          })}>Limpar</button>
        </div>
      </form>
    </div>
  );
}

export default Clientes;
