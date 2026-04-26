<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shinobi Connect - Sistema de Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        :root { --konoha-red: #ff4343; --shinobi-blue: #0a192f; }
        body { background: var(--shinobi-blue); color: #e6f1ff; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 40vh; }
        video { width: 100%; height: 100%; border-radius: 12px; background: #000; object-fit: cover; border: 2px solid var(--konoha-red); }
        .chat-box { height: 30vh; overflow-y: auto; scrollbar-width: thin; }
        .btn-jutsu { transition: 0.3s; background: var(--konoha-red); font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .btn-jutsu:hover { transform: scale(1.05); box-shadow: 0 0 15px var(--konoha-red); }
        #sharing-id { color: #5efdff; font-family: monospace; }
    </style>
</head>
<body class="p-4 flex flex-col h-screen">

    <header class="flex justify-between items-center mb-4 glass p-4 rounded-xl">
        <h1 class="text-xl font-bold tracking-tighter">SHINOBI <span class="text-red-500">SYSTEM</span></h1>
        <div id="status" class="text-xs uppercase text-gray-400">Status: Aguardando Chakra...</div>
    </header>

    <div class="video-grid mb-4">
        <div class="relative">
            <video id="localVideo" autoplay playsinline muted></video>
            <span class="absolute bottom-2 left-2 bg-black/50 text-[10px] px-2">VOCÊ</span>
        </div>
        <div class="relative">
            <video id="remoteVideo" autoplay playsinline></video>
            <span class="absolute bottom-2 left-2 bg-black/50 text-[10px] px-2">CONTATO</span>
        </div>
    </div>

    <div class="flex-1 flex flex-col glass rounded-xl p-4 overflow-hidden">
        <div class="flex gap-2 mb-4">
            <input id="callInput" type="text" placeholder="ID do Contato" class="bg-transparent border border-white/20 rounded px-3 py-2 flex-1 outline-none focus:border-red-500">
            <button onclick="makeCall()" class="btn-jutsu px-4 py-2 rounded">Invocar Chamada</button>
        </div>

        <div id="chatBox" class="chat-box mb-4 space-y-2 border-b border-white/10 pb-2">
            <div class="text-gray-500 text-xs text-center italic">Inicie o chat para trocar pergaminhos...</div>
        </div>

        <div class="flex items-center gap-2">
            <button onclick="startAudioRecord()" title="Mandar Áudio" class="p-2 hover:bg-white/10 rounded-full">🎙️</button>
            <label class="cursor-pointer p-2 hover:bg-white/10 rounded-full">
                📂 <input type="file" id="fileInput" class="hidden" onchange="sendFile()">
            </label>
            <input id="msgInput" type="text" placeholder="Escreva sua mensagem..." class="bg-white/5 border-none rounded-full px-4 py-2 flex-1 outline-none">
            <button onclick="sendTextMsg()" class="text-2xl">🔥</button>
        </div>
    </div>

    <div class="mt-2 text-[10px] flex justify-between px-2">
        <span>SEU ID: <b id="myId">---</b></span>
        <span>MODO: P2P DIRECT-CODE</span>
    </div>

    <script>
        // CONFIGURAÇÃO FIREBASE (Substitua pelos seus dados do console)
        const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            projectId: "SEU_PROJECT_ID",
            appId: "SEU_APP_ID"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // WEBRTC E STREAMS
        let localStream = null;
        let remoteStream = null;
        let peerConnection = null;
        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };

        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        const chatBox = document.getElementById('chatBox');

        // INICIALIZAÇÃO
        async function init() {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;
            
            // Criar ID de Sessão Único (Pode ser seu contato Google no futuro)
            const myId = Math.floor(Math.random() * 9000) + 1000;
            document.getElementById('myId').innerText = myId;

            // Ouvir por chamadas recebidas
            db.collection('calls').doc(myId.toString()).onSnapshot(snapshot => {
                const data = snapshot.data();
                if (data && !peerConnection && data.offer) {
                    answerCall(myId.toString(), data.offer);
                }
            });
        }

        async function createPC() {
            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            
            peerConnection.ontrack = (event) => {
                remoteVideo.srcObject = event.streams[0];
            };

            // Canal de Dados (Chat/Arquivos/Emojis)
            const dataChannel = peerConnection.createDataChannel("shinobiChat");
            setupDataChannel(dataChannel);
        }

        function setupDataChannel(channel) {
            channel.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                addMessageToUI(msg.sender, msg.content, msg.type);
            };
            window.activeChannel = channel;
        }

        // FUNÇÕES DE CHAMADA (FIREBASE SINALIZAÇÃO)
        async function makeCall() {
            await createPC();
            const targetId = document.getElementById('callInput').value;
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            await db.collection('calls').doc(targetId).set({ offer: { type: offer.type, sdp: offer.sdp } });
            
            // Ouvir resposta
            db.collection('calls').doc(targetId).onSnapshot(snapshot => {
                const data = snapshot.data();
                if (data?.answer && !peerConnection.currentRemoteDescription) {
                    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            });
        }

        async function answerCall(id, offer) {
            await createPC();
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await db.collection('calls').doc(id).update({ answer: { type: answer.type, sdp: answer.sdp } });
        }

        // CHAT E MÍDIA
        function sendTextMsg() {
            const val = document.getElementById('msgInput').value;
            if(!val || !window.activeChannel) return;
            const msg = { sender: 'Você', content: val, type: 'text' };
            window.activeChannel.send(JSON.stringify(msg));
            addMessageToUI('Você', val, 'text');
            document.getElementById('msgInput').value = '';
        }

        function addMessageToUI(sender, content, type) {
            const div = document.createElement('div');
            div.className = "text-sm p-2 rounded bg-white/10";
            div.innerHTML = `<b>${sender}:</b> ${content}`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Nota: Gravação de áudio e envio de arquivos requerem blobs convertidos em Base64 ou ArrayBuffers
        // via DataChannel, o que mantém a conexão 100% P2P sem custo de servidor.

        init();
    </script>
</body>
</html>
