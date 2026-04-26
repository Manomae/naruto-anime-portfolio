<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHINOBI SYSTEM OS - v4.0 ELITE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@300;700&display=swap');
        
        :root { --red-chakra: #ff0000; --bg: #030305; }
        body { background: var(--bg); color: #fff; font-family: 'JetBrains Mono', monospace; overflow: hidden; }

        /* Estética Shinobi Moderna */
        .hud-main { border: 1px solid #1a1a1a; background: linear-gradient(135deg, #0a0a0c 0%, #050507 100%); position: relative; }
        .red-line { border-left: 3px solid var(--red-chakra); background: rgba(255, 0, 0, 0.05); }
        
        video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); border: 1px solid #111; }
        .video-box { position: relative; height: 250px; border: 1px solid #222; }

        /* Botões Estilo JUTSU */
        .jutsu-trigger { 
            background: transparent; border: 1px solid var(--red-chakra); color: var(--red-chakra);
            font-family: 'Orbitron', sans-serif; text-transform: uppercase; font-weight: 900;
            transition: all 0.4s ease; clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
        }
        .jutsu-trigger:hover { background: var(--red-chakra); color: white; box-shadow: 0 0 25px var(--red-chakra); cursor: pointer; }

        /* Efeitos de Interface (Segredos) */
        .scan-effect { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none; }
        .glitch-text { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.8; } 50% { opacity: 1; text-shadow: 0 0 10px var(--red-chakra); } 100% { opacity: 0.8; } }

        .secret-functions { display: none; }
        .chat-area::-webkit-scrollbar { width: 3px; }
        .chat-area::-webkit-scrollbar-thumb { background: var(--red-chakra); }
    </style>
</head>
<body class="p-2 md:p-6 min-h-screen flex items-center justify-center">

    <div class="hud-main w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative">
        <div class="scan-effect"></div>

        <header class="p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center z-10">
            <div>
                <h1 class="text-2xl font-black font-['Orbitron'] tracking-tighter glitch-text">SHINOBI<span class="text-red-600">_INTERFACE</span></h1>
                <p class="text-[8px] text-zinc-600 tracking-[5px] uppercase italic">P2P Network Core / Security Level: ANBU</p>
            </div>
            <div class="text-center md:text-right mt-2 md:mt-0">
                <p class="text-[10px] text-zinc-500 font-bold uppercase">Código de Invocação Atual:</p>
                <div id="myId" class="text-4xl font-black text-red-600 font-['Orbitron']">------</div>
            </div>
        </header>

        <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10">
            
            <div class="lg:col-span-8 p-4 space-y-4 border-r border-white/5 bg-black/20 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="video-box">
                        <video id="localVideo" autoplay playsinline muted></video>
                        <div class="absolute bottom-2 left-2 bg-red-600 px-2 text-[9px] font-bold">MEU_CHAKRA</div>
                    </div>
                    <div class="video-box">
                        <video id="remoteVideo" autoplay playsinline></video>
                        <div class="absolute bottom-2 left-2 bg-blue-600 px-2 text-[9px] font-bold">ALVO_DETECTADO</div>
                    </div>
                </div>

                <div class="red-line p-6 mt-4">
                    <h2 class="text-xs font-bold text-red-500 mb-4 tracking-widest italic underline">REALIZAR INVOCAÇÃO DIRETA</h2>
                    <div class="flex flex-col md:flex-row gap-4">
                        <input id="targetId" type="text" maxlength="6" placeholder="DIGITE O ID DE 6 DÍGITOS..." 
                            class="bg-black/80 border border-zinc-800 p-4 flex-1 outline-none text-red-600 font-bold text-2xl font-['Orbitron'] placeholder:text-zinc-900 focus:border-red-600 transition-all">
                        <button onclick="callContact()" class="jutsu-trigger px-12 py-4">Invocar</button>
                    </div>
                    <p class="text-[9px] text-zinc-600 mt-2 font-bold italic">// Insira o código do outro Shinobi para abrir o túnel P2P.</p>
                </div>
            </div>

            <div class="lg:col-span-4 flex flex-col p-4 bg-black/40">
                <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <span class="text-[10px] text-red-600 font-black italic tracking-widest">TRANSMISSÃO_PERGAMINHOS</span>
                    <button onclick="toggleSecrets()" class="text-[10px] text-zinc-600 hover:text-white transition">SECRET_OPPS</button>
                </div>

                <div id="chat" class="flex-1 overflow-y-auto chat-area space-y-3 mb-4 pr-2 font-['JetBrains_Mono'] text-sm">
                    <div class="text-zinc-700 text-[10px] italic">// Sistema aguardando handshake...</div>
                </div>

                <div class="space-y-4">
                    <div id="secretsPanel" class="flex justify-around bg-red-900/5 p-3 rounded secret-functions border border-red-900/20">
                        <button onclick="sendEmoji('🔥')" class="text-xl hover:scale-125 transition">🔥</button>
                        <button onclick="sendEmoji('⚡')" class="text-xl hover:scale-125 transition">⚡</button>
                        <button onclick="sendEmoji('🌀')" class="text-xl hover:scale-125 transition">🌀</button>
                        <button onclick="document.getElementById('fileInput').click()" class="text-xl hover:scale-125 transition">📜</button>
                        <input type="file" id="fileInput" class="hidden" onchange="alert('Arquivo selado para envio...')">
                    </div>

                    <div class="flex items-center gap-2 border-t border-white/5 pt-4">
                        <button id="micIcon" class="text-xl opacity-30 hover:opacity-100 transition">🎙️</button>
                        <input id="msgInput" type="text" placeholder="Escreva aqui..." 
                            class="bg-transparent flex-1 border-b border-zinc-800 p-2 outline-none text-sm focus:border-red-600 transition-all">
                        <button onclick="sendChat()" class="text-red-600 font-black hover:text-white transition">ENVIAR</button>
                    </div>
                </div>
            </div>
        </main>

        <footer class="p-2 bg-red-600 flex justify-between px-6 z-10">
            <span class="text-[8px] font-bold text-black uppercase tracking-widest">P2P Secure Link: ACTIVE</span>
            <span id="connStatus" class="text-[8px] font-bold text-black uppercase italic">Status: Standby</span>
        </footer>
    </div>

    <script>
        // --- COLOQUE SUAS CHAVES DO FIREBASE AQUI ---
        const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            projectId: "SEU_PROJECT_ID",
            appId: "SEU_APP_ID"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };
        let localStream, peerConnection, dataChannel;
        
        // Lógica de ID de 6 dígitos que você pediu
        const myId = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('myId').innerText = myId;

        async function init() {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                document.getElementById('localVideo').srcObject = localStream;

                // SISTEMA DE ALERTA: Quando alguém te liga
                db.collection('calls').doc(myId).onSnapshot(async snap => {
                    const data = snap.data();
                    if (data?.offer && !peerConnection) {
                        // O alerta que você pediu para aceitar a chamada
                        if (confirm("🚨 INVOCADOR DETECTADO (ID: " + data.from + ")! Aceitar transmissão?")) {
                            await answerCall(data.offer, data.from);
                        }
                    }
                });

                // Lógica de Candidatos (ICE) para conexão atravessar qualquer "buraco"
                db.collection('calls').doc(myId).collection('candidates').onSnapshot(snap => {
                    snap.docChanges().forEach(change => {
                        if (change.type === 'added' && peerConnection) {
                            peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                        }
                    });
                });
            } catch (e) { alert("Erro ao acessar câmera: " + e); }
        }

        async function setupPeer(target) {
            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            
            peerConnection.ontrack = e => document.getElementById('remoteVideo').srcObject = e.streams[0];
            
            // Enviando candidatos ICE para o outro lado
            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    db.collection('calls').doc(target).collection('candidates').add(e.candidate.toJSON());
                }
            };

            peerConnection.onconnectionstatechange = () => {
                document.getElementById('connStatus').innerText = "Status: " + peerConnection.connectionState;
            };

            // DATA CHANNEL: Chat e Emojis P2P direto
            dataChannel = peerConnection.createDataChannel("shinobiChat");
            setupDataHandlers(dataChannel);
            
            peerConnection.ondatachannel = e => setupDataHandlers(e.channel);
        }

        function setupDataHandlers(channel) {
            channel.onmessage = e => {
                const data = JSON.parse(e.data);
                displayMsg('CONTATO', data.msg, 'text-blue-400');
            };
        }

        // FUNÇÃO PARA INVOCAR (BOTÃO)
        async function callContact() {
            const target = document.getElementById('targetId').value;
            if(target.length < 6) return alert("ID Inválido!");
            
            await setupPeer(target);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            // Salva a oferta e avisa quem está ligando
            await db.collection('calls').doc(target).set({ offer, from: myId });

            db.collection('calls').doc(target).onSnapshot(snap => {
                const data = snap.data();
                if (data?.answer) peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            });
        }

        async function answerCall(offer, callerId) {
            await setupPeer(callerId);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await db.collection('calls').doc(callerId).update({ answer });
        }

        // CHAT E UI
        function sendChat() {
            const input = document.getElementById('msgInput');
            if(!input.value || !dataChannel) return;
            dataChannel.send(JSON.stringify({msg: input.value}));
            displayMsg('VOCÊ', input.value, 'text-red-600');
            input.value = "";
        }

        function sendEmoji(e) { 
            if(dataChannel) {
                dataChannel.send(JSON.stringify({msg: e}));
                displayMsg('VOCÊ', e, 'text-red-600');
            }
        }

        function displayMsg(user, msg, color) {
