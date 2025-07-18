import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../style/sidebar.scss';

export default function Sidebar({ tema = 'claro' }) {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(null);

  const toggleMenu = (menu) => {
    setMenuAberto((prev) => (prev === menu ? null : menu));
  };

  return (
    <nav className={`sidebar-navigation tema-${tema}`}>
      <ul>
        <li className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuAberto(null)}>
            <i className="fa fa-home"></i>
            <span className="tooltip">Início</span>
          </Link>
        </li>

        <li
          className={`menu-item ${location.pathname.startsWith('/clientes') ? 'active' : ''}`}
          onClick={() => toggleMenu('clientes')}
        >
          <div>
            <i className="fa fa-users"></i>
            <span className="tooltip">Clientes</span>
          </div>
          {menuAberto === 'clientes' && (
            <ul className="submenu">
              <li className={location.pathname === '/clientes/cadastrar' ? 'active' : ''}>
                <Link to="/clientes/cadastrar" onClick={() => setMenuAberto(null)}>
                  <i className="fa fa-user-plus"></i> Cadastrar
                </Link>
              </li>
              <li className={location.pathname === '/clientes/pesquisar' ? 'active' : ''}>
                <Link to="/clientes/pesquisar" onClick={() => setMenuAberto(null)}>
                  <i className="fa fa-search"></i> Pesquisar
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li
          className={`menu-item ${location.pathname.startsWith('/produtos') ? 'active' : ''}`}
          onClick={() => toggleMenu('produtos')}
        >
          <div>
            <i className="fa fa-cubes"></i>
            <span className="tooltip">Produtos</span>
          </div>
          {menuAberto === 'produtos' && (
            <ul className="submenu">
              <li className={location.pathname === '/produtos/cadastrar' ? 'active' : ''}>
                <Link to="/produtos/cadastrar" onClick={() => setMenuAberto(null)}>
                  <i className="fa fa-plus-square"></i> Cadastrar
                </Link>
              </li>
              <li className={location.pathname === '/produtos/pesquisar' ? 'active' : ''}>
                <Link to="/produtos/pesquisar" onClick={() => setMenuAberto(null)}>
                  <i className="fa fa-search"></i> Pesquisar
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className={`menu-item ${location.pathname === '/venda' ? 'active' : ''}`}>
          <Link to="/venda" onClick={() => setMenuAberto(null)}>
            <i className="fa fa-credit-card-alt"></i>
            <span className="tooltip">Venda</span>
          </Link>
        </li>

        <li className={`menu-item ${location.pathname === '/configuracao' ? 'active' : ''}`}>
          <Link to="/configuracao" onClick={() => setMenuAberto(null)}>
            <i className="fa fa-sliders"></i>
            <span className="tooltip">Configuração</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
