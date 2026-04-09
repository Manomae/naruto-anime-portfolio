<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel Portfolio Chat</title>
    <style>
        /* CSS - O Estilo que resolve o problema do espaço branco */
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
        
        body { background-color: #000; color: white; height: 100dvh; overflow: hidden; }

        .app-container { display: flex; height: 100%; width: 100%; }

        /* Barra Lateral (Sidebar) */
        .sidebar {
            width: 70px;
            background-color: #0d0d0d;
            border-right: 2px solid #ffaa00;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
            gap: 20px;
        }

        .nav-icon { width: 45px; height: 45px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .nav-icon.active { background: #ffaa00; color: #000; font-weight: bold; }
        .nav-icon.m-circle { background: #6a1b9a; font-size: 20px; }

        /* Área do Chat */
        .chat-main { flex: 1; display: flex; flex-direction: column; background: #000; }

        .chat-header {
            padding: 15px;
            background: #111;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #222;
        }

        /* ONDE AS MENSAGENS FICAM (O "bloco preto" que agora funciona) */
        #chat-display {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .bubble {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            font-size: 14px;
            line-height: 1.4;
        }
        .me { align-self: flex-end; background: #ffaa00; color: #000; border-bottom-right-radius: 2px; }
        .other { align-self: flex-start; background: #222; color: #fff; border-bottom-left-radius: 2px; }

        /* Barra de Input (Rodapé) */
        .input-bar {
            padding: 15px;
            background: #000;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .icon-btn { background: #222; border: none; color: white; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; }

        #msg-input {
            flex: 1;
            background: #111;
            border: 1px solid #333;
            border-radius: 25px;
            padding: 10px 20px;
            color: white;
            outline: none;
        }

        .send-btn { background: none; border: none; font-size: 24px; cursor: pointer; transition: 0.2s; }
        .send-btn:active { transform: scale(0.8); }
    </style>
</head>
<body>

<div class="app-container">
    <aside class="sidebar">
        <div class="nav-icon active">👥</div>
        <div class="nav-icon"></div>
        <div class="nav-icon m-circle">M</div>
        <div style="margin-top: auto; margin-bottom: 20px;">⚙️</div>
    </aside>

    <main class="chat-main">
        <header class="chat-header">
            <strong>emanuel silva</strong>
            <div>📞 📹</div>
        </header>

        <div id="chat-display">
            </div>

        <footer class="input-bar">
            <button class="icon-btn">📅</button>
            <button class="icon-btn">📎</button>
            <input type="text" id="msg-input" placeholder="Digite uma mensagem...">
            <button id="send-btn" class="send-btn">⚡</button>
        </footer>
    </main>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    // 1. SUBSTITUA PELOS SEUS DADOS DO FIREBASE CONSOLE:
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_PROJETO.firebaseapp.com",
        projectId: "SEU_PROJETO_ID",
        storageBucket: "SEU_PROJETO.appspot.com",
        messagingSenderId: "SEU_SENDER_ID",
        appId: "SUA_APP_ID"
    };

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const msgCollection = collection(db, "mensagens");

    const chatDisplay = document.getElementById('chat-display');
    const msgInput = document.getElementById('msg-input');
    const sendBtn = document.getElementById('send-btn');

    // 2. FUNÇÃO PARA LER MENSAGENS (TEMPO REAL)
    const q = query(msgCollection, orderBy("createdAt", "asc"));
    
    onSnapshot(q, (snapshot) => {
        chatDisplay.innerHTML = ""; // Limpa a tela
        snapshot.forEach((doc) => {
            const data = doc.data();
            const div = document.createElement('div');
            // Aqui definimos quem é "você" para alinhar a bolha
            div.className = `bubble ${data.user === "Emanuel" ? 'me' : 'other'}`;
            div.innerText = data.text;
            chatDisplay.appendChild(div);
        });
        // Scroll automático
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });

    // 3. FUNÇÃO PARA ENVIAR
    async function sendMessage() {
        const text = msgInput.value.trim();
        if (text === "") return;

        msgInput.value = ""; // Limpa o campo na hora
        
        try {
            await addDoc(msgCollection, {
                text: text,
                user: "Emanuel", // Altere conforme o usuário logado
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Erro ao enviar: ", e);
        }
    }

    sendBtn.onclick = sendMessage;
    msgInput.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

</script>

</body>
</html>
