import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";

import Inicio from "./pages/Inicio";
import CadastrarCliente from "./pages/CadastrarCliente";
import PesquisarCliente from "./pages/PesquisarCliente";
import CadastrarProduto from "./pages/CadastrarProduto";
import PesquisarProduto from "./pages/PesquisarProduto";
import Venda from "./pages/Venda";
import Configuracao from "./pages/Configuracao";

export default function App() {
  const [configuracao, setConfiguracao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Função para aplicar o tema dinamicamente via <link>
  const aplicarTema = (tema) => {
    const head = document.head;
    const existingLink = document.getElementById("tema-css");

    if (existingLink) {
      head.removeChild(existingLink);
    }

    const link = document.createElement("link");
    link.id = "tema-css";
    link.rel = "stylesheet";
    link.href = `/temas/${tema}.css`; // Exemplo: /temas/claro.css
    head.appendChild(link);
  };

  useEffect(() => {
    const configSalva = localStorage.getItem("configuracoesLoja");
    if (configSalva) {
      const config = JSON.parse(configSalva);
      setConfiguracao(config);
      aplicarTema(config.tema);
      document.body.className = `tema-${config.tema}`;
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    // Atualiza classe do body sempre que o tema mudar
    if (configuracao?.tema) {
      document.body.className = `tema-${configuracao.tema}`;
    }
  }, [configuracao]);

  const handleConfiguracaoSalva = (novaConfig) => {
    setConfiguracao(novaConfig);
    aplicarTema(novaConfig.tema);
    document.body.className = `tema-${novaConfig.tema}`;
    localStorage.setItem("configuracoesLoja", JSON.stringify(novaConfig));
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (!configuracao) {
    return (
      <Router>
        <Routes>
          <Route
            path="/*"
            element={<Navigate to="/configuracao" replace />}
          />
          <Route
            path="/configuracao"
            element={<Configuracao onConfiguracaoSalva={handleConfiguracaoSalva} />}
          />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex tema-{configuracao.tema}">
        <Sidebar tema={configuracao.tema} />
        <main className="p-4 flex-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes/cadastrar" element={<CadastrarCliente />} />
            <Route path="/clientes/pesquisar" element={<PesquisarCliente />} />
            <Route path="/produtos/cadastrar" element={<CadastrarProduto />} />
            <Route path="/produtos/pesquisar" element={<PesquisarProduto />} />
            <Route path="/venda" element={<Venda />} />
            <Route
              path="/configuracao"
              element={<Configuracao onConfiguracaoSalva={handleConfiguracaoSalva} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
