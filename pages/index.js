<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shinobi Sync Fix</title>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

    <style>
        body { background: #000; color: #ffcc00; font-family: sans-serif; text-align: center; margin: 0; }
        .shinobi-panel { border: 2px solid #ff6600; margin: 20px; border-radius: 15px; padding: 20px; background: #111; }
        .btn-google { background: #ff6600; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; width: 80%; cursor: pointer; }
        .contato-item { background: #222; margin: 10px 0; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #ff6600; }
        #call-ui { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 1000; flex-direction: column; align-items: center; justify-content: center; }
        .rasengan { width: 100px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

<div class="shinobi-panel">
    <h2 style="color: #ff6600;">SHINOBI SYNC</h2>
    <p id="status-txt">Status: Aguardando Permissão</p>
    <button class="btn-google" id="btn-sync" onclick="syncComGoogle()">CONECTAR GOOGLE CONTACTS</button>
    
    <div id="lista-contatos" style="margin-top: 20px;">
        </div>
</div>

<div id="call-ui">
    <h2 id="caller-name">Chamada...</h2>
    <div id="video-area" style="width: 90%; height: 60%; background: #222; border: 2px solid #00a2ff; position: relative;">
        <video id="localVideo" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
        <img id="rasengan-anim" src="https://i.ibb.co/8Y64f8m/rasengan.png" class="rasengan" style="position: absolute; top: 20%; left: 30%; display: none;">
    </div>
    <button onclick="encerrar()" style="background: red; color: white; padding: 20px; border-radius: 50%; margin-top: 20px; border: none;">✖</button>
</div>

<script>
    // CONFIGURAÇÃO DO SEU FIREBASE
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_PROJETO.firebaseapp.com",
        projectId: "SEU_PROJETO",
        storageBucket: "SEU_PROJETO.appspot.com",
        appId: "SEU_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    // ESSA LINHA É A CHAVE: Pede permissão para ler contatos
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    async function syncComGoogle() {
        document.getElementById('status-txt').innerText = "Autenticando Ninja...";
        try {
            const result = await auth.signInWithPopup(provider);
            const token = result.credential.accessToken;
            
            // Agora que temos o token, buscamos os contatos reais da API do Google
            fetch(`https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers&pageSize=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                salvarNoFirebase(data.connections);
            });

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar! Verifique se a People API está ativa no Google Cloud.");
        }
    }

    function salvarNoFirebase(contatos) {
        const listaDiv = document.getElementById('lista-contatos');
        listaDiv.innerHTML = "";
        
        contatos.forEach(person => {
            const nome = person.names ? person.names[0].displayName : "Ninja Sem Nome";
            const fone = person.phoneNumbers ? person.phoneNumbers[0].value : "";
            
            // Salva no seu Firestore para ficar sincronizado
            db.collection("contatos").doc(fone || nome).set({ nome: nome, telefone: fone });

            const item = document.createElement('div');
            item.className = 'contato-item';
            item.innerHTML = `<span>${nome}</span> 
                <button onclick="chamada('${nome}', 'video')" style="background:none; border:none; font-size:20px;">🎥</button>`;
            listaDiv.appendChild(item);
        });
        document.getElementById('status-txt').innerText = "Status: Sincronizado!";
    }

    function chamada(nome, tipo) {
        document.getElementById('call-ui').style.display = 'flex';
        document.getElementById('caller-name').innerText = nome;
        
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            document.getElementById('localVideo').srcObject = stream;
            
            // Intervalo do Rasengan (Naruto aparecendo no vídeo)
            setInterval(() => {
                const r = document.getElementById('rasengan-anim');
                r.style.display = 'block';
                setTimeout(() => r.style.display = 'none', 1500);
            }, 4000);
        });
    }

    function encerrar() {
        location.reload(); // Jeito mais rápido de limpar tudo no mobile
    }
</script>
</body>
</html>
