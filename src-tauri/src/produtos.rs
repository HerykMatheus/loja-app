use serde::{Deserialize, Serialize};
use rusqlite::{params, Connection};
use tauri::State;
use std::sync::Mutex;
use crate::Db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Produto {
    pub id: Option<i32>,
    pub nome: String,
    pub referencia: Option<String>,
    pub codigo_fabricante: Option<String>,
    pub codigo_barras: Option<String>,
    pub descricao: Option<String>,
    pub categoria: Option<String>,
    pub preco_custo: Option<f64>,
    pub preco_venda: Option<f64>,
    pub lucro: Option<f64>,
    pub margem: Option<f64>,
    pub estoque: Option<i32>,
    pub estoque_minimo: Option<i32>,
    pub unidade: Option<String>,
    pub marca: Option<String>,
    pub fornecedor: Option<String>,
    pub cor: Option<String>,
    pub data_validade: Option<String>,
    pub codigo_anvisa: Option<String>,
    pub status: Option<String>, // 'Ativo' ou 'Inativo'
    pub imagem: Option<String>,
}

#[tauri::command]
pub fn salvar_produto(produto: Produto, db: State<Mutex<Db>>) -> Result<(), String> {
    let conn = &db.lock().map_err(|e| e.to_string())?.0;

    if let Some(id) = produto.id {
        // Atualizar
        conn.execute(
            "
            UPDATE produtos SET
                nome = ?1,
                referencia = ?2,
                codigo_fabricante = ?3,
                codigo_barras = ?4,
                descricao = ?5,
                categoria = ?6,
                preco_custo = ?7,
                preco_venda = ?8,
                lucro = ?9,
                margem = ?10,
                estoque = ?11,
                estoque_minimo = ?12,
                unidade = ?13,
                marca = ?14,
                fornecedor = ?15,
                cor = ?16,
                data_validade = ?17,
                codigo_anvisa = ?18,
                status = ?19,
                imagem = ?20
            WHERE id = ?21
            ",
            params![
                produto.nome,
                produto.referencia,
                produto.codigo_fabricante,
                produto.codigo_barras,
                produto.descricao,
                produto.categoria,
                produto.preco_custo,
                produto.preco_venda,
                produto.lucro,
                produto.margem,
                produto.estoque,
                produto.estoque_minimo,
                produto.unidade,
                produto.marca,
                produto.fornecedor,
                produto.cor,
                produto.data_validade,
                produto.codigo_anvisa,
                produto.status.unwrap_or_else(|| "Ativo".to_string()),
                produto.imagem,
                id
            ],
        )
        .map_err(|e| e.to_string())?;
    } else {
        // Inserir novo
        conn.execute(
            "
            INSERT INTO produtos (
                nome, referencia, codigo_fabricante, codigo_barras, descricao,
                categoria, preco_custo, preco_venda, lucro, margem,
                estoque, estoque_minimo, unidade, marca, fornecedor,
                cor, data_validade, codigo_anvisa, status, imagem
            ) VALUES (
                ?1, ?2, ?3, ?4, ?5,
                ?6, ?7, ?8, ?9, ?10,
                ?11, ?12, ?13, ?14, ?15,
                ?16, ?17, ?18, ?19, ?20
            )
            ",
            params![
                produto.nome,
                produto.referencia,
                produto.codigo_fabricante,
                produto.codigo_barras,
                produto.descricao,
                produto.categoria,
                produto.preco_custo,
                produto.preco_venda,
                produto.lucro,
                produto.margem,
                produto.estoque,
                produto.estoque_minimo,
                produto.unidade,
                produto.marca,
                produto.fornecedor,
                produto.cor,
                produto.data_validade,
                produto.codigo_anvisa,
                produto.status.unwrap_or_else(|| "Ativo".to_string()),
                produto.imagem,
            ],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn listar_produtos(db: State<Mutex<Db>>) -> Result<Vec<Produto>, String> {
    let conn = &db.lock().map_err(|e| e.to_string())?.0;

    let mut stmt = conn
        .prepare("SELECT id, nome, referencia, codigo_fabricante, codigo_barras, descricao, categoria, preco_custo, preco_venda, lucro, margem, estoque, estoque_minimo, unidade, marca, fornecedor, cor, data_validade, codigo_anvisa, status, imagem FROM produtos")
        .map_err(|e| e.to_string())?;

    let produtos_iter = stmt
        .query_map([], |row| {
            Ok(Produto {
                id: row.get(0)?,
                nome: row.get(1)?,
                referencia: row.get(2).ok(),
                codigo_fabricante: row.get(3).ok(),
                codigo_barras: row.get(4).ok(),
                descricao: row.get(5).ok(),
                categoria: row.get(6).ok(),
                preco_custo: row.get(7).ok(),
                preco_venda: row.get(8).ok(),
                lucro: row.get(9).ok(),
                margem: row.get(10).ok(),
                estoque: row.get(11).ok(),
                estoque_minimo: row.get(12).ok(),
                unidade: row.get(13).ok(),
                marca: row.get(14).ok(),
                fornecedor: row.get(15).ok(),
                cor: row.get(16).ok(),
                data_validade: row.get(17).ok(),
                codigo_anvisa: row.get(18).ok(),
                status: row.get(19).ok(),
                imagem: row.get(20).ok(),
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(produtos_iter)
}

#[tauri::command]
pub fn excluir_produto(id: i32, db: State<Mutex<Db>>) -> Result<(), String> {
    let conn = &db.lock().map_err(|e| e.to_string())?.0;

    conn.execute("DELETE FROM produtos WHERE id = ?", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}


#[tauri::command]
pub fn editar_produto(db: tauri::State<Mutex<Db>>, produto: Produto) -> Result<(), String> {
    let conn = &db.lock().unwrap().0;

    conn.execute(
        "UPDATE produtos SET
            nome = ?1,
            referencia = ?2,
            codigo_fabricante = ?3,
            codigo_barras = ?4,
            descricao = ?5,
            categoria = ?6,
            preco_custo = ?7,
            preco_venda = ?8,
            lucro = ?9,
            margem = ?10,
            estoque = ?11,
            estoque_minimo = ?12,
            unidade = ?13,
            marca = ?14,
            fornecedor = ?15,
            cor = ?16,
            data_validade = ?17,
            codigo_anvisa = ?18,
            status = ?19,
            imagem = ?20
         WHERE id = ?21",
        params![
            produto.nome,
            produto.referencia,
            produto.codigo_fabricante,
            produto.codigo_barras,
            produto.descricao,
            produto.categoria,
            produto.preco_custo,
            produto.preco_venda,
            produto.lucro,
            produto.margem,
            produto.estoque,
            produto.estoque_minimo,
            produto.unidade,
            produto.marca,
            produto.fornecedor,
            produto.cor,
            produto.data_validade,
            produto.codigo_anvisa,
            produto.status,
            produto.imagem,
            produto.id,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}