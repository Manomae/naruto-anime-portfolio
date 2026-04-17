/**
 * SISTEMA MEU SHINOBI - CÓDIGO UNIFICADO (index.js)
 * Funcionalidades: Nickname, Foto de Anime, Chamadas, Arquivos e Acessibilidade
 */

// 1. ESTADO GLOBAL DO USUÁRIO
const shinobiState = {
    nickname: localStorage.getItem('shinobi_nick') || "Shinobi_Inativo",
    avatar: localStorage.getItem('shinobi_avatar') || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Naruto",
    highContrast: false,
    fontSize: 16
};

// 2. INICIALIZAÇÃO AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    applyStoredSettings();
    console.log("Sistema Shinobi pronto para o combate!");
});

function applyStoredSettings() {
    // Atualiza o nome exibido na conversa
    const nameDisplay = document.getElementById('current-chat-name');
    if (nameDisplay) nameDisplay.innerText = `Conversando com: ${shinobiState.nickname}`;
    
    // Atualiza a foto de perfil se houver o elemento
    const profileImg = document.getElementById('user-profile-img');
    if (profileImg) profileImg.src = shinobiState.avatar;
}

// 3. SISTEMA DE PERFIL (NICKNAME E FOTO)
function handleProfileCustomization() {
    const action = prompt("O que deseja fazer?\n1. Mudar Nickname de Anime\n2. Gerar Foto de Anime Aleatória");
    
    if (action === "1") {
        const newNick = prompt("Digite seu novo Nickname de Anime:", shinobiState.nickname);
        if (newNick) {
            shinobiState.nickname = newNick;
            localStorage.setItem('shinobi_nick', newNick);
            applyStoredSettings();
        }
    } else if (action === "2") {
        const randomId = Math.floor(Math.random() * 10000);
        // Usando API de Avatares Pixel Art (combina muito com o tema)
        const newAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randomId}`;
        shinobiState.avatar = newAvatar;
        localStorage.setItem('shinobi_avatar', newAvatar);
        applyStoredSettings();
        alert("Novo visual Shinobi gerado!");
    }
}

// 4. COMUNICAÇÃO (VÍDEO, ÁUDIO E ARQUIVOS)
async function startVideoCall() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        alert("Jutsu de Transmissão de Vídeo Ativado! Câmera conectada.");
        // Aqui você pode direcionar o 'stream' para um elemento <video>
        console.log("Stream de vídeo iniciado:", stream);
    } catch (err) {
        alert("Erro ao acessar câmera: " + err.message);
    }
}

function startAudioCall() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            alert("Conexão de áudio estabelecida com a Vila!");
        })
        .catch(err => alert("Erro ao acessar microfone: " + err.message));
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        alert(`Arquivo "${file.name}" pronto para ser enviado pelo pergaminho de invocação!`);
        // Lógica de upload (Firebase/Backend) entraria aqui
    }
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const container = document.getElementById('chat-messages');
    
    if (input && input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.style.padding = "10px";
        msg.style.borderBottom = "1px solid #444";
        msg.innerHTML = `<strong>${shinobiState.nickname}:</strong> ${input.value}`;
        container.appendChild(msg);
        
        // Efeito visual no Naruto (se existir o elemento do GIF)
        const naruto = document.querySelector('.naruto-gif');
        if (naruto) {
            naruto.style.transform = "scale(1.1) translateY(-5px)";
            setTimeout(() => naruto.style.transform = "scale(1) translateY(0)", 200);
        }
        
        input.value = "";
        container.scrollTop = container.scrollHeight;
    }
}

// 5. CONFIGURAÇÕES E ACESSIBILIDADE
function openSettings() {
    const choice = prompt("CONFIGURAÇÕES:\n1. Alto Contraste (Visão)\n2. Aumentar Fonte\n3. Excluir Conta\n4. Personalizar Perfil");
    
    switch(choice) {
        case "1":
            document.body.classList.toggle('high-contrast');
            alert("Modo de contraste alterado.");
            break;
        case "2":
            shinobiState.fontSize += 2;
            document.body.style.fontSize = shinobiState.fontSize + "px";
            break;
        case "3":
            if (confirm("Deseja apagar todos os seus dados de Shinobi?")) {
                localStorage.clear();
                location.reload();
            }
            break;
        case "4":
            handleProfileCustomization();
            break;
    }
}
