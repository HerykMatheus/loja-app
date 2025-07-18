import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function Inicio() {
  const [msg, setMsg] = useState("");
  const [saudacao, setSaudacao] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");

  useEffect(() => {
    // 1. Invoca o comando para conectar ao banco
    invoke("conectar_banco")
      .then((res) => setMsg(res))
      .catch((err) => setMsg("Erro: " + err));

    // 2. Pega a hora atual e define saudação
    const agora = new Date();
    const hora = agora.getHours();

    let saudacaoAtual = "";
    if (hora >= 5 && hora < 12) {
      saudacaoAtual = "Bom dia";
    } else if (hora >= 12 && hora < 18) {
      saudacaoAtual = "Boa tarde";
    } else {
      saudacaoAtual = "Boa noite";
    }
    setSaudacao(saudacaoAtual);

    // 3. Pega o nome da loja do localStorage
    const configSalva = localStorage.getItem("configuracoesLoja");
    if (configSalva) {
      try {
        const configObj = JSON.parse(configSalva);
        if (configObj.nomeLoja) setNomeLoja(configObj.nomeLoja);
      } catch {
        // JSON inválido ou sem nomeLoja
      }
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {saudacao} {nomeLoja ? `- ${nomeLoja}` : ""}
      </h1>
      <p className="mt-4 text-green-600">{msg}</p>
    </div>
  );
}
