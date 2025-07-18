import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const nichos = [
  { value: "", label: "Selecione o nicho" },
  { value: "mercado", label: "Mercado / Mini Mercado" },
  { value: "roupas", label: "Loja de Roupas" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "farmacia", label: "Farmácia" },
  { value: "cosmeticos", label: "Cosméticos / Beleza" },
  { value: "autopecas", label: "Auto Peças" },
  { value: "padaria", label: "Padaria" },
  { value: "materialconstrucao", label: "Material de Construção" },
];

const temas = [
  { value: "claro", label: "Claro (branco e azul)" },
  { value: "escuro", label: "Escuro (preto e laranja)" },
  { value: "azul", label: "Azul (tons de azul)" },
  { value: "verde", label: "Verde (lojas naturais ou hortifruti)" },
  { value: "rosa", label: "Rosa (tons de rosa)" },
];

// Configurações padrão baseadas no primeiro código, com base no nicho
const configuracoesPadrao = {
  roupas: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: true,
        unidade: ["un"],
        // validacao dinâmica por segundo código
        codigoAnvisa: false,
        validade: false,
      },
    },
  },
  mercado: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un", "kg", "lt"],
        codigoAnvisa: false,
        validade: true,
      },
    },
  },
  farmacia: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: true,
        validade: true,
      },
    },
  },
  cosmeticos: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: false,
        validade: true,
      },
    },
  },
  eletronicos: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: false,
        validade: false,
      },
    },
  },
  autopecas: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: false,
        validade: false,
      },
    },
  },
  padaria: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: false,
        validade: true,
      },
    },
  },
  materialconstrucao: {
    cadastroCliente: true,
    cadastroProduto: {
      ativo: true,
      campos: {
        marca: true,
        tamanho: false,
        unidade: ["un"],
        codigoAnvisa: false,
        validade: false,
      },
    },
  },
};

