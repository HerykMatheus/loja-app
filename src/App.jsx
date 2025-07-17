import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';

import Inicio from './pages/Inicio';
import CadastrarCliente from './pages/CadastrarCliente';
import PesquisarCliente from './pages/PesquisarCliente';
import CadastrarProduto from './pages/CadastrarProduto';
import PesquisarProduto from './pages/PesquisarProduto';
import Venda from './pages/Venda';
import Configuracao from './pages/Configuracao';

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="p-4 flex-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes/cadastrar" element={<CadastrarCliente />} />
            <Route path="/clientes/pesquisar" element={<PesquisarCliente />} />
            <Route path="/produtos/cadastrar" element={<CadastrarProduto />} />
            <Route path="/produtos/pesquisar" element={<PesquisarProduto />} />
            <Route path="/venda" element={<Venda />} />
            <Route path="/configuracao" element={<Configuracao />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
