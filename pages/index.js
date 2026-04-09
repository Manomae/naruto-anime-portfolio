<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel Ultra Update</title>
    <style>
        /* ESTILOS CYBERPUNK/ANIME */
        :root {
            --naruto-orange: #ff9800;
            --cyber-black: #0a0a0c;
            --glass: rgba(255, 255, 255, 0.1);
        }

        body {
            background-color: var(--cyber-black);
            color: #fff;
            font-family: 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        #sistema-emanuel {
            width: 95%;
            max-width: 500px;
            background: #111;
            border: 2px solid var(--naruto-orange);
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
        }

        /* ÁREA DE VÍDEO */
        #call-screen {
            height: 180px;
            background: #000;
            position: relative;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .call-btns {
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .btn-call {
            background: var(--glass);
            border: 1px solid var(--naruto-orange);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 11px;
            backdrop-filter: blur(5px);
        }

        /* CHAT E GRUPOS */
        #chat-window {
            height: 350px;
            overflow-y: auto;
            padding: 15px;
            background: linear-gradient(to bottom, #111, #050505);
        }

        .msg { margin-bottom: 12px; animation: fadeIn 0.3s ease; }
        .msg b { color: var(--naruto-orange); }

        /* PAINEL DE GIFS E IA */
        #gif-panel {
            display: none;
            height: 120px;
            background: #000;
            border-top: 1px solid var(--naruto-orange);
            overflow-x: auto;
            white-space: nowrap;
            padding: 10px;
        }

        .ia-bar {
            display: flex;
            gap: 5px;
            padding: 8px;
            background: #1a1a1a;
            overflow-x: auto;
        }

        .btn-ia {
            background: var(--naruto-orange);
            color: black;
            border: none;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            white-space: nowrap;
        }

        /* INPUT E BOTÃO NARUTO */
        .input-area {
            display: flex;
            align-items: center;
            padding: 10px;
            background: #151515;
            gap: 10px;
        }

        #user-msg {
            flex: 1;
            background: #222;
            border: 1px solid #333;
            padding: 12px;
            border-radius: 25px;
            color: white;
            outline: none;
        }

        #naruto-btn {
            width: 50px;
            height: 50px;
            background: url('https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/naruto-face.png'), url('https://cdn-icons-png.flaticon.com/512/1088/1088537.png'); /* Fallback icon */
            background-size: cover;
            background-position: center;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.3s;
            border: 2px solid var(--naruto-orange);
        }

        #naruto-btn:hover { transform: scale(1.1) rotate(10deg); box-shadow: 0 0 15px var(--naruto-orange); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>

<div id="sistema-emanuel">
    <div id="call-screen">
        <video id="localStream" autoplay playsinline muted></video>
        <div class="call-btns">
            <button class="btn-call" onclick="initMedia('video')">📸 Câmera</button>
            <button class="btn-call" onclick="initMedia('audio')">🎙️ Áudio</button>
            <button class="btn-call" onclick="document.getElementById('file-input').click()">📁 Arquivo</button>
            <input type="file" id="file-input" hidden onchange="alert('Arquivo pronto: ' + this.files[0].name)">
        </div>
    </div>

    <div class="ia-bar">
        <button class="btn-ia" onclick="triggerIA('video')">📹 GERAR VÍDEO IA</button>
        <button class="btn-ia" onclick="triggerIA('meme')">🤡 GERAR MEME</button>
        <button class="btn-ia" onclick="suggestTheme()">💡 TEMA</button>
        <button class="btn-ia" onclick="createGroup()">👥 CRIAR GRUPO</button>
    </div>

    <div id="chat-window">
        <div class="msg"><b>Sistema:</b> Emanuel Online. Pronto para o próximo jutsu?</div>
    </div>

    <div id="gif-panel">
        <div id="gif-content" style="display: flex; gap: 10px;"></div>
    </div>

    <div class="input-area">
        <button onclick="toggleGifs()" style="background:none; border:none; cursor:pointer; font-size:20px;">🖼️</button>
        <input type="text" id="user-msg" placeholder="Digite sua mensagem...">
        <div id="naruto-btn" onclick="mainAction()"></div>
    </div>
</div>

<script>
    // --- LÓGICA DE ENVIO E NARUTO ---
    function mainAction() {
        const input = document.getElementById('user-msg');
        const val = input.value.trim();
        if(val !== "") {
            addMsg("Você", val);
            if(val.toLowerCase().includes("ajuda")) suggestTheme();
            input.value = "";
        }
    }

    function addMsg(user, text, isHtml = false) {
        const win = document.getElementById('chat-window');
        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = `<b>${user}:</b> ${isHtml ? text : `<br>${text}`}`;
        win.appendChild(div);
        win.scrollTop = win.scrollHeight;
    }

    // --- GIFS ADAPTADOS (SCROLL INFINITO) ---
    function toggleGifs() {
        const p = document.getElementById('gif-panel');
        p.style.display = p.style.display === 'none' ? 'block' : 'none';
        if(p.style.display === 'block') loadGifs();
    }

    function loadGifs() {
        const cont = document.getElementById('gif-content');
        // Simulação de busca infinita usando Gifer/Tenor IDs randômicos para evitar bloqueio de API
        const animeGifs = [
            "https://media.tenor.com/images/8e6c40683a379f67137f62c05763920c/tenor.gif",
            "https://media.tenor.com/images/6987747e09880d941e7d23d857d4131b/tenor.gif",
            "https://media.tenor.com/images/7376ee22631525287315147575231923/tenor.gif",
            "https://media.tenor.com/images/2b7e16335a9d16a5757d549f3e589839/tenor.gif"
        ];
        
        animeGifs.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style = "height: 80px; border-radius: 8px; cursor: pointer;";
            img.onclick = () => { addMsg("Você", `<img src="${url}" width="150">`, true); toggleGifs(); };
            cont.appendChild(img);
        });
    }

    // --- CHAMADAS DE VÍDEO HD ---
    async function initMedia(type) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video' ? { width: 1280, height: 720 } : false,
                audio: { echoCancellation: true, noiseSuppression: true }
            });
            if(type === 'video') document.getElementById('localStream').srcObject = stream;
            addMsg("Sistema", `${type.toUpperCase()} ativado com qualidade Ultra.`);
        } catch(e) {
            alert("Erro de mídia: " + e.message);
        }
    }

    // --- MÓDULO DE IA GENERATIVA ---
    function triggerIA(type) {
        addMsg("IA Emanuel", `⏳ Gerando ${type} exclusivo para você...`);
        setTimeout(() => {
            if(type === 'video') {
                addMsg("IA Emanuel", `<video controls width="100%"><source src="https://www.w3schools.com/html/mov_bbb.mp4"></video>`, true);
            } else {
                addMsg("IA Emanuel", `<img src="https://api.memegen.link/images/custom/_/ia_emanuel_meme.png?background=https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/cyber.jpg" width="100%">`, true);
            }
        }, 3000);
    }

    function suggestTheme() {
        const temas = ["Treinamento Ninja", "Novas APIs", "Design do Amanhã", "Segurança Firebase"];
        const t = temas[Math.floor(Math.random()*temas.length)];
        addMsg("IA Emanuel", `Sugestão de Tema: <b>${t}</b>`, true);
    }

    function createGroup() {
        const nome = prompt("Nome do Grupo:");
        if(nome) addMsg("Sistema", `Grupo <b>${nome}</b> criado com sucesso! Mensagens de IA ativadas.`);
    }
</script>

</body>
</html>
