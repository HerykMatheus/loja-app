use tauri::{command, Builder};
use rusqlite::{params, Connection, Result};
use std::sync::Mutex;

mod cliente;

struct Db(Connection);

#[command]
fn criar_tabela(db: tauri::State<Mutex<Db>>) -> Result<(), String> {
    let conn = &db.lock().unwrap().0;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            preco REAL NOT NULL
        )",
        [],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn adicionar_produto(db: tauri::State<Mutex<Db>>, nome: String, preco: f64) -> Result<(), String> {
    let conn = &db.lock().unwrap().0;
    conn.execute(
        "INSERT INTO produtos (nome, preco) VALUES (?1, ?2)",
        params![nome, preco],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn listar_produtos(db: tauri::State<Mutex<Db>>) -> Result<Vec<(i32, String, f64)>, String> {
    let conn = &db.lock().unwrap().0;
    let mut stmt = conn.prepare("SELECT id, nome, preco FROM produtos").map_err(|e| e.to_string())?;
    let produtos_iter = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?))
    }).map_err(|e| e.to_string())?;

    let mut produtos = Vec::new();
    for produto in produtos_iter {
        produtos.push(produto.map_err(|e| e.to_string())?);
    }
    Ok(produtos)
}


#[tauri::command]
async fn conectar_banco() -> String {
    "Banco conectado com sucesso!".into()
}












fn main() {
    let conn = Connection::open("minha_app.db").expect("Erro ao abrir o banco de dados");
    let db = Mutex::new(Db(conn));

    Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            criar_tabela,
            adicionar_produto,
            listar_produtos,
            conectar_banco,
            cliente::cadastrar_cliente,
            cliente::listar_clientes,
            cliente::editar_cliente,
            cliente::excluir_cliente
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao rodar app");
}
