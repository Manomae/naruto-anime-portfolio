// ==========================================
// CONFIGURAÇÕES INICIAIS E ESTADO DO USUÁRIO
// ==========================================
const userConfig = {
    realName: "Usuário Google", // Aqui entraria a variável do seu login Google
    nickname: localStorage.getItem('shinobi_nick') || "Novo Shinobi",
    avatar: localStorage.getItem('shinobi_avatar') || "https://api.dicebear.com/7.x/bottts/svg?seed=Naruto",
    accessibility: {
        fontSize: 16,
        highContrast: false
    }
};

// ==========================================
// SISTEMA DE NICKNAME E AVATAR
// ==========================================

// Função para criar/editar Nickname de Anime
function openNicknameCreator() {
    const newNick = prompt("Digite seu Nickname de Shinobi:", userConfig.nickname);
    if (newNick) {
        userConfig.nickname = newNick;
        localStorage.setItem('shinobi_nick', newNick);
        renderProfile();
    }
}

// Gerar foto de anime aleatória
function generateAnimePhoto() {
    const randomId = Math.floor(Math.random() * 5000);
    // Usando uma API de avatares estilo pixel/art (ajustável para anime)
    const newAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${randomId}`;
    userConfig.avatar = newAvatar;
    localStorage.setItem('shinobi_avatar', newAvatar);
    renderProfile();
}

// ==========================================
// MECÂNICAS DE COMUNICAÇÃO (VÍDEO, ÁUDIO, ARQUIVOS)
// ==========================================

function startVideoCall() {
    console.log("Iniciando Jutsus de Transmissão de Vídeo...");
    alert(`Chamada de vídeo com ${document.getElementById('current-chat-name').innerText} iniciada!`);
    // Aqui você integraria o Navigator.mediaDevices.getUserMedia()
}

function startAudioCall() {
    console.log("Iniciando Transmissão de Voz via Rádio...");
    alert("Conectando áudio...");
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        alert(`Arquivo "${file.name}" preparado para envio!`);
        // Lógica de upload para o seu backend ou Firebase
    }
}

// ==========================================
// CONFIGURAÇÕES E ACESSIBILIDADE
// ==========================================

function toggleHighContrast() {
    userConfig.accessibility.highContrast = !userConfig.accessibility.highContrast;
    document.body.classList.toggle('high-contrast');
    alert("Modo de alto contraste alterado!");
}

function increaseFontSize() {
    userConfig.accessibility.fontSize += 2;
    document.body.style.fontSize = userConfig.accessibility.fontSize + "px";
}

function deleteAccount() {
    const confirmacao = confirm("TEM CERTEZA? Isso apagará todos os seus dados de Shinobi permanentemente.");
    if (confirmacao) {
        localStorage.clear();
        location.reload();
    }
}

// ==========================================
// INTERFACE E RENDERIZAÇÃO
// ==========================================

function renderProfile() {
    // Atualiza os elementos na tela (certifique-se que os IDs batem com seu HTML)
    const nickElement = document.getElementById('user-display-name');
    if(nickElement) nickElement.innerText = userConfig.nickname;
    
    const imgElement = document.getElementById('profile-img');
    if(imgElement) imgElement.src = userConfig.avatar;
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    console.log("Sistema Shinobi Online!");
});

// ==========================================
// EFEITOS DE ANIMAÇÃO (NARUTO NO PC)
// ==========================================
// Esta função pode ser chamada quando o usuário clica em uma conversa
function triggerNarutoTyping() {
    const narutoAnim = document.querySelector('.naruto-animation');
    if(narutoAnim) {
        narutoAnim.style.display = 'block';
        // Simula ele parando de digitar após 3 segundos
        setTimeout(() => {
            // narutoAnim.style.display = 'none';
        }, 3000);
    }
}
