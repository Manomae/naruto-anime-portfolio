// --- ESTILOS NINJA (DESIGN DO SITE) ---
const style = document.createElement('style');
style.innerHTML = `
    body { background-color: #1a1a1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: white; margin: 0; padding: 0; }
    .container { display: flex; height: 100vh; }
    .sidebar { width: 300px; background-color: #252525; border-right: 2px solid #ff9800; padding: 20px; overflow-y: auto; }
    .chat-area { flex: 1; display: flex; flex-direction: column; background-image: url('https://i.imgur.com/your-konoha-bg.jpg'); background-size: cover; }
    .btn-sync { background-color: #ff9800; color: white; border: none; padding: 12px; width: 100%; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 20px; transition: 0.3s; }
    .btn-sync:hover { background-color: #e68900; transform: scale(1.02); }
    .contato-card { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #333; transition: 0.2s; }
    .contato-card:hover { background-color: #333; border-radius: 8px; }
    .avatar-ninja { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #ff9800; margin-right: 12px; }
    .nome-contato { font-size: 14px; font-weight: bold; }
    #mensagens-container { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; }
    .notificacao-popup { position: fixed; top: 20px; right: 20px; background: #ff9800; padding: 15px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); animation: slideIn 0.5s ease; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;
document.head.appendChild(style);

// --- ESTRUTURA DA INTERFACE ---
document.body.innerHTML = `
    <div class="container">
        <div class="sidebar">
            <h2 style="color: #ff9800; text-align: center;">Meu Shinobi</h2>
            <button class="btn-sync" onclick="sincronizarMeuShinobi()">Sincronizar Contatos 🍥</button>
            <div id="lista-contatos"></div>
        </div>
        <div class="chat-area">
            <div id="mensagens-container"></div>
            <div style="padding: 20px; background: #252525; display: flex;">
                <input type="text" id="msg-input" placeholder="Escreva sua mensagem ninja..." style="flex: 1; padding: 10px; border-radius: 5px; border: none;">
                <button onclick="enviarMensagem()" style="margin-left: 10px; background: #ff9800; border: none; padding: 10px 20px; color: white; border-radius: 5px; cursor: pointer;">Enviar</button>
            </div>
        </div>
    </div>
`;

// --- LÓGICA DE SINCRONIZAÇÃO E FIREBASE ---
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

async function sincronizarMeuShinobi() {
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const token = result.credential.accessToken;
        
        // Puxa a lista de contatos do Google
        const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,photos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        renderizarContatos(data.connections || []);
        
        // Ativa notificações
        Notification.requestPermission();
        
    } catch (error) {
        console.error(error);
        alert("Erro ao sincronizar! Clique em 'Avançado' no login do Google.");
    }
}

function renderizarContatos(contatos) {
    const lista = document.getElementById('lista-contatos');
    lista.innerHTML = '';
    contatos.forEach(c => {
        const nome = c.names ? c.names[0].displayName : "Shinobi";
        const foto = c.photos ? c.photos[0].url : "https://via.placeholder.com/45";
        lista.innerHTML += `
            <div class="contato-card">
                <img src="${foto}" class="avatar-ninja">
                <span class="nome-contato">${nome}</span>
            </div>
        `;
    });
}

function enviarMensagem() {
    const input = document.getElementById('msg-input');
    if(input.value.trim() === "") return;
    
    // Simulação de envio para o Firebase
    db.collection("mensagens").add({
        texto: input.value,
        usuario: firebase.auth().currentUser.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = "";
}

// --- ESCUTADOR DE MENSAGENS E NOTIFICAÇÕES ---
db.collection("mensagens").orderBy("timestamp", "desc").limit(1)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const msg = change.doc.data();
                if (msg.usuario !== firebase.auth().currentUser?.displayName) {
                    mostrarNotificacao(msg.usuario, msg.texto);
                }
                const msgBox = document.getElementById('mensagens-container');
                msgBox.innerHTML += `<p><strong>${msg.usuario}:</strong> ${msg.texto}</p>`;
                msgBox.scrollTop = msgBox.scrollHeight;
            }
        });
    });

function mostrarNotificacao(user, text) {
    if (Notification.permission === "granted") {
        new Notification(`Mensagem de ${user}`, { body: text });
    }
}
