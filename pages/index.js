// --- 1. CONFIGURAÇÃO DO FIREBASE E GOOGLE ---
const provider = new firebase.auth.GoogleAuthProvider();

// O "Jutsu" que permite ver a sua penca de contatos
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// --- 2. FUNÇÃO PRINCIPAL DE SINCRONIZAÇÃO (BOTÃO) ---
async function sincronizarMeuShinobi() {
    try {
        // Abre a janelinha do Google
        const result = await firebase.auth().signInWithPopup(provider);
        const token = result.credential.accessToken;
        const user = result.user;

        console.log("Ninja logado:", user.displayName);

        // Puxa a sua agenda do Google automaticamente
        buscarAgendaGoogle(token);

        // Ativa as janelinhas de notificação no navegador
        solicitarPermissaoNotificacao();

    } catch (error) {
        console.error("Erro na missão:", error);
        alert("Ei! Lembre-se de clicar em 'Avançado' e 'Ir para ShinobiSync' para liberar seus contatos.");
    }
}

// --- 3. BUSCAR A LISTA DE CONTATOS (PEOPLE API) ---
function buscarAgendaGoogle(token) {
    // Chama a API que você ativou no Google Cloud
    fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,photos,phoneNumbers', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const contatos = data.connections || [];
        renderizarContatosNoChat(contatos);
    })
    .catch(err => console.error("Erro ao invocar contatos:", err));
}

// --- 4. RENDERIZAR NO SEU DESIGN ---
function renderizarContatosNoChat(contatos) {
    const listaHtml = document.getElementById('lista-contatos'); // Certifique-se que seu HTML tem esse ID
    if (!listaHtml) return;

    listaHtml.innerHTML = ''; // Limpa a lista antiga

    contatos.forEach(contato => {
        const nome = contato.names ? contato.names[0].displayName : "Shinobi Oculto";
        const foto = contato.photos ? contato.photos[0].url : "https://via.placeholder.com/50";
        
        // Aqui montamos o item com o seu estilo visual
        const item = `
            <div class="contato-card" style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                <img src="${foto}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid #ff9800; margin-right: 10px;">
                <span style="color: white; font-weight: bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${nome}</span>
            </div>
        `;
        listaHtml.innerHTML += item;
    });
}

// --- 5. SISTEMA DE JANELINHAS DE NOTIFICAÇÃO ---
function solicitarPermissaoNotificacao() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Jutsu de Notificação ativado!");
            }
        });
    }
}

// Função para disparar a janelinha quando chegar mensagem
function mostrarNotificacaoNinja(nomeRemetente, mensagemCorpo) {
    if (Notification.permission === "granted") {
        new Notification(`Nova mensagem de: ${nomeRemetente}`, {
            body: mensagemCorpo,
            icon: 'https://cdn-icons-png.flaticon.com/512/1088/1088537.png' // Ícone de Shuriken/Naruto
        });
    }
}

// --- 6. INTEGRAÇÃO COM FIREBASE (ESCUTAR MENSAGENS) ---
// Supondo que você usa Firestore para as mensagens
db.collection("mensagens").orderBy("timestamp", "desc").limit(1)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const msg = change.doc.data();
                // Só mostra a janelinha se não for você mesmo que enviou
                if (msg.usuario !== firebase.auth().currentUser.displayName) {
                    mostrarNotificacaoNinja(msg.usuario, msg.texto);
                }
            }
        });
    });
