<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel Ultra Update: Chakra Edition</title>
    <style>
        /* ESTILOS CYBERPUNK/ANIME - BASE */
        :root {
            --naruto-orange: #ff9800;
            --naruto-yellow: #ffeb3b;
            --cyber-black: #0a0a0c;
            --glass: rgba(255, 255, 255, 0.1);
            --transition: all 0.3s ease;
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
            overflow: hidden; /* Para a chuva de chakra não criar barras de rolagem no corpo */
        }

        #sistema-emanuel {
            width: 95%;
            max-width: 500px;
            height: 90vh;
            background: #111;
            border: 2px solid var(--naruto-orange);
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 30px rgba(255, 152, 0, 0.3);
            position: relative;
            z-index: 10;
        }

        /* ÁREA DE VÍDEO (REDUZIDA PARA DAR ESPAÇO AO CHAT) */
        #call-screen {
            height: 120px;
            background: #000;
            position: relative;
            border-bottom: 1px solid #333;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(1.1) contrast(1.1);
        }

        .call-btns {
            position: absolute;
            bottom: 5px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 5px;
        }

        .btn-call {
            background: var(--glass);
            border: 1px solid var(--naruto-orange);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            backdrop-filter: blur(5px);
            transition: var(--transition);
        }
        .btn-call:hover { background: var(--naruto-orange); color: black; }

        /* IA ACTIONS */
        .ia-bar {
            display: flex;
            gap: 5px;
            padding: 8px;
            background: #151515;
            overflow-x: auto;
            border-bottom: 1px solid #222;
        }

        .btn-ia {
            background: linear-gradient(45deg, var(--naruto-orange), #ff5722);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            white-space: nowrap;
            transition: var(--transition);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .btn-ia:hover { transform: translateY(-2px); filter: brightness(1.1); }

        /* CHAT E GRUPOS */
        #chat-window {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: linear-gradient(to bottom, #111, #080808);
            position: relative;
        }

        .msg { margin-bottom: 15px; animation: fadeIn 0.3s ease; position: relative; z-index: 2; }
        .msg b { color: var(--naruto-orange); }
        .msg-meta { font-size: 10px; color: #666; margin-left: 5px; }

        /* NOVA ÁREA DE CHAKRA INFINITO (PAINEL DE GIFS ADAPTADO) */
        #chakra-panel {
            display: none;
            height: 150px;
            background: #000;
            border-top: 2px solid var(--naruto-yellow);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        #chakra-panel-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--naruto-yellow);
            font-weight: bold;
            font-size: 14px;
            text-shadow: 0 0 10px var(--naruto-orange);
            z-index: 10;
            text-align: center;
            pointer-events: none;
        }

        /* ANIMAÇÃO DA CHUVA DE CHAKRA (CSS PURO - LEVE) */
        .chakra-drop {
            position: absolute;
            background: linear-gradient(to bottom, var(--naruto-yellow), var(--naruto-orange));
            border-radius: 50% 50% 20% 20%; /* Formato pontudo/gotícula */
            filter: drop-shadow(0 0 5px var(--naruto-yellow));
            animation: fall infinite linear;
        }

        @keyframes fall {
            from { transform: translateY(-100px) scaleY(1); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            to { transform: translateY(200px) scaleY(1.5); opacity: 0; }
        }

        /* INPUT E BOTÃO NARUTO */
        .input-area {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #1a1a1a;
            gap: 10px;
            border-top: 1px solid #333;
        }

        #user-msg {
            flex: 1;
            background: #222;
            border: 1px solid #444;
            padding: 14px;
            border-radius: 25px;
            color: white;
            outline: none;
            font-size: 14px;
            transition: var(--transition);
        }
        #user-msg:focus { border-color: var(--naruto-orange); box-shadow: 0 0 10px rgba(255,152,0,0.2); }

        #naruto-btn {
            width: 55px;
            height: 55px;
            background: url('https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/naruto-face.png');
            background-size: cover;
            background-position: center;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 3px solid var(--naruto-orange);
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.3);
            position: relative;
        }

        #naruto-btn:hover { 
            transform: scale(1.1) rotate(10deg); 
            box-shadow: 0 0 25px var(--naruto-orange); 
            filter: brightness(1.1);
        }

        #naruto-btn:active { transform: scale(0.95); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Estilo da Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: var(--naruto-orange); border-radius: 3px; }

        /* ESTILO DO "GIF" DE CHAKRA NO CHAT */
        .chakra-chat-box {
            width: 120px;
            height: 80px;
            border-radius: 10px;
            background: #000;
            border: 2px solid var(--naruto-yellow);
            position: relative;
            overflow: hidden;
            margin-top: 5px;
            box-shadow: 0 0 10px rgba(255, 235, 59, 0.3);
        }
    </style>
