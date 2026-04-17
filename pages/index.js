// --- ESTILOS (Design Ninja Otimizado) ---
const style = document.createElement('style');
style.innerHTML = `
    body { background-color: #000; font-family: 'Segoe UI', sans-serif; color: #ff9800; margin: 0; overflow: hidden; }
    .container { display: flex; height: 100vh; }
    .sidebar { width: 280px; background: #111; border-right: 1px solid #333; padding: 15px; overflow-y: auto; scrollbar-width: thin; }
    .contato-card { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #222; transition: 0.3s; }
    .contato-card:hover { background: #1a1a1a; }
    .avatar-ninja { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #ff9800; margin-right: 10px; object-fit: cover; }
    .btn-sync { 
        background: linear-gradient(45deg, #ff9800, #e65100); 
        color: black; border: none; padding: 12px; width: 100%; 
        border-radius: 8px; font-weight: bold; cursor: pointer; 
        margin-bottom: 20px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
    }
    #chat { flex: 1; display: flex; flex-direction: column; background: #050505; }
    #mensagens-container { flex: 1; padding: 20px; overflow-y: auto; }
    .status-badge { font-size: 0.8rem; color: #4caf50; border: 1px solid #4caf50; padding: 2px 8px; border-radius: 10px; }
`;
document.head.appendChild(style);

// --- INTERFACE ---
document.body.innerHTML = `
    <div class="container">
        <div class="sidebar">
            <button class="btn-sync" id="btnSync">SINCRONIZAR GOOGLE 🍥</button>
            <div id="lista-contatos"></div>
        </div>
        <div id="chat">
            <div style="padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <h2>Vila da Folha: Chat</h2>
                <span class="status-badge" id="statusServer">Conectado</span>
            </div>
            <div id="mensagens-container"></div>
        </div>
    </div>
`;

// --- LÓGICA CORE (Firebase Otimizado) ---
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// 1. Login com Redirecionamento (Melhor para Mobile)
const btnSync = document.getElementById('btnSync');
btnSync.addEventListener('click', () => {
    btnSync.innerText = "CARREGANDO CHAKRA...";
    firebase.auth().signInWithRedirect(provider);
});

// 2. Captura do Resultado e Persistência
firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        const token = result.credential.accessToken;
        localStorage.setItem('google_token', token); // Salva para não pedir toda hora
        buscarContatos(token);
        ativarNotificacoes();
    } else if (firebase.auth().currentUser) {
        // Se já estiver logado, tenta recuperar o token salvo
        const savedToken = localStorage.getItem('google_token');
        if (savedToken) buscarContatos(savedToken);
    }
}).catch(error => {
    console.error("Erro no retorno:", error);
    alert("Falha na invocação! Verifique sua conexão.");
});

// 3. Busca de Contactos (API People) com tratamento de erro
async function buscarContatos(token) {
    try {
        const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,photos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const lista = document.getElementById('lista-contatos');
        lista.innerHTML = '';

        if (data.connections) {
            data.connections.forEach(c => {
                const nome = c.names ? c.names[0].displayName : "Shinobi";
                const foto = c.photos ? c.photos[0].url : "https://via.placeholder.com/40";
                
                const card = document.createElement('div');
                card.className = 'contato-card';
                card.innerHTML = `
                    <img src="${foto}" class="avatar-ninja" onerror="this.src='https://via.placeholder.com/40'">
                    <span>${nome}</span>
                `;
                lista.appendChild(card);
            });
        }
    } catch (err) {
        console.error("Erro ao buscar contatos:", err);
    }
}

// 4. Notificações e Firestore (Otimizado para não travar)
function ativarNotificacoes() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

// Listener de mensagens com "limpeza" de memória
const mensagensRef = firebase.firestore().collection("mensagens");
mensagensRef.orderBy("timestamp", "desc").limit(10) // Limitamos a 10 para não pesar no seu mobile
    .onSnapshot(snap => {
        const container = document.getElementById('mensagens-container');
        snap.docChanges().forEach(change => {
            if (change.type === "added") {
                const msg = change.doc.data();
                const userAtivo = firebase.auth().currentUser;

                // Evita notificar a própria mensagem
                if (userAtivo && msg.usuario !== userAtivo.displayName) {
                    if (Notification.permission === "granted") {
                        new Notification(`Mensagem de ${msg.usuario}`, { 
                            body: msg.texto,
                            icon: 'https://cdn-icons-png.flaticon.com/512/1183/1183672.png' // Ícone de Kunai/Ninja
                        });
                    }
                }
                
                // Adiciona no UI
                const p = document.createElement('p');
                p.style.borderLeft = "2px solid #ff9800";
                p.style.paddingLeft = "10px";
                p.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.texto}`;
                container.prepend(p);
            }
        });
    }, err => {
        document.getElementById('statusServer').innerText = "Offline";
        document.getElementById('statusServer').style.color = "red";
    });