export default function ConfiguracaoCompleta({ onConfiguracaoSalva }) {
  const [nomeLoja, setNomeLoja] = useState("");
  const [nicho, setNicho] = useState("");
  const [tema, setTema] = useState("claro");
  const [configAtual, setConfigAtual] = useState(null);

  const navigate = useNavigate();

  // Ao mudar o nicho, carrega config padrão (deep copy)
  useEffect(() => {
    if (nicho) {
      const copia = JSON.parse(JSON.stringify(configuracoesPadrao[nicho] || null));
      setConfigAtual(copia);
    } else {
      setConfigAtual(null);
    }
  }, [nicho]);

  // Toggle checkbox simples (booleano) no nível cadastroCliente
  const toggleCampo = (campo) => {
    setConfigAtual((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }));
  };

  // Toggle campos dentro cadastroProduto.campos
  const toggleCampoCadastroProduto = (campo) => {
    setConfigAtual((prev) => ({
      ...prev,
      cadastroProduto: {
        ...prev.cadastroProduto,
        campos: {
          ...prev.cadastroProduto.campos,
          [campo]: !prev.cadastroProduto.campos[campo],
        },
      },
    }));
  };

  // Toggle ativo cadastroProduto
  const toggleCadastroProdutoAtivo = () => {
    setConfigAtual((prev) => ({
      ...prev,
      cadastroProduto: {
        ...prev.cadastroProduto,
        ativo: !prev.cadastroProduto.ativo,
      },
    }));
  };

  // Adicionar unidade na lista
  const adicionarUnidade = () => {
    const novaUnidade = prompt("Digite uma nova unidade (ex: kg, lt, un):");
    if (
      novaUnidade &&
      novaUnidade.trim() !== "" &&
      !configAtual.cadastroProduto.campos.unidade.includes(novaUnidade.trim())
    ) {
      setConfigAtual((prev) => ({
        ...prev,
        cadastroProduto: {
          ...prev.cadastroProduto,
          campos: {
            ...prev.cadastroProduto.campos,
            unidade: [...prev.cadastroProduto.campos.unidade, novaUnidade.trim()],
          },
        },
      }));
    }
  };

  // Remover unidade
  const removerUnidade = (unidade) => {
    setConfigAtual((prev) => ({
      ...prev,
      cadastroProduto: {
        ...prev.cadastroProduto,
        campos: {
          ...prev.cadastroProduto.campos,
          unidade: prev.cadastroProduto.campos.unidade.filter((u) => u !== unidade),
        },
      },
    }));
  };

  // Salvar configurações (nomeLoja, nicho, tema, configAtual)
  const salvarConfiguracoes = () => {
    if (!nomeLoja.trim() || !nicho) {
      alert("Por favor, preencha o nome da loja e escolha o nicho.");
      return;
    }
    if (!configAtual) {
      alert("Configuração do nicho inválida.");
      return;
    }

    const configuracoes = {
      nomeLoja: nomeLoja.trim(),
      nicho,
      tema,
      configDetalhada: configAtual,
    };

    localStorage.setItem("configuracoesLoja", JSON.stringify(configuracoes));

    // Aplica o tema imediatamente
    const existingTheme = document.getElementById("tema-css");
    if (existingTheme) {
      existingTheme.remove();
    }
    const link = document.createElement("link");
    link.id = "tema-css";
    link.rel = "stylesheet";
    link.href = `/temas/${tema}.css`; // Assumindo que o arquivo exista
    document.head.appendChild(link);

    if (onConfiguracaoSalva) {
      onConfiguracaoSalva(configuracoes);
    }

    navigate("/"); // Ou qualquer ação depois de salvar
  };

  return (
    <div className="cadastro-container" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Configuração Inicial do Sistema</h1>

      <div className="linha" style={{ marginBottom: 15 }}>
        <label>
          Nome da Loja:
          <input
            type="text"
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            placeholder="Digite o nome da sua loja"
            style={{ marginLeft: 10, padding: 5, width: "70%" }}
          />
        </label>
      </div>

      <div className="linha" style={{ marginBottom: 15 }}>
        <label>
          Nicho do Sistema:
          <select
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            style={{ marginLeft: 10, padding: 5, width: "50%" }}
          >
            {nichos.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="linha" style={{ marginBottom: 15 }}>
        <label>
          Tema do Sistema:
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            style={{ marginLeft: 10, padding: 5, width: "50%" }}
          >
            {temas.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Exibe configurações do nicho selecionado */}
      {configAtual && (
        <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 15, borderRadius: 5 }}>
          <h3>Configurações para <em>{nicho.charAt(0).toUpperCase() + nicho.slice(1)}</em></h3>

          {/* Cadastro Cliente */}
          <label>
            <input
              type="checkbox"
              checked={configAtual.cadastroCliente}
              onChange={() => toggleCampo("cadastroCliente")}
            />{" "}
            Cadastro Cliente
          </label>

          {/* Cadastro Produto */}
          <div style={{ marginTop: 10, paddingLeft: 20 }}>
            <label>
              <input
                type="checkbox"
                checked={configAtual.cadastroProduto.ativo}
                onChange={toggleCadastroProdutoAtivo}
              />{" "}
              Cadastro Produto
            </label>

            {configAtual.cadastroProduto.ativo && (
              <div style={{ paddingLeft: 20, marginTop: 10 }}>
                {/* Marca */}
                {"marca" in configAtual.cadastroProduto.campos && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={configAtual.cadastroProduto.campos.marca || false}
                        onChange={() => toggleCampoCadastroProduto("marca")}
                      />{" "}
                      Marca
                    </label>
                    <br />
                  </>
                )}

                {/* Tamanho */}
                {"tamanho" in configAtual.cadastroProduto.campos && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={configAtual.cadastroProduto.campos.tamanho || false}
                        onChange={() => toggleCampoCadastroProduto("tamanho")}
                      />{" "}
                      Tamanho
                    </label>
                    <br />
                  </>
                )}

                {/* Código ANVISA */}
                {"codigoAnvisa" in configAtual.cadastroProduto.campos && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={configAtual.cadastroProduto.campos.codigoAnvisa || false}
                        onChange={() => toggleCampoCadastroProduto("codigoAnvisa")}
                      />{" "}
                      Código ANVISA
                    </label>
                    <br />
                  </>
                )}

                {/* Validade */}
                {"validade" in configAtual.cadastroProduto.campos && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={configAtual.cadastroProduto.campos.validade || false}
                        onChange={() => toggleCampoCadastroProduto("validade")}
                      />{" "}
                      Validade
                    </label>
                    <br />
                  </>
                )}

                {/* Unidades */}
                <div style={{ marginTop: 10 }}>
                  <strong>Unidades permitidas:</strong>
                  <ul>
                    {configAtual.cadastroProduto.campos.unidade.map((u) => (
                      <li key={u}>
                        {u}{" "}
                        <button onClick={() => removerUnidade(u)} type="button" style={{ marginLeft: 10 }}>
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={adicionarUnidade}>
                    Adicionar unidade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={salvarConfiguracoes}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Salvar e Iniciar
        </button>
      </div>
    </div>
  );
}
