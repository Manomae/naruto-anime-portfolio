// 1. Configuração Direta (Sem alertas que travam o sistema)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    appId: "SUA_APP_ID"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. FUNÇÃO QUE CORRIGE A SINCRONIZAÇÃO (O "Cérebro" do sistema)
async function sincronizarSistema() {
    const statusLabel = document.querySelector('.servidor-status') || { innerText: "" };
    console.log("Iniciando Jutsus de Sincronização...");

    // Em vez de alert(), usamos o console e atualizamos a UI
    // Isso evita que o navegador do celular trave a tela
    try {
        // Pega os contatos que JÁ ESTÃO no seu Firebase (onde você salvou seu e-mail)
        db.collection("contatos").onSnapshot((snapshot) => {
            const lista = document.getElementById('contatos-render') || document.getElementById('listaContatos');
            if(!lista) return;
            
            lista.innerHTML = ""; // Limpa o "Sincronizando..."

            snapshot.forEach((doc) => {
                const contato = doc.data();
                const item = document.createElement('div');
                item.className = 'contato-card'; // Mantém seu design preferido
                item.innerHTML = `
                    <span>${contato.nome || 'Ninja'}</span>
                    <div class="botoes">
                        <button onclick="fazerChamada('${contato.nome}', 'audio')">📞</button>
                        <button onclick="fazerChamada('${contato.nome}', 'video')">🎥</button>
                    </div>
                `;
                lista.appendChild(item);
            });
            console.log("Contatos sincronizados com sucesso!");
        });
    } catch (err) {
        console.error("Erro Crítico:", err);
    }
}

// 3. LÓGICA DAS CHAMADAS (Com as animações de Naruto que você pediu)
function fazerChamada(nome, tipo) {
    const tela = document.getElementById('call-screen'); 
    tela.style.display = 'flex';
    
    if (tipo === 'video') {
        // Ativa a câmera e o Rasengan em intervalos
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            document.getElementById('videoPlayer').srcObject = stream;
            
            // Intervalo do Rasengan (Aparece e some)
            setInterval(() => {
                const r = document.getElementById('rasengan-animation');
                if(r) {
                    r.style.display = 'block';
                    setTimeout(() => r.style.display = 'none', 2000);
                }
            }, 5000);
        });
    } else {
        // Áudio: Mostra o Naruto segurando o telefone
        document.getElementById('naruto-audio-img').style.display = 'block';
        document.getElementById('videoPlayer').style.display = 'none';
    }
}

// Inicializa sem travar nada
window.onload = sincronizarSistema;
