use tauri::{command, Builder};
use rusqlite::{params, Connection, Result};
use std::sync::Mutex;

mod cliente;
mod produtos;
mod db;



struct Db(Connection);




#[tauri::command]
async fn conectar_banco() -> String {
    "Banco conectado com sucesso!".into()
}












fn main() {
    std::panic::set_hook(Box::new(|panic_info| {
        eprintln!("Pânico capturado: {:?}", panic_info);
    }));

    let conn = Connection::open("minha_app.db").expect("Erro ao abrir o banco de dados");

    db::inicializar_banco(&conn).expect("Erro ao inicializar banco");

    let db = Mutex::new(Db(conn));

    Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            produtos::salvar_produto,
            produtos::excluir_produto,
            produtos::listar_produtos,
            produtos::editar_produto,
            conectar_banco,
            cliente::cadastrar_cliente,
            cliente::listar_clientes,
            cliente::editar_cliente,
            cliente::excluir_cliente
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao rodar app");
}
