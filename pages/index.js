<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Shinobi Sync Final</title>
    
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

    <style>
        :root { --orange: #ff6600; --dark: #0a0a0a; }
        body { background: var(--dark); color: white; font-family: 'Segoe UI', sans-serif; margin: 0; overflow-x: hidden; }
        
        /* Layout Principal */
        .container { padding: 20px; text-align: center; }
        .contatos-lista { background: #1a1a1a; border: 1px solid var(--orange); border-radius: 15px; padding: 10px; margin-top: 20px; min-height: 200px; }
        .card-ninja { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #333; }
        
        /* Botões */
        .btn-sync { background: var(--orange); color: black; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; width: 100%; margin-bottom: 10px; }
        .btn-call { background: transparent; border: 1px solid var(--orange); color: var(--orange); padding: 8px; border-radius: 5px; margin-left: 5px; }

        /* Interface de Chamada Fullscreen */
        #interface-chamada { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 9999; flex-direction: column; align-items: center; justify-content: center; }
        #video-local { width: 90%; height: 60%; background: #111; border: 2px solid var(--orange); border-radius: 15px; object-fit: cover; }
        
        /* Animações Naruto */
        .rasengan { position: absolute; width: 100px; display: none; animation: spin 0.5s linear infinite; filter: drop-shadow(0 0 15px #00a2ff); }
        .naruto-fone { width: 200px; border-radius: 50%; border: 4px solid var(--orange); display: none; }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .encerrar { background: #ff3333; color: white; border: none; padding: 20px; border-radius: 50%; margin-top: 30px; font-size: 20px; }
    </style>
</head>
<body>

<div class="container">
    <h2 style="color: var(--orange)">SHINOBI SYNC v4</h2>
    <button class="btn-sync" onclick="ativarSincronizacao()">SINCRONIZAR COM GOOGLE</button>
    <div id="status-sync" style="font-size: 12px; opacity: 0.7;">Aguardando comando...</div>

    <div class="contatos-lista" id="grid-contatos">
        </div>
</div>

<div id="interface-chamada">
    <h2 id="nome-remetente">Chamando...</h2>
    
    <img id="img-audio" src="https://i.ibb.co/v4m00pY/naruto-phone.png" class="naruto-fone">
    
    <video id="video-local" autoplay playsinline muted></video>
    
    <img id="anim-rasengan" src="https://i.ibb.co/8Y64f8m/rasengan.png" class="rasengan">

    <button class="encerrar" onclick="encerrarChamada()">✖</button>
</div>

<script>
    // 1. Sua Configuração Firebase
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_PROJETO.firebaseapp.com",
        projectId: "SEU_PROJETO",
        storageBucket: "SEU_PROJETO.appspot.com",
        appId: "SUA_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    // 2. Sincronização Real (Sem alertas que travam)
    function ativarSincronizacao() {
        // Redirecionamento é obrigatório para Vercel + Mobile
        auth.signInWithRedirect(provider);
    }

    // Captura o retorno do Google após o login
    auth.getRedirectResult().then((result) => {
        if (result && result.credential) {
            const token = result.credential.accessToken;
            buscarContatosGoogle(token);
        }
    }).catch(err => {
        document.getElementById('status-sync').innerText = "Erro: " + err.message;
    });

    function buscarContatosGoogle(token) {
        document.getElementById('status-sync').innerText = "Buscando Jutsus de Contatos...";
        fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            const contatos = data.connections || [];
            contatos.forEach(p => {
                const nome = p.names ? p.names[0].displayName : "Shinobi";
                const tel = p.phoneNumbers ? p.phoneNumbers[0].value : "";
                // Salva no seu Firestore (Coleção: contatos)
                db.collection("contatos").add({ nome: nome, telefone: tel, sync: true });
            });
            document.getElementById('status-sync').innerText = "Sincronizado com Sucesso!";
        });
    }

    // 3. Monitoramento em Tempo Real do Banco
    db.collection("cont
