import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function Inicio() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    invoke("conectar_banco")
      .then((res) => setMsg(res))
      .catch((err) => setMsg("Erro: " + err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Página Inicial</h1>
      <p className="mt-4 text-green-600">{msg}</p>
    </div>
  );
}