</head>
<body>

<div id="sistema-emanuel">
    <div id="call-screen">
        <video id="localStream" autoplay playsinline muted poster="https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/cyber.jpg"></video>
        <div class="call-btns">
            <button class="btn-call" onclick="initMedia('video')">📸 Câmera</button>
            <button class="btn-call" onclick="initMedia('audio')">🎙️ Áudio</button>
            <button class="btn-call" onclick="document.getElementById('file-input').click()">📁 Arquivo</button>
            <input type="file" id="file-input" hidden onchange="handleFile(this.files)">
        </div>
    </div>

    <div class="ia-bar">
        <button class="btn-ia" onclick="triggerIA('video')">📹 VÍDEO IA</button>
        <button class="btn-ia" onclick="triggerIA('meme')">🤡 MEME IA</button>
        <button class="btn-ia" onclick="suggestTheme()">💡 TEMA</button>
        <button class="btn-ia" onclick="createGroup()">👥 NOVO GRUPO</button>
    </div>

    <div id="chat-window">
        <div class="msg"><b>Sistema:</b> <br>Emanuel Ultra Online. Chakra carregado! <span class="msg-meta">agora</span></div>
    </div>

    <div id="chakra-panel" onclick="sendChakraGif()">
        <div id="chakra-panel-label">CLIQUE PARA ENVIAR<br>GIFS ANIMADOS</div>
        </div>

    <div class="input-area">
        <button onclick="toggleChakraPanel()" style="background:none; border:2px solid var(--naruto-yellow); border-radius:50%; cursor:pointer; font-size:18px; color:var(--naruto-yellow); width:40px; height:40px; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 10px rgba(255,235,59,0.2);">🔥</button>
        <input type="text" id="user-msg" placeholder="Mande seu jutsu...">
        <div id="naruto-btn" onclick="mainAction()" title="Enviar Mensagem (Jutsu)"></div>
    </div>
</div>

