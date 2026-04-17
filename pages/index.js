// --- ESTILOS (PARA MANTER O TEU DESIGN) ---
const style = document.createElement('style');
style.innerHTML = `
    body { background-color: #000; font-family: 'Segoe UI', sans-serif; color: #ff9800; margin: 0; }
    .container { display: flex; height: 100vh; }
    .sidebar { width: 280px; background: #111; border-right: 1px solid #333; padding: 15px; overflow-y: auto; }
    .contato-card { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #222; }
    .avatar-ninja { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ff9800; margin-right: 10px; }
    .btn-sync { background: #ff9800; color: black; border: none; padding: 10px; width: 100%; border-radius: 5px; font-weight: bold; cursor: pointer; margin-bottom: 20px; }
`;
document.head.appendChild(style);

// --- INTERFACE ---
document.body.innerHTML = `
    <div class="container">
        <div class="sidebar">
            <button class="btn-sync" id="btnSync">Sincronizar Google 🍥</button>
            <div id="lista-contatos"></div>
        </div>
        <div id="chat" style="flex:1; padding:20px;">
            <h2>Servidor: Conectado</h2>
            <div id="mensagens-container"></div>
        </div>
    </div>
`;

// --- LÓGICA NINJA ATUALIZADA ---
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// 1. O segredo para não travar no telemóvel: USAR REDIRECT
document.getElementById('btnSync').addEventListener('click', () => {
    firebase.auth().signInWithRedirect(provider);
});

// 2. Capturar o resultado quando o site volta do Google
firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        const token = result.credential.accessToken;
        buscarContatos(token);
        ativarNotificacoes();
    }
}).catch(error => console.error("Erro no retorno:", error));

// 3. Buscar a tua "penca" de contactos
function buscarContatos(token) {
    fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,photos', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-contatos');
        lista.innerHTML = '';
        if (data.connections) {
            data.connections.forEach(c => {
                const nome = c.names ? c.names[0].displayName : "Shinobi";
                const foto = c.photos ? c.photos[0].url : "";
                lista.innerHTML += `
                    <div class="contato-card">
                        <img src="${foto}" class="avatar-ninja">
                        <span>${nome}</span>
                    </div>`;
            });
        }
    });
}

// 4. Janelinhas de Notificação
function ativarNotificacoes() {
    Notification.requestPermission();
}

// Escutador do Firebase (Ajusta o nome da tua coleção se for diferente)
firebase.firestore().collection("mensagens").orderBy("timestamp", "desc").limit(1)
    .onSnapshot(snap => {
        snap.docChanges().forEach(change => {
            if (change.type === "added") {
                const msg = change.doc.data();
                if (msg.usuario !== firebase.auth().currentUser?.displayName) {
                    new Notification(`Mensagem de ${msg.usuario}`, { body: msg.texto });
                }
            }
        });
    });
