import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../style/sidebar.scss';

export default function Sidebar() {
  const location = useLocation();

  // Mantém o nome do menu atualmente aberto
  const [menuAberto, setMenuAberto] = useState(null);

  const toggleMenu = (menu) => {
    // Se o menu clicado já estiver aberto, fecha ele. Se for outro, fecha o atual e abre o novo.
    setMenuAberto(prev => (prev === menu ? null : menu));
  };

  return (
    <nav className="sidebar-navigation">
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/"
            onClick={() => setMenuAberto(null)}  // Fecha submenus ao clicar em Venda
          >
            <i className="fa fa-home"></i>
            <span className="tooltip">Início</span>
          </Link>
        </li>

        <li
          onClick={() => toggleMenu('clientes')}
          className={location.pathname.startsWith('/clientes') ? 'active' : ''}
        >
          <i className="fa fa-users"></i>
          <span className="tooltip">Clientes</span>
        </li>
{menuAberto === 'clientes' && (
  <ul className="submenu">
    <li className={location.pathname === '/clientes/cadastrar' ? 'active' : ''}>
  <Link to="/clientes/cadastrar">
    <i className="fa fa-user"></i> Cadastrar
  </Link>
    </li>
    <li className={location.pathname === '/clientes/pesquisar' ? 'active' : ''}>
      <Link to="/clientes/pesquisar">
       <i className="fa fa-search"></i>Pesquisar
      </Link>
    </li>
  </ul>
)}

        <li
          onClick={() => toggleMenu('produtos')}
          className={location.pathname.startsWith('/produtos') ? 'active' : ''}
        >
          <i className="fa fa-cubes"></i>
          <span className="tooltip">Produtos</span>
        </li>
        {menuAberto === 'produtos' && (
          <ul className="submenu">
            <li className={location.pathname === '/produtos/cadastrar' ? 'active' : ''}>
              <Link to="/produtos/cadastrar">
              <i className="fa fa-cube"></i> Cadastrar</Link>
            </li>
            <li className={location.pathname === '/produtos/pesquisar' ? 'active' : ''}>
              <Link to="/produtos/pesquisar">
               <i className="fa fa-search"></i>Pesquisar</Link>
            </li>
          </ul>
        )}

<li className={location.pathname === '/venda' ? 'active' : ''}>
  <Link
    to="/venda"
    onClick={() => setMenuAberto(null)}  // Fecha submenus ao clicar em Venda
  >
    <i className="fa fa-credit-card-alt"></i>
    <span className="tooltip">Venda</span>
  </Link>
</li>
        <li className={location.pathname === '/configuracao' ? 'active' : ''}>
          <Link to="/configuracao"
          onClick={() => setMenuAberto(null)}>
            <i className="fa fa-sliders"></i>
            <span className="tooltip">Configuração</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
