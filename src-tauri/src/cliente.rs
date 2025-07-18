use serde::{Deserialize, Serialize};
use rusqlite::{params, Connection, Result};
use tauri::State;
use std::sync::Mutex;
use crate::Db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Cliente {
    pub id: Option<i32>, // usado para editar/excluir
    pub tipo: String,
    pub cpf_cnpj: String,
    pub nome: String,
    pub rg_ie: String,
    pub orgao_expedidor: String,
    pub email: String,
    pub cep: String,
    pub uf: String,
    pub pais: String,
    pub municipio: String,
    pub logradouro: String,
    pub numero: String,
    pub complemento: String,
    pub bairro: String,
    pub telefone: String,
    pub situacao: String,
    pub fornecedor: bool
}




#[tauri::command]
pub async fn cadastrar_cliente(
    db: State<'_, Mutex<Db>>,
    cliente: Cliente,
) -> Result<(), String> {
    let conn = &db.lock().map_err(|e| e.to_string())?.0;

    conn.execute(
        "INSERT INTO clientes (tipo, cpf_cnpj, nome, rg_ie, orgao_expedidor, email, cep, uf, pais, municipio, logradouro, numero, complemento, bairro, telefone, situacao, fornecedor)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
        params![
            cliente.tipo,
            cliente.cpf_cnpj,
            cliente.nome,
            cliente.rg_ie,
            cliente.orgao_expedidor,
            cliente.email,
            cliente.cep,
            cliente.uf,
            cliente.pais,
            cliente.municipio,
            cliente.logradouro,
            cliente.numero,
            cliente.complemento,
            cliente.bairro,
            cliente.telefone,
            cliente.situacao,
            cliente.fornecedor
        ],
    ).map_err(|e| {
        eprintln!("Erro ao cadastrar cliente: {}", e);
        e.to_string()
    })?;

    Ok(())
}


#[tauri::command]
pub fn listar_clientes(db: State<Mutex<Db>>) -> Result<Vec<Cliente>, String> {
    let conn = &db.lock().map_err(|_| "Erro ao acessar o banco".to_string())?.0;

    let mut stmt = conn
        .prepare("SELECT * FROM clientes")
        .map_err(|e| e.to_string())?;

    let clientes = stmt
        .query_map([], |row| {
            Ok(Cliente {
                id: row.get(0)?,
                tipo: row.get(1)?,
                cpf_cnpj: row.get(2)?,
                nome: row.get(3)?,
                rg_ie: row.get(4)?,
                orgao_expedidor: row.get(5)?,
                email: row.get(6)?,
                cep: row.get(7)?,
                uf: row.get(8)?,
                pais: row.get(9)?,
                municipio: row.get(10)?,
                logradouro: row.get(11)?,
                numero: row.get(12)?,
                complemento: row.get(13)?,
                bairro: row.get(14)?,
                telefone: row.get(15)?,
                situacao: row.get(16)?,
                fornecedor: row.get::<_, i32>(17)? != 0,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(clientes)
}



#[tauri::command]
pub fn editar_cliente(cliente: Cliente, db: State<Mutex<Db>>) -> Result<(), String> {
    let conn = &db.lock().map_err(|_| "Erro ao acessar o banco".to_string())?.0;
    let id = cliente.id.ok_or("ID não fornecido")?;

    conn.execute(
        "
        UPDATE clientes SET
            tipo = ?1, cpf_cnpj = ?2, nome = ?3, rg_ie = ?4, orgao_expedidor = ?5,
            email = ?6, cep = ?7, uf = ?8, pais = ?9, municipio = ?10,
            logradouro = ?11, numero = ?12, complemento = ?13,
            bairro = ?14, telefone = ?15, situacao = ?16, fornecedor = ?17
        WHERE id = ?18
        ",
        params![
            cliente.tipo,
            cliente.cpf_cnpj,
            cliente.nome,
            cliente.rg_ie,
            cliente.orgao_expedidor,
            cliente.email,
            cliente.cep,
            cliente.uf,
            cliente.pais,
            cliente.municipio,
            cliente.logradouro,
            cliente.numero,
            cliente.complemento,
            cliente.bairro,
            cliente.telefone,
            cliente.situacao,
            cliente.fornecedor as i32,
            id
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}



#[tauri::command]
pub fn excluir_cliente(id: i32, db: State<Mutex<Db>>) -> Result<(), String> {
    let conn = &db.lock().map_err(|_| "Erro ao acessar o banco".to_string())?.0;

    conn.execute("DELETE FROM clientes WHERE id = ?", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}


