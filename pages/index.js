<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>SHINOBI SYSTEM v3 - FINAL</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        body { background: #0a0a0c; color: #eee; font-family: 'Segoe UI', sans-serif; }
        .ninja-ui { border: 2px solid #ff4343; background: rgba(20, 20, 25, 0.9); box-shadow: 0 0 20px rgba(255, 67, 67, 0.2); }
        video { width: 100%; border-radius: 4px; background: #000; transform: scaleX(-1); border: 1px solid #333; }
        .status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; background: #ff4343; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
    </style>
</head>
<body class="p-4 flex flex-col items-center justify-center min-h-screen">

    <div class="w-full max-w-4xl ninja-ui rounded-xl p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-black text-red-600 tracking-widest">SHINOBI <span class="text-white">OS</span></h1>
            <div class="text-xs text-red-500 uppercase font-bold"><span class="status-dot mr-2"></span> Sistema Ativo</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="relative">
                <video id="localVideo" autoplay playsinline muted></video>
                <div class="absolute top-2 left-2 bg-red-600 px-2 py-0.5 text-[10px] font-bold">MEU CHAKRA</div>
            </div>
            <div class="relative">
                <video id="remoteVideo" autoplay playsinline></video>
                <div class="absolute top-2 left-2 bg-blue-600 px-2 py-0.5 text-[10px] font-bold">CONTATO</div>
            </div>
        </div>

        <div class="space-y-4">
            <div class="flex flex-col md:flex-row gap-2">
                <input id="targetId" type="text" placeholder="ID do Alvo" class="bg-black border border-zinc-700 p-3 flex-1 rounded outline-none focus:border-red-600 text-white font-mono">
                <button onclick="callContact()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold uppercase transition-all">Iniciar Invocação</button>
            </div>

            <div class="bg-zinc-900 p-3 rounded text-center border border-zinc-800">
                <span class="text-gray-400 text-sm">SEU ID DE CONEXÃO:</span>
                <span id="myId" class="ml-2 font-mono text-xl text-red-500 font-bold">...</span>
            </div>

            <div class="h-40 bg-black border border-zinc-800 rounded p-3 overflow-y-auto mb-2 text-sm font-mono" id="chat">
                <div class="text-zinc-600 italic">// Sistema pronto para transmissão de pergaminhos...</div>
            </div>

            <div class="flex gap-2 items-center">
                <button onclick="alert('Áudio em desenvolvimento')" class="p-2 bg-zinc-800 rounded hover:bg-zinc-700">🎙️</button>
                <input id="msgInput" type="text" placeholder="Escrever mensagem..." class="flex-1 bg-transparent border-b border-zinc-700 p-2 outline-none focus:border-red-600">
                <button onclick="sendChat()" class="text-red-500 text-xl font-bold">Send</button>
            </div>
        </div>
    </div>

    <script>
        // CONFIGURAÇÃO DO FIREBASE (SUBSTITUA AQUI)
        const firebaseConfig = {
            apiKey: "COLE_SUA_API_KEY",
            projectId: "COLE_SEU_PROJECT_ID",
            appId: "COLE_SEU_APP_ID"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };

        let localStream, peerConnection;
        const myId = Math.floor(Math.random() * 900000) + 100000;
        document.getElementById('myId').innerText = myId;

        // Iniciar Câmera
        async function init() {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('localVideo').srcObject = localStream;

            // Ficar ouvindo se alguém me liga
            db.collection('calls').doc(myId.toString()).onSnapshot(snap => {
                const data = snap.data();
                if (data && data.offer && !peerConnection) {
                    if (confirm("Invocação recebida! Aceitar?")) answerCall(data.offer);
                }
            });
        }

        async function setupPeer() {
            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            peerConnection.ontrack = e => document.getElementById('remoteVideo').srcObject = e.streams[0];
            
            // Gerenciar candidatos de rede (ICE)
            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    const target = document.getElementById('targetId').value || myId.toString();
                    db.collection('calls').doc(target).collection('candidates').add(e.candidate.toJSON());
                }
            };
        }

        async function callContact() {
            const target = document.getElementById('targetId').value;
            await setupPeer();
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await db.collection('calls').doc(target).set({ offer });

            // Ouvir resposta (answer)
            db.collection('calls').doc(target).onSnapshot(snap => {
                const data = snap.data();
                if (data?.answer) peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            });
        }

        async function answerCall(offer) {
            await setupPeer();
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            const target = document.getElementById('targetId').value;
            await db.collection('calls').doc(myId.toString()).update({ answer });
        }

        function sendChat() {
            const input = document.getElementById('msgInput');
            const chat = document.getElementById('chat');
            if (input.value) {
                chat.innerHTML += `<div class='text-red-500'>[VOCÊ]: ${input.value}</div>`;
                input.value = "";
                chat.scrollTop = chat.scrollHeight;
            }
        }

        init();
    </script>
</body>
</html>
