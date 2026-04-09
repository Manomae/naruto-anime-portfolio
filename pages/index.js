<style>
    :root {
        --primary-color: #ff9800; /* Laranja Naruto */
        --bg-dark: #0a0a0c;
        --accent-glow: 0 0 15px rgba(255, 152, 0, 0.5);
    }

    /* Botão de Enviar com a cara do Naruto */
    #btn-send-naruto {
        background: url('https://i.imgur.com/your-naruto-face-icon.png') no-repeat center;
        background-size: contain;
        width: 50px;
        height: 50px;
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
    }

    #btn-send-naruto:hover {
        transform: scale(1.1) rotate(5deg);
    }

    /* Melhoria Visual das Chamadas */
    .call-interface {
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--primary-color);
        border-radius: 20px;
        box-shadow: var(--accent-glow);
    }

    .video-frame {
        width: 100%;
        border-radius: 10px;
        background: #000;
        filter: contrast(1.1) brightness(1.1); /* Melhoria visual via CSS */
    }
</style>

<div id="main-app">
    <div class="call-interface" id="call-ui">
        <video id="localVideo" class="video-frame" autoplay playsinline muted></video>
        <div class="controls">
            <button onclick="toggleCamera()" id="cam-btn">📸 Câmera</button>
            <button onclick="toggleMic()" id="mic-btn">🎙️ Áudio</button>
            <button onclick="sendFile()" id="file-btn">📁 Enviar Arquivo</button>
        </div>
    </div>

    <div class="chat-container">
        <div id="group-list"></div> <div id="messages-display"></div>
        
        <div class="input-area">
            <input type="text" id="msg-input" placeholder="Sugestão de tema: Treinamento Ninja...">
            <button id="btn-send-naruto" onclick="handleSendMessage()"></button>
        </div>
    </div>

    <div id="ai-features">
        <button onclick="generateAnimeGif()">🎬 Gerar GIF Anime</button>
        <button onclick="generateAIMeme()">🖼️ Criar Meme das Minhas Fotos</button>
        <button onclick="generateAIVideo()">📹 Gerar Vídeo IA</button>
    </div>
</div>

<script>
// --- LÓGICA DE CHAMADA (Qualidade Ultra) ---
async function startCall(isVideo) {
    const constraints = {
        video: isVideo ? { width: 1280, height: 720, frameRate: 30 } : false,
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    };
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('localVideo').srcObject = stream;
        // Lógica de WebRTC para conectar ao peer aqui...
    } catch (err) {
        console.error("Erro ao acessar mídia: ", err);
    }
}

// --- GESTÃO DE GRUPOS (Firebase) ---
function createGroup(name) {
    const groupData = {
        name: name,
        createdAt: new Date(),
        members: [currentUser.uid],
        settings: { aiEnabled: true, animeTheme: true }
    };
    db.collection("groups").add(groupData).then(() => {
        alert("Grupo '" + name + "' criado com sucesso!");
    });
}

// --- FUNCIONALIDADES DE IA ---
async function generateAnimeGif() {
    // Integração com API de Gifs (ex: Giphy/Tenor) com filtro "Anime"
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=naruto-anime&api_key=SUA_CHAVE`);
    const data = await response.json();
    // Lógica para injetar infinitos gifs no chat...
}

async function handleSendMessage() {
    const text = document.getElementById('msg-input').value;
    if(text) {
        // Enviar para Firebase e disparar sugestão de emojis de IA
        const emojiSuggestion = suggestEmoji(text);
        sendMessageToFirebase(text + " " + emojiSuggestion);
        document.getElementById('msg-input').value = "";
    }
}

// --- SUGESTÕES AUTOMÁTICAS ---
function suggestTheme() {
    const themes = ["Estratégias de Batalha", "Design Cyberpunk", "Futuro da IA"];
    return themes[Math.floor(Math.random() * themes.length)];
}

// Inicializar cores e formato sugerido
document.body.style.setProperty('--primary-color', '#ff5722'); // Exemplo de sugestão de cor
</script>