<script>
    // --- LÓGICA DE ENVIO E NARUTO ---
    function mainAction() {
        const input = document.getElementById('user-msg');
        const val = input.value.trim();
        if(val !== "") {
            addMsg("Você", val);
            analisarTextoIA(val);
            input.value = "";
            input.focus();
        }
    }

    function addMsg(user, text, isHtml = false) {
        const win = document.getElementById('chat-window');
        const div = document.createElement('div');
        div.className = 'msg';
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        div.innerHTML = `<b>${user}:</b> ${isHtml ? text : `<br>${text}`}<span class="msg-meta">${time}</span>`;
        win.appendChild(div);
        win.scrollTop = win.scrollHeight;
    }

    // --- NOVA LÓGICA DE CHAKRA INFINITO (CSS ANIMADO) ---
    let chakraInterval;

    function toggleChakraPanel() {
        const p = document.getElementById('chakra-panel');
        const isHidden = p.style.display === 'none' || p.style.display === '';
        p.style.display = isHidden ? 'block' : 'none';
        
        if(isHidden) {
            startChakraRain('chakra-panel', 30); // Cria a chuva no painel
            addMsg("Sistema", "🔥 <i>Painel de Chakra Ativado! Clique nele para enviar energia.</i>", true);
        } else {
            stopChakraRain();
        }
    }

    function startChakraRain(containerId, count) {
        const container = document.getElementById(containerId);
        stopChakraRain(); // Limpa qualquer chuva anterior

        for(let i = 0; i < count; i++) {
            createChakraDrop(container);
        }
    }

    function createChakraDrop(container) {
        const drop = document.createElement('div');
        drop.className = 'chakra-drop';
        
        // Randomiza tamanho, posição e velocidade (efeito pontudo descendo)
        const size = Math.random() * 15 + 5; // 5px a 20px
        drop.style.width = size + 'px';
        drop.style.height = (size * 1.5) + 'px'; // Mais alto que largo (pontudo)
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's'; // 0.5s a 1.5s (rápido)
        drop.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(drop);
    }

    function stopChakraRain() {
        const panel = document.getElementById('chakra-panel');
        const drops = panel.querySelectorAll('.chakra-drop');
        drops.forEach(d => d.remove());
    }

    // Envia a animação de chakra para o chat
    function sendChakraGif() {
        const chakraHtml = `
            <div class="chakra-chat-box" id="chakra-chat-${Date.now()}">
                </div>
        `;
        addMsg("Você", chakraHtml, true);
        
        // Inicia a animação dentro da caixinha que acabou de ser criada no chat
        const lastChatBox = document.querySelector('.chakra-chat-box:last-child');
        if(lastChatBox) {
            startChakraRain(lastChatBox.id, 15); // Menos gotas para não pesar
        }
        
        toggleChakraPanel(); // Fecha o painel após enviar
    }

    // --- CHAMADAS DE VÍDEO HD (Ultra Qualidade) ---
    async function initMedia(type) {
        addMsg("Sistema", `⏳ Tentando ativar ${type.toUpperCase()} em Ultra Qualidade...`);
        try {
            const constraints = {
                video: type === 'video' ? { 
                    width: { ideal: 1280 }, 
                    height: { ideal: 720 }, 
                    frameRate: { ideal: 30 },
                    facingMode: "user"
                } : false,
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if(type === 'video') {
                const videoInput = document.getElementById('localStream');
                videoInput.srcObject = stream;
                videoInput.style.filter = "none"; // Remove o poster
            }
            addMsg("Sistema", `⚡ ${type.toUpperCase()} ativado. Qualidade Ultra Garantida.`);
        } catch(e) {
            addMsg("Sistema", `❌ Erro de mídia: ${e.message}. Verifique as permissões.`);
        }
    }

    // --- MÓDULO DE IA GENERATIVA (Simulação Leve) ---
    function triggerIA(type) {
        addMsg("IA Emanuel", `⏳ Processando Prompt Mágico para ${type.toUpperCase()}...`);
        setTimeout(() => {
            if(type === 'video') {
                addMsg("IA Emanuel", `<br>📹 Vídeo Cinemático Gerado:<br><video controls width="100%" style="border-radius:10px; border:1px solid var(--naruto-orange);"><source src="https://www.w3schools.com/html/mov_bbb.mp4"></video>`, true);
            } else {
                addMsg("IA Emanuel", `<br>🤡 Meme Exclusivo Gerado:<br><img src="https://api.memegen.link/images/custom/_/ia_emanuel_meme.png?background=https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/cyber.jpg" width="100%" style="border-radius:10px; border:2px solid var(--naruto-yellow);">`, true);
            }
        }, 3500);
    }

    function suggestTheme() {
        const temas = ["Integração Firebase Pro", "Jutsus de Código Limpo", "Futuro da IA Generativa", "Otimização para Web"];
        const t = temas[Math.floor(Math.random()*temas.length)];
        addMsg("IA Emanuel", `💡 Sugestão de Tema: <b>${t}</b>`, true);
    }

    function analisarTextoIA(txt) {
        if(txt.toLowerCase().includes("ajuda")) suggestTheme();
        if(txt.toLowerCase().includes("chakra")) toggleChakraPanel();
    }

    // --- OUTRAS FUNÇÕES ---
    function createGroup() {
        const nome = prompt("Nome do Novo Grupo Ninja:");
        if(nome) addMsg("Sistema", `👥 Grupo <b>${nome}</b> criado. Membros e IA ativados.`, true);
    }

    function handleFile(files) {
        if(files.length) addMsg("Você", `📁 Arquivo pronto para envio: <b>${files[0].name}</b>`, true);
    }

    // Inicia com foco no input
    document.getElementById('user-msg').focus();
</script>

</body>
</html>
