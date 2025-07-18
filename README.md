loja-app
Aplicação desktop para gerenciamento de produtos e clientes, construída com React no frontend e Rust/Tauri no backend, utilizando banco de dados SQLite para persistência.

Funcionalidades
Cadastro, edição, exclusão e listagem de produtos.

Cadastro, edição, exclusão e listagem de clientes.

Busca com filtro em tempo real para produtos e clientes.

Interface intuitiva e responsiva construída com React.

Backend em Rust com comandos Tauri para operações no banco SQLite.

Armazenamento local de configurações e imagens básicas para produtos.

Tecnologias Utilizadas
Frontend: React (JavaScript/TypeScript opcional)

Backend: Rust com framework Tauri

Banco de Dados: SQLite (via rusqlite)

Build & Empacotamento: Tauri

Comunicação Frontend-Backend: comandos invoke do Tauri

Estrutura do Projeto
/src-tauri/ — código Rust do backend, incluindo gerenciamento do banco SQLite e comandos Tauri.

/src/ — frontend React com telas para cadastro e pesquisa de produtos e clientes.

Banco de dados SQLite localizado localmente (minha_app.db).

Como Rodar
Pré-requisitos
Rust instalado (https://rustup.rs)

Node.js e npm instalados (https://nodejs.org/)

Tauri CLI instalado:

bash
Copiar
Editar
cargo install tauri-cli
Rodando em desenvolvimento
Instale as dependências do frontend:

bash
Copiar
Editar
npm install
Inicie o frontend em modo desenvolvimento:

bash
Copiar
Editar
npm run dev
Inicie a aplicação Tauri (backend + empacotamento):

bash
Copiar
Editar
cargo tauri dev
Comandos principais do backend
listar_produtos: lista todos os produtos cadastrados.

adicionar_produto: adiciona um novo produto.

editar_produto: atualiza um produto existente.

excluir_produto: remove um produto pelo ID.

listar_clientes, cadastrar_cliente, editar_cliente, excluir_cliente: comandos equivalentes para clientes.

Tela Principal
Listagem de produtos/clientes com busca.

Formulário para edição e inclusão.

Botões para salvar, excluir e limpar formulário.

Próximos passos
Melhorar upload e armazenamento de imagens.

Adicionar validação mais robusta nos formulários.

Implementar autenticação de usuário.

Melhorar UI com frameworks como TailwindCSS ou Material UI.

Contribuindo
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue para discutir o que deseja mudar antes.

Licença
MIT License

