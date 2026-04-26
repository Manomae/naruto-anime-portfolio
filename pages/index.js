<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHINOBI OS - INTERFACE ELITE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@300;700&display=swap');
        
        :root { --red-chakra: #ff0000; --blue-chakra: #00d9ff; --bg: #050507; }
        body { background: var(--bg); color: #fff; font-family: 'JetBrains Mono', monospace; overflow: hidden; }

        /* Interface Estilo Naruto Moderno */
        .shinobi-container { border: 2px solid #1a1a1a; background: rgba(10, 10, 15, 0.95); box-shadow: 0 0 40px rgba(0,0,0,1); }
        .hud-border { border-left: 4px solid var(--red-chakra); background: linear-gradient(90deg, rgba(255,0,0,0.1) 0%, transparent 100%); }
        
        video { width: 100%; height: 100%; object-fit: cover; border-radius: 2px; filter: grayscale(20%) contrast(110%); transform: scaleX(-1); }
        .video-slot { border: 1px solid #222; position: relative; overflow: hidden; height: 220px; }

        /* Botões Estilo Jutsu */
        .btn-jutsu { 
            background: #111; border: 1px solid var(--red-chakra); color: var(--red-chakra);
            font-family: 'Orbitron', sans-serif; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
        }
        .btn-jutsu:hover { background: var(--red-chakra); color: #fff; box-shadow: 0 0 20px var(--red-chakra); }

        /* Segredos e HUD */
        .scanline { width: 100%; height: 2px; background: rgba(255,0,0,0.1); position: absolute; animation: scan 4s linear infinite; z-index: 10; }
        @keyframes scan { from { top: 0; } to { top: 100%; } }

        .secret-panel { display: none; }
        .active-glow { animation: glow 1.5s infinite alternate; }
        @keyframes glow { from { text-shadow: 0 0 5px var(--red-chakra); } to { text-shadow: 0 0 15px var(--red-chakra); } }
        
        .chat-scroll::-webkit-scrollbar { width: 2px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: var(--red-chakra); }
    </style>
</head>
<body class="p-2 flex items-center justify-center min-h-screen">

    <div class="shinobi-container w-full max-w-5xl h-[95vh] flex flex-col relative overflow-hidden">
        <div class="scanline"></div>

        <header class="p-4 border-b border-white/5 flex justify-between items-end">
            <div>
                <h1 class="text-2xl font-black font-['Orbitron'] tracking-tighter text-white">SHINOBI<span class="text-red-600">_OS</span></h1>
                <p class="text-[9px] text-zinc-500 uppercase tracking-[4px]">Sistema de Invocação P2P Direct-Link</p>
            </div>
            <div class="text-right">
                <p class="text-[10px] text-zinc-500">SEU CÓDIGO DE TRANSMISSÃO:</p>
                <div id="myId" class="text-3xl font-black text-red-600 active-glow font-['Orbitron']">------</div>
            </div>
        </header>

        <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            
            <div class="lg:col-span-7 p-4 border-r border-white/5 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="video-slot">
                        <video id="localVideo" autoplay playsinline muted></video>
                        <div class="absolute top-2 left-2 text-[10px] bg-red-600 px-2">LOCAL_USER</div>
                    </div>
                    <div class="video-slot">
                        <video id="remoteVideo" autoplay playsinline></video>
                        <div class="absolute top-2 left-2 text-[10px] bg-blue-600 px-2">REMOTE_SHINOBI</div>
                    </div>
                </div>

                <div class="hud-border p-4 space-y-4">
                    <p class="text-[10px] text-red-500 font-bold uppercase underline">Invocação por Código</p>
                    <div class="flex gap-2">
                        <input id="targetId" type="text" maxlength="6" placeholder="DIGITE O ID ALVO..." 
                            class="bg-transparent border-b border-zinc-800 flex-1 p-2 outline-none text-red-500 font-bold text-xl placeholder:text-zinc-800">
                        <button onclick="callContact()" class="btn-jutsu px-10 py-2 font-bold uppercase italic">Invocar</button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-5 flex flex-col bg-black/20 p-4">
                <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <span class="text-[10px] text-zinc-400 font-bold italic underline">PERGAMINHOS DE TEXTO</span>
                    <button onclick="toggleSecrets()" class="text-[10px] text-red-900 hover:text-red-600">FUNÇÕES_OCULTAS</button>
                </div>

                <div id="chat" class="flex-1 overflow-y-auto chat-scroll space-y-3 mb-4 pr-2">
                    <div class="text-[10px] text-zinc-600 uppercase tracking-widest">// Aguardando sinal de Chakra...</div>
                </div>

                <div class="space-y-4">
                    <div id="secrets" class="flex justify-around bg-red-900/10 p-2 rounded secret-panel border border-red-900/30">
                        <button onclick="sendEmoji('🔥')" class="hover:scale-125 transition">🔥</button>
                        <button onclick="sendEmoji('⚡')" class="hover:scale-125 transition">⚡</button>
                        <button onclick="sendEmoji('🌀')" class="hover:scale-125 transition">🌀</button>
                        <button onclick="document.getElementById('fileInput').click()" title="Enviar Arquivo">📂</button>
                        <input type="file" id="fileInput" class="hidden" onchange="sendFile(this)">
                    </div>

                    <div class="flex items-center gap-3">
                        <button id="micBtn" onmousedown="startAudio()" onmouseup="stopAudio()" class="text-xl opacity-40 hover:opacity-100 transition">🎙️</button>
                        <input id="msgInput" type="text" placeholder="Escrever pergaminho..." 
                            class="bg-transparent flex-1 border-b border-zinc-800 p-2 outline-none text-sm focus:border-red-600 transition-all">
                        <button onclick="sendChat()" class="text-red-600 text-sm font-black uppercase">Send</button>
                    </div>
                </div>
            </div>
        </main>

        <footer class="p-2 bg-red-600 text-black flex justify-between px-4">
            <span class="text-[9px] font-bold">ALERTA: CONEXÃO P2P MONITORADA PELO CLÃ</span>
            <span id="connection-status" class="text-[9px] font-bold uppercase italic">Offline</span>
        </footer>
    </div>

    <script>
        // --- COLOQUE SUAS CHAVES AQUI ---
        const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            projectId: "SEU_PROJECT_ID",
            appId: "SEU_APP_ID"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };
        let localStream, peerConnection, dataChannel;
        
        // LÓGICA DE ID SIMPLES (6 DÍGITOS)
        const myId = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('myId').innerText = myId;

        // 1. INICIAR CÂMERA E ESCUTAR CHAMADAS
        async function init() {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = localStream;

            // SISTEMA DE ALERTA (Escutando o Firebase)
            db.collection('calls').doc(myId).onSnapshot(async snap => {
                const data = snap.data();
                if (data?.offer && !peerConnection) {
                    if (confirm("🚨 INVOCADOR DETECTADO! Aceitar chamada?")) {
                        await answerCall(data.offer);
                    }
                }
            });

            // Escutar Candidatos ICE (O segredo da conexão)
            db.collection('calls').doc(myId).collection('candidates').onSnapshot(snap => {
                snap.docChanges().forEach(change => {
                    if (change.type === 'added' && peerConnection) {
                        peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                    }
                });
            });
        }

        async function setupPeer(target) {
            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            
            peerConnection.ontrack = e => document.getElementById('remoteVideo').srcObject = e.streams[0];
            
            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    db.collection('calls').doc(target).collection('candidates').add(e.candidate.toJSON());
                }
            };

            peerConnection.onconnectionstatechange = () => {
                document.getElementById('connection-status').innerText = peerConnection.connectionState;
            };

            // DATA CHANNEL (Chat rápido e privado)
            dataChannel = peerConnection.createDataChannel("shinobiData");
            dataChannel.onmessage = e => handleIncomingData(JSON.parse(e.data));
            
            peerConnection.ondatachannel = e => {
                dataChannel = e.channel;
                dataChannel.onmessage = ev => handleIncomingData(JSON.parse(ev.data));
            };
        }

        async function callContact() {
            const target = document.getElementById('targetId').value;
            if(!target) return alert("Digite o ID alvo!");
            
            await setupPeer(target);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await db.collection('calls').doc(target).set({ offer });

            db.collection('calls').doc(target).onSnapshot(snap => {
                const data = snap.data();
                if (data?.answer) peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            });
        }

        async function answerCall(offer) {
            const target = document.getElementById('targetId').value || "caller"; 
            await setupPeer(target);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await db.collection('calls').doc(myId).update({ answer });
        }

        // FUNÇÕES DE INTERFACE
        function sendChat() {
            const val = document.getElementById('msgInput').value;
            if(!val || !dataChannel) return;
            const payload = { sender: 'VOCÊ', msg: val };
            dataChannel.send(JSON.stringify(payload));
            displayMsg('VOCÊ', val, 'text-red-600');
            document.getElementById('msgInput').value = "";
        }

        function handleIncomingData(data) {
            displayMsg('CONTATO', data.msg, 'text-blue-400');
        }

        function displayMsg(user, msg, color) {
            const chat = document.getElementById('chat');
            chat.innerHTML += `<div class="bg-white/5 p-2 rounded"><span class="${color} font-bold text-[10px]">${user}:</span> <span class="text-xs">${msg}</span></div>`;
            chat.scrollTop = chat.scrollHeight;
        }

        function sendEmoji(e) { if(dataChannel) { dataChannel.send(JSON.stringify({sender:'VOCÊ', msg:e})); displayMsg('VOCÊ', e, 'text-red-600'); } }
        function toggleSecrets() { const s = document.getElementById('secrets'); s.style.display = s.style.display === 'flex' ? 'none' : 'flex'; }
        
        function startAudio() { document.getElementById('micBtn').classList.add('text-red-600'); }
        function stopAudio() { document.getElementById('micBtn').classList.remove('text-red-600'); }

        init();
    </script>
</body>
</html>
