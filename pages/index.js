<div id="sistema-emanuel">
    
    <div id="call-area" style="background: #000; border: 2px solid #ff9800; border-radius: 15px; padding: 10px;">
        <video id="video-stream" autoplay playsinline style="width: 100%; border-radius: 10px;"></video>
        <div class="controles-chamada" style="display: flex; justify-content: space-around; margin-top: 10px;">
            <button onclick="controlarMidia('video')">📸 Câmera</button>
            <button onclick="controlarMidia('audio')">🎙️ Áudio</button>
            <button onclick="document.getElementById('input-arquivo').click()">📁 Enviar Arquivo</button>
            <input type="file" id="input-arquivo" style="display:none" onchange="uploadArquivo(this.files)">
        </div>
    </div>

    <div id="chat-global" style="margin-top: 20px; display: flex; flex-direction: column; height: 400px;">
        <div id="lista-mensagens" style="flex-grow: 1; overflow-y: auto; background: #1a1a1d; padding: 10px; color: white;">
            </div>

        <div id="gif-container" style="display: none; height: 150px; overflow-x: scroll; white-space: nowrap; background: #000; padding: 5px;">
            </div>

        <div class="input-container" style="display: flex; align-items: center; gap: 10px; padding: 10px;">
            <button onclick="toggleGifPanel()" style="background: none; border: none; font-size: 20px; cursor: pointer;">🎬</button>
            <input type="text" id="msg-input" placeholder="Digite sua mensagem ninja..." style="flex-grow: 1; padding: 10px; border-radius: 20px; border: 1px solid #ff9800;">
            
            <div id="btn-enviar-naruto" onclick="enviarMensagem()" style="width: 50px; height: 50px; background: url('https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/naruto-face.png') no-repeat center; background-size: contain; cursor: pointer;"></div>
        </div>
    </div>
</div>

<script>
// --- CONFIGURAÇÃO DE ÁUDIO E VÍDEO (QUALIDADE ULTRA) ---
async function controlarMidia(tipo) {
    const constraints = {
        video: tipo === 'video' ? { width: 1920, height: 1080, frameRate: 60 } : false,
        audio: { echoCancellation: true, noiseSuppression: true }
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('video-stream').srcObject = stream;
        console.log("Mídia ativada com sucesso!");
    } catch (err) {
        alert("Erro ao acessar câmera/microfone: " + err);
    }
}

// --- PESQUISA DE GIFS DE ANIME (INTEGRAÇÃO GIPHY) ---
let gifOffset = 0;
async function buscarGifsAnime() {
    const apiKey = 'SUA_CHAVE_AQUI'; // Você pode obter uma gratuita no Giphy Developers
    const container = document.getElementById('gif-container');
    
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=naruto+anime&limit=20&offset=${gifOffset}`);
        const data = await response.json();
        
        data.data.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif.images.fixed_height_small.url;
            img.style = "height: 100px; margin-right: 5px; cursor: pointer; border-radius: 5px;";
            img.onclick = () => enviarGif(gif.images.fixed_height.url);
            container.appendChild(img);
        });
        gifOffset += 20; // Para carregar mais da próxima vez (infinito)
    } catch (e) {
        console.log("Erro ao carregar GIFs");
    }
}

function toggleGifPanel() {
    const panel = document.getElementById('gif-container');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.children.length === 0) buscarGifsAnime();
}

// --- FUNÇÕES DO CHAT E GRUPOS ---
function enviarMensagem() {
    const input = document.getElementById('msg-input');
    const msg = input.value;
    if (msg.trim() !== "") {
        exibirNaTela(`<b>Você:</b> ${msg}`);
        // Lógica de IA: Sugerir Emoji ou Tema
        processarIA(msg);
        input.value = "";
    }
}

function enviarGif(url) {
    exibirNaTela(`<img src="${url}" style="width: 150px; border-radius: 10px;">`);
}

function exibirNaTela(html) {
    const lista = document.getElementById('lista-mensagens');
    lista.innerHTML += `<div style="margin-bottom: 10px; animation: slideIn 0.3s ease;">${html}</div>`;
    lista.scrollTop = lista.scrollHeight;
}

// --- INTEGRAÇÃO COM IA (MEMES E SUGESTÕES) ---
function processarIA(texto) {
    // Exemplo de sugestão automática de cor/tema
    if (texto.includes("tema")) {
        document.body.style.background = "#121212"; // Sugestão Dark Cyberpunk
        exibirNaTela("🤖 <i>IA: Sugeri um novo tema visual para sua conversa!</i>");
    }
}

function uploadArquivo(files) {
    if(files.length > 0) {
        exibirNaTela(`📎 Arquivo enviado: ${files[0].name}`);
        // Aqui você conectaria com seu Firebase Storage
    }
}
</script>
