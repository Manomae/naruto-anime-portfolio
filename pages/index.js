<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHINOBI CONNECT - ELITE INTERFACE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Ninja+Naruto&family=Orbitron:wght@400;900&family=Permanent+Marker&display=swap');

        :root { 
            --naruto-orange: #ff9a00; 
            --uchiha-red: #cc0000; 
            --leaf-green: #466b52;
            --dark-scroll: #1a1a1d;
        }

        body { 
            background: radial-gradient(circle, #1a1a1d 0%, #000000 100%); 
            color: #fff; 
            font-family: 'Orbitron', sans-serif;
            overflow: hidden;
            height: 100vh;
        }

        /* Moldura Estilo Pergaminho Tecnológico */
        .shinobi-terminal {
            border: 4px solid var(--naruto-orange);
            background: rgba(0, 0, 0, 0.85);
            box-shadow: 0 0 20px var(--naruto-orange), inset 0 0 50px rgba(255, 154, 0, 0.1);
            position: relative;
        }

        .video-container {
            border: 2px solid var(--leaf-green);
            background: #000;
            position: relative;
            box-shadow: 0 0 10px var(--leaf-green);
        }

        video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }

        /* Botões Estilo Selo de Mão */
        .btn-jutsu {
            background: var(--uchiha-red);
            color: white;
            font-family: 'Permanent Marker', cursive;
            padding: 10px 25px;
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
            transition: 0.3s;
            border: none;
            cursor: pointer;
        }
        .btn-jutsu:hover { 
            background: var(--naruto-orange); 
            transform: scale(1.1) rotate(-2deg);
            box-shadow: 0 0 20px var(--naruto-orange);
        }

        /* Efeitos Visuais de Naruto */
        .sharingan-eye {
            position: absolute; top: 10px; right: 10px; width: 40px; height: 40px;
            background: url('https://cdn-icons-png.flaticon.com/512/388/388531.png') no-repeat center;
            background-size: contain; animation: spin 5s linear infinite; opacity: 0.6;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .chat-area {
            background: url('https://www.transparenttextures.com/patterns/dark-matter.png');
            scrollbar-width: thin;
            scrollbar-color: var(--naruto-orange) transparent;
        }

        .input-shinobi {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--leaf-green);
            color: var(--naruto-orange);
            padding: 12px;
            font-family: monospace;
        }

        .secret-menu { display: none; }
    </style>
