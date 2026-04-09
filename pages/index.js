// Configurações de Personagens e Temas
const narutoTheme = {
  maleIcons: ['Sasuke', 'Kakashi', 'Naruto', 'Itachi'],
  femaleIcons: ['Sakura', 'Hinata', 'Tsunade', 'Ino'],
  animations: {
    send: 'rasengan_spin',
    call: 'shuriken_rotate'
  }
};

// --- FUNCIONALIDADES DE MÍDIA ---

async function startMedia(type) {
  try {
    const constraints = {
      video: type === 'video',
      audio: true
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (type === 'video') {
      // Lógica para abrir modal de chamada com animação de Shuriken
      showCallOverlay('shuriken_animation');
      document.getElementById('localVideo').srcObject = stream;
    }
    console.log(`${type === 'video' ? 'Vídeo' : 'Áudio'} ativado com sucesso ninja!`);
  } catch (err) {
    console.error("Erro ao acessar câmera/microfone: ", err);
    alert("Kuwabara! O acesso à mídia foi negado.");
  }
}

// --- ANIMAÇÃO DO RASENGAN NO BOTÃO ENVIAR ---

function handleSendMessage() {
  const btn = document.getElementById('send-btn');
  const input = document.getElementById('chat-input');

  if (input.value.trim() !== "") {
    // Ativa animação CSS do Rasengan
    btn.classList.add('rasengan-active');
    
    // Simula o impacto do golpe ao enviar
    setTimeout(() => {
      console.log("Mensagem enviada: ", input.value);
      input.value = "";
      btn.classList.remove('rasengan-active');
    }, 800); 
  }
}

// --- GERADORES E ARQUIVOS ---

const ninjaTools = {
  generateGif: (keyword) => {
    // Integração com API (ex: Giphy) usando tema Naruto
    return `https://api.giphy.com/v1/gifs/search?q=naruto_${keyword}`;
  },
  
  uploadFile: (file) => {
    console.log("Arquivo selado e enviado: ", file.name);
    // Lógica Firebase/Cloud para upload
  },

  openCamera: () => {
    document.getElementById('camera-input').click();
  }
};

// --- INTERFACE DE USUÁRIO (UI) ---

// Exemplo de como você pode mapear os avatares no seu sistema de perfis
function setNinjaAvatar(gender) {
  const character = gender === 'masculino' 
    ? narutoTheme.maleIcons[Math.floor(Math.random() * 4)]
    : narutoTheme.femaleIcons[Math.floor(Math.random() * 4)];
  
  return `assets/images/characters/${character.toLowerCase()}.png`;
}
