<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHINOBI SYSTEM - OS INTERFACE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono&display=swap');
        
        :root { --chakra: #ff3131; --bg-dark: #08080a; --panel: #121217; }
        body { background: var(--bg-dark); color: #e0e0e0; font-family: 'JetBrains Mono', monospace; overflow-x: hidden; }
        
        .shinobi-panel { 
            background: var(--panel); 
            border: 1px solid rgba(255, 49, 49, 0.3);
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            position: relative;
        }
        
        .chakra-glow { box-shadow: 0 0 10px var(--chakra); }
        .text-chakra { color: var(--chakra); text-shadow: 0 0 5px var(--chakra); }
        
        video { 
            width: 100%; height: 100%; border-radius: 4px; object-fit: cover;
            background: #000; border: 1px solid #333; transform: scaleX(-1);
        }
        
        .jutsu-btn {
            background: linear-gradient(45deg, #1a1a20, #252530);
            border-left: 3px solid var(--chakra);
            transition: all 0.3s;
        }
        .jutsu-btn:hover { background: var(--chakra); color: white; transform: translateX(5px); }
        
        .scroll-ninja::-webkit-scrollbar { width: 4px; }
        .scroll-ninja::-webkit-scrollbar-thumb { background: var(--chakra); border-radius: 10px; }
        
        /* Overlay de segredo estilo Naruto */
        .sharingan-bg {
            position: absolute; top: -20px; right: -20px; opacity: 0.05;
            font-size: 150px; pointer-events: none;
        }
    </style>
</head>
<body class="p-2 md:p-6 min-h-screen">

    <div class="max-w-5xl mx-auto flex flex-col gap-4">
        
        <header class="shinobi-panel p-4 flex justify-between items-center overflow-hidden">
            <div class="sharingan-bg">❂</div>
            <div>
                <h1 class="text-xl font-bold tracking-widest font-['Orbitron'] text-chakra">SHINOBI_OS v4.0</h1>
                <p class="text-[10px] text-gray-500">CONEXÃO CRIPTOGRAFADA VIA SELO DE MÃO</p>
            </div>
            <div class="text-right">
                <div class="text-[10px] text-gray-400">SEU ID DE INVOCAÇÃO</div>
                <div id="myId" class="text-2xl font-bold text-white tracking-tighter">------</div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            <div class="lg:col-span-2 space-y-4">
                <div class="grid grid-cols-2 gap-2 h-[300px] md:h-[400px]">
                    <div class="shinobi-panel p-1 relative">
                        <video id="localVideo" autoplay playsinline muted></video>
                        <div class="absolute bottom-2 left-2 bg-black/70 px-2 text-[10px] border-l-2 border-red-600">VOCÊ</div>
                    </div>
                    <div class="shinobi-panel p-1 relative">
                        <video id="remoteVideo" autoplay playsinline></video>
                        <div class="absolute bottom-2 left-2 bg-black/70 px-2 text-[10px] border-l-2 border-blue-600">CONTATO</div>
                    </div>
                </div>

                <div class="shinobi-panel p-4 flex flex-col md:flex-row gap-3">
                    <input id="targetId" type="text" placeholder="INSIRA ID DO ALVO..." 
                        class="bg-black/50 border border-zinc-800 p-3 flex-1 outline-none focus:border-red-600 text-chakra font-bold">
                    <button onclick="callContact()" class="jutsu-btn px-8 py-3 text-sm font-bold uppercase">Invocar Agora</button>
                </div>
            </div>

            <div class="flex flex-col h-[500px] lg:h-auto">
                <div class="shinobi-panel flex-1 flex flex-col p-4">
                    <h3 class="text-xs font-bold mb-2 border-b border-zinc-800 pb-1 text-gray-400 italic">TRANSMISSÃO DE PERGAMINHOS</h3>
                    
                    <div id="chat" class="flex-1 overflow-y-auto scroll-ninja space-y-2 mb-4 text-[13px]">
                        <div class="text-zinc-600">// Aguardando estabelecimento de chakra...</div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex gap-2 text-xl">
                            <button onclick="triggerFile()" title="Enviar Pergaminho" class="hover:text-chakra">📜</button>
                            <button onclick="startAudio()" title="Mensagem de Voz" class="hover:text-chakra">🎙️</button>
                            <button onclick="sendEmoji('🔥')" class="hover:scale-125 transition">🔥</button>
                            <button onclick="sendEmoji('⚡')" class="hover:scale-125 transition">⚡</button>
                        </div>
                        <div class="flex border-t border-zinc-800 pt-3 gap-2">
                            <input id="msgInput" type="text" placeholder="Mensagem..." class="bg-transparent flex-1 outline-none text-sm">
                            <button onclick="sendChat()" class="text-chakra font-bold">ENVIAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <input type="file" id="fileInput" class="hidden" onchange="handleFile(this)">

    <script>
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
        const myId = Math.floor(100000 + Math.random() * 900000).toString();
        document.getElementById('myId').innerText = myId;

        // INICIAR SISTEMA
        async function init() {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = localStream;

            // Ouvir chamadas
            db.collection('calls').doc(myId).onSnapshot(snap => {
                const data = snap.data();
                if (data?.offer && !peerConnection) {
                    if (confirm("Alvo detectado! Iniciar recepção de chakra?")) answerCall(data.offer);
                }
            });
        }

        async function setupPeer(target) {
            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            
            peerConnection.ontrack = e => document.getElementById('remoteVideo').srcObject = e.streams[0];
            
            // Lógica de Candidatos (ICE) - Essencial para conectar redes diferentes
            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    db.collection('calls').doc(target).collection('candidates').add(e.candidate.toJSON());
                }
            };

            // Canal de Dados para Chat/Arquivos/Emojis
            dataChannel = peerConnection.createDataChannel("shinobiData");
            setupDataChannel();
        }

        function setupDataChannel() {
            dataChannel.onopen = () => addLog("SISTEMA", "CANAL DE CHAKRA ESTÁVEL");
            dataChannel.onmessage = e => {
                const data = JSON.parse(e.data);
                addMessage(data.sender, data.msg, data.type);
            };
        }

        // FUNÇÕES DE LIGAÇÃO
        async function callContact() {
            const target = document.getElementById('targetId').value;
            if(!target) return alert("Defina o ID do Alvo!");
            
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
            const target = document.getElementById('targetId').value || "remoto"; 
            await setupPeer(target);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await db.collection('calls').doc(myId).update({ answer });
        }

        // INTERFACE E MENSAGENS
        function sendChat() {
            const input = document.getElementById('msgInput');
            if(!input.value || !dataChannel) return;
            const payload = { sender: 'VOCÊ', msg: input.value, type: 'text' };
            dataChannel.send(JSON.stringify(payload));
            addMessage('VOCÊ', input.value);
            input.value = "";
        }

        function sendEmoji(emoji) {
            if(dataChannel) {
                const payload = { sender: 'VOCÊ', msg: emoji, type: 'emoji' };
                dataChannel.send(JSON.stringify(payload));
                addMessage('VOCÊ', emoji);
            }
        }

        function addMessage(sender, msg) {
            const chat = document.getElementById('chat');
            const color = sender === 'VOCÊ' ? 'text-chakra' : 'text-blue-400';
            chat.innerHTML += `<div><span class="${color} font-bold">${sender}:</span> ${msg}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }

        function addLog(type, msg) {
            document.getElementById('chat').innerHTML += `<div class="text-[10px] text-zinc-500">[${type}] ${msg}</div>`;
        }

        function triggerFile() { document.getElementById('fileInput').click(); }
        function startAudio() { alert("Gravando Chakra Vocal... (Simulação)"); }

        init();
    </script>
</body>
</html>
