use rusqlite::{Connection, Result};

pub fn inicializar_banco(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS clientes (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo            TEXT,
            cpf_cnpj        TEXT,
            nome            TEXT,
            rg_ie           TEXT,
            orgao_expedidor TEXT,
            email           TEXT,
            cep             TEXT,
            uf              TEXT,
            pais            TEXT,
            municipio       TEXT,
            logradouro      TEXT,
            numero          TEXT,
            complemento     TEXT,
            bairro          TEXT,
            telefone        TEXT,
            situacao        TEXT,
            fornecedor      INTEGER
        );


CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        referencia TEXT,
        codigo_fabricante TEXT,
        codigo_barras TEXT,
        descricao TEXT,
        categoria TEXT,
        preco_custo REAL,
        preco_venda REAL,
        lucro REAL,
        margem REAL,
        estoque INTEGER,
        estoque_minimo INTEGER,
        unidade TEXT,
        marca TEXT,
        fornecedor TEXT,
        cor TEXT,
        data_validade TEXT,
        codigo_anvisa TEXT,
        status TEXT DEFAULT 'Ativo',
        imagem TEXT
    )
        ",
    )?;
    Ok(())
}