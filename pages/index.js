<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Naruto Interface - Sincronizada</title>
    
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

    <style>
        :root { --laranja: #ff6600; --fundo: #121212; --card: #1e1e1e; }
        
        body { 
            background: var(--fundo); color: white; margin: 0; 
            font-family: 'Ubuntu', sans-serif; -webkit-tap-highlight-color: transparent;
        }

        /* Lista de Contatos Otimizada */
        .header { padding: 20px; text-align: center; border-bottom: 2px solid var(--laranja); }
        
        #listaContatos { padding: 15px; display: grid; gap: 10px; }

        .contato-card {
            background: var(--card); border-radius: 12px; padding: 15px;
            display: flex; justify-content: space-between; align-items: center;
            border-left: 5px solid var(--laranja);
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }

        .btn-group { display: flex; gap: 8px; }

        .action-btn {
            background: var(--laranja); border: none; color: white;
            padding: 10px; border-radius: 50%; width: 45px; height: 45px;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; transition: 0.2s;
        }

        /* Tela de Chamada Fullscreen */
        #call-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: black; z-index: 1000; display: none;
            flex-direction: column; align-items: center; justify-content: space-around;
        }

        #video-container {
            width: 95%; height: 70%; background: #000; border-radius: 20px;
            overflow: hidden; position: relative; border: 2px solid var(--laranja);
        }

        video { width: 100%; height: 100%; object-fit: cover; }

        /* Animações Naruto */
        .rasengan-overlay {
            position: absolute; width: 120px; pointer-events: none;
            animation: spin 1s linear infinite; display: none;
            filter: drop-shadow(0 0 10px #00a2ff);
        }

        .naruto-calling {
            width: 250px; border-radius: 50%; border: 5px solid var(--laranja);
            display: none;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }

        .btn-end {
            background: #ff3333; width: 70px; height: 70px; border-radius: 50%;
            border: none; color: white; font-size: 24px;
        }
    </style>
</head>
<body>

<div class="header">
    <h1 style="margin:0; font-size: 1.5rem;">Ninja Sync v2</h1>
</div>

<div id="listaContatos">
    <div style="text-align: center; opacity: 0.5;">Iniciando Jutsus de Sincronização...</div>
</div>

<div id="call-overlay">
    <div id="call-info" style="text-align:center">
        <h2 id="calling-name">Nome do Contato</h2>
        <p id="call-status">Conectando...</p>
    </div>

    <img id="naruto-audio" src="https://i.ibb.co/v4m00pY/naruto-phone.png" class="naruto-calling" alt="Naruto Call">

    <div id="video-container">
        <video id="myVideo" autoplay playsinline muted></video>
        <img id="rasengan" src="https://i.ibb.co/8Y64f8m/rasengan.png" class="rasengan-overlay" style="top:20%; left:30%;">
    </div>

    <button class="btn-end" onclick="endCall()">✖</button>
</div>

<script>
    // --- SUA CONFIGURAÇÃO FIREBASE ---
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_DOMINIO.firebaseapp.com",
        projectId: "SEU_ID",
        storageBucket: "SEU_BUCKET.appspot.com",
        messagingSenderId: "SENDER_ID",
        appId: "APP_ID"
    };

    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // --- CORREÇÃO DA SINCRONIZAÇÃO ---
    // Esta função ouve o Firebase e atualiza o sistema sem mexer no resto
    function syncNinjaContacts() {
        db.collection("contatos").onSnapshot((snapshot) => {
            const container = document.getElementById('listaContatos');
            container.innerHTML = "";
            
            snapshot.forEach((doc) => {
                const c = doc.data();
                const card = document.createElement('div');
                card.className = 'contato-card';
                card.innerHTML = `
                    <strong>${c.nome || 'Ninja'}</strong>
                    <div class="btn-group">
                        <button class="action-btn" onclick="startCall('${c.nome}', 'audio')">📞</button>
                        <button class="action-btn" onclick="startCall('${c.nome}', 'video')">🎥</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }, (err) => {
            console.error("Erro na sincronização:", err);
            document.getElementById('listaContatos').innerHTML = "Erro ao carregar contatos.";
        });
    }

    // --- LÓGICA DE CHAMADA ---
    function startCall(nome, tipo) {
        const overlay = document.getElementById('call-overlay');
        const videoCont = document.getElementById('video-container');
        const narutoImg = document.getElementById('naruto-audio');
        const rasengan = document.getElementById('rasengan');
        
        document.getElementById('calling-name').innerText = nome;
        overlay.style.display = 'flex';

        if(tipo === 'video') {
            videoCont.style.display = 'block';
            narutoImg.style.display = 'none';
            
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(s => {
                document.getElementById('myVideo').srcObject = s;
                // Animação do Rasengan aparecendo em intervalos
                setInterval(() => {
                    rasengan.style.display = 'block';
                    setTimeout(() => { rasengan.style.display = 'none'; }, 2000);
                }, 5000);
            });
        } else {
            videoCont.style.display = 'none';
            narutoImg.style.display = 'block'; // Naruto no telefone
        }
    }

    function endCall() {
        const video = document.getElementById('myVideo');
        if(video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
        document.getElementById('call-overlay').style.display = 'none';
    }

    // Iniciar Sincronização
    syncNinjaContacts();
</script>

</body>
</html>
