<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shinobi Fix v3</title>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <style>
        body { background: #000; color: #ff6600; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; text-align: center; }
        .card { background: #111; border: 2px solid #ff6600; border-radius: 15px; padding: 20px; margin-bottom: 20px; }
        .btn { background: #ff6600; color: #000; border: none; padding: 15px; border-radius: 8px; font-weight: bold; width: 100%; font-size: 16px; margin-top: 10px; }
        .contato { display: flex; justify-content: space-between; align-items: center; background: #222; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #00a2ff; }
        #chamada { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 9999; flex-direction: column; align-items: center; justify-content: center; }
        #video-container { width: 90%; height: 60%; background: #111; border: 2px solid #ff6600; border-radius: 20px; overflow: hidden; position: relative; }
        video { width: 100%; height: 100%; object-fit: cover; }
        .rasengan { position: absolute; width: 80px; top: 20%; left: 30%; animation: spin 0.8s linear infinite; display: none; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

<div class="card">
    <h2>NARUTO SYNC 🦊</h2>
    <p id="status">Status: Offline</p>
    <button class="btn" onclick="login()">ATIVAR SINCRONIZAÇÃO GOOGLE</button>
</div>

<div id="lista" class="card" style="display:none;">
    <h3>Contatos Sincronizados</h3>
    <div id="contatos-render"></div>
</div>

<div id="chamada">
    <h2 id="nome-contato">Chamando...</h2>
    <div id="video-container">
        <video id="vid" autoplay playsinline></video>
        <img id="rasengan-img" src="https://i.ibb.co/8Y64f8m/rasengan.png" class="rasengan">
    </div>
    <button class="btn" style="background:red; width:70px; height:70px; border-radius:50%;" onclick="encerrar()">✖</button>
</div>

<script>
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_PROJETO.firebaseapp.com",
        projectId: "SEU_PROJETO",
        storageBucket: "SEU_PROJETO.appspot.com",
        appId: "SEU_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    // Lógica de Login para Mobile (Redirect)
    function login() {
        auth.signInWithRedirect(provider);
    }

    // Verifica se voltou do login
    auth.getRedirectResult().then((result) => {
        if (result.credential) {
            const token = result.credential.accessToken;
            document.getElementById('status').innerText = "Status: Sincronizando...";
            pegarContatosGoogle(token);
        }
    }).catch(err => console.error("Erro no redirect:", err));

    function pegarContatosGoogle(token) {
        fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            const lista = data.connections || [];
            document.getElementById('lista').style.display = 'block';
            const render = document.getElementById('contatos-render');
            render.innerHTML = "";

            lista.forEach(p => {
                const nome = p.names ? p.names[0].displayName : "Ninja";
                const card = document.createElement('div');
                card.className = 'contato';
                card.innerHTML = `<span>${nome}</span> <button onclick="abrirChamada('${nome}')" style="background:none; border:none; font-size:20px;">🎥</button>`;
                render.appendChild(card);
                // Salva no Firestore
                db.collection("contatos").add({ nome: nome, sync: true });
            });
            document.getElementById('status').innerText = "Status: Online (Google Sync)";
        });
    }

    function abrirChamada(nome) {
        document.getElementById('chamada').style.display = 'flex';
        document.getElementById('nome-contato').innerText = nome;
        
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            document.getElementById('vid').srcObject = stream;
            // Intervalo Rasengan
            setInterval(() => {
                const r = document.getElementById('rasengan-img');
                r.style.display = 'block';
                setTimeout(() => r.style.display = 'none', 1000);
            }, 3000);
        });
    }

    function encerrar() {
        location.reload();
    }
</script>
</body>
</html>