</head>
<body class="p-4 flex items-center justify-center">

    <div class="shinobi-terminal w-full max-w-6xl h-[90vh] flex flex-col p-4 rounded-lg">
        <div class="sharingan-eye"></div>

        <header class="flex justify-between items-start mb-6 border-b-2 border-orange-500/30 pb-4">
            <div>
                <h1 style="font-family: 'Permanent Marker';" class="text-4xl text-orange-500 tracking-widest">KONOHA_NET</h1>
                <p class="text-[10px] text-green-500 font-bold tracking-[3px]">SISTEMA DE COMUNICAÇÃO DE ELITE v2026</p>
            </div>
            <div class="text-right">
                <span class="text-[10px] text-gray-500 uppercase">Frequência de Invocação:</span>
                <div id="myId" class="text-4xl font-black text-red-600 drop-shadow-[0_0_5px_red]">------</div>
            </div>
        </header>

        <main class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            
            <div class="lg:col-span-2 space-y-4">
                <div class="grid grid-cols-2 gap-4 h-64 md:h-80">
                    <div class="video-container rounded-tl-[30px]">
                        <video id="localVideo" autoplay playsinline muted></video>
                        <div class="absolute top-0 left-4 bg-orange-600 px-3 text-[10px] font-bold">MEU_JUTSU</div>
                    </div>
                    <div class="video-container rounded-br-[30px]">
                        <video id="remoteVideo" autoplay playsinline></video>
                        <div class="absolute top-0 left-4 bg-red-600 px-3 text-[10px] font-bold">ALVO_DETECTADO</div>
                    </div>
                </div>

                <div class="p-6 bg-white/5 border-l-4 border-orange-500">
                    <label class="text-[10px] text-orange-400 block mb-2 font-bold">DIGITE O ID DO SHINOBI ALVO:</label>
                    <div class="flex gap-4">
                        <input id="targetId" type="text" maxlength="6" placeholder="000000" 
                               class="input-shinobi flex-1 text-3xl font-bold tracking-[10px] text-center focus:border-orange-500 outline-none">
                        <button onclick="callContact()" class="btn-jutsu text-xl">INVOCAR</button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col bg-black/40 border-l border-white/10 p-4 relative">
                <h3 class="text-xs font-bold text-orange-500 mb-4 italic underline">PERGAMINHO DE MENSAGENS</h3>
                
                <div id="chat" class="flex-1 overflow-y-auto chat-area space-y-3 mb-4 pr-2 text-sm font-mono text-green-400">
                    <div>// Estabelecendo rede de Chakra...</div>
                </div>

                <div class="space-y-4">
                    <div id="secretFunctions" class="secret-menu grid grid-cols-4 gap-2 py-2 bg-orange-500/10 rounded">
                        <button onclick="sendEmoji('🌀')" class="text-2xl hover:scale-125 transition">🌀</button>
                        <button onclick="sendEmoji('🔥')" class="text-2xl hover:scale-125 transition">🔥</button>
                        <button onclick="sendEmoji('⚡')" class="text-2xl hover:scale-125 transition">⚡</button>
                        <button onclick="document.getElementById('fileInput').click()" class="text-2xl">📜</button>
                        <input type="file" id="fileInput" class="hidden" onchange="alert('Arquivo selado para envio!')">
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="toggleSecrets()" class="p-2 border border-orange-500/50 rounded hover:bg-orange-500/20">☸️</button>
                        <button id="micBtn" onmousedown="startRec()" onmouseup="stopRec()" class="text-xl">🎙️</button>
                        <input id="msgInput" type="text" placeholder="Escreva um jutsu..." 
                               class="bg-transparent border-b border-orange-500/30 flex-1 p-2 outline-none text-xs focus:border-orange-500">
                        <button onclick="sendChat()" class="font-bold text-orange-500 hover:text-white">ENVIAR</button>
                    </div>
                </div>
            </div>
        </main>

        <footer class="mt-4 pt-2 border-t border-white/5 flex justify-between text-[9px] font-bold tracking-widest text-gray-500">
            <span>MODO: P2P_DIRECT_CONNECTION</span>
            <span id="status">STATUS: AGUARDANDO_CHAKRA</span>
            <span>KONOHA_ENCRYPTION_v4</span>
        </footer>
    </div>

    <script id="index-js">
        // --- CONFIGURAÇÃO FIREBASE ---
        const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            projectId: "SEU_PROJECT_ID",
            appId: "SEU_APP_ID"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };
        let localStream, peerConnection, dataChannel;

        // LÓGICA DE ID DE 6 DÍGITOS
        const myId = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('myId').innerText = myId;

        async function init() {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = localStream;

            // SISTEMA DE ALERTA: Receber Chamada
            db.collection('calls').doc(myId).onSnapshot(async snap => {
                const data = snap.data();
                if (data?.offer && !peerConnection) {
                    if (confirm("🚨 INVOCADOR DETECTADO (ID: " + data.from + ")! Aceitar o chamado de Konoha?")) {
                        await answerCall(data.offer, data.from);
                    }
                }
            });

            // LÓGICA DE CANDIDATOS (ICE)
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
                document.getElementById('status').innerText = "STATUS: " + peerConnection.connectionState.toUpperCase();
            };

            dataChannel = peerConnection.createDataChannel("shinobiChat");
            setupDataHandlers(dataChannel);
            peerConnection.ondatachannel = e => setupDataHandlers(e.channel);
        }

        function setupDataHandlers(channel) {
            channel.onmessage = e => {
                const data = JSON.parse(e.data);
                addMessage('CONTATO', data.msg, 'text-blue-400');
            };
        }

        // COMANDOS DE LIGAÇÃO
        async function callContact() {
            const target = document.getElementById('targetId').value;
            if(target.length < 6) return alert("ID Inválido!");
            await setupPeer(target);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
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
            const msg = document.getElementById('msgInput').value;
            if(!msg || !dataChannel) return;
            dataChannel.send(JSON.stringify({msg}));
            addMessage('VOCÊ', msg, 'text-orange-500');
            document.getElementById('msgInput').value = "";
        }

        function sendEmoji(e) { if(dataChannel) { dataChannel.send(JSON.stringify({msg:e})); addMessage('VOCÊ', e, 'text-orange-500'); } }

        function addMessage(user, msg, color) {
            const chat = document.getElementById('chat');
            chat.innerHTML += `<div><span class="${color} font-bold">[${user}]:</span> ${msg}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }

        function toggleSecrets() {
            const menu = document.getElementById('secretFunctions');
            menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
        }

        function startRec() { document.getElementById('micBtn').style.color = 'red'; }
        function stopRec() { document.getElementById('micBtn').style.color = 'white'; }

        init();
    </script>
</body>
</html>
