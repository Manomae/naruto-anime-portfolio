<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Shinobi System v2</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    <style>
        body { background: #050a14; color: #00ffcc; font-family: 'Courier New', monospace; }
        .ninja-border { border: 2px solid #ff4343; box-shadow: 0 0 10px #ff4343; }
        video { width: 100%; border-radius: 8px; background: #000; transform: scaleX(-1); }
        .btn { background: #ff4343; color: white; padding: 10px; border-radius: 5px; font-weight: bold; transition: 0.3s; }
        .btn:hover { background: #cc3333; cursor: pointer; }
    </style>
</head>
<body class="flex flex-col h-screen p-4">

    <div class="mb-4 text-center">
        <h1 class="text-2xl font-bold text-red-500">SHINOBI INTERFACE - P2P</h1>
        <p class="text-xs">MODO: CONEXÃO DIRETA VIA CHAKRA</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
            <video id="localVideo" autoplay playsinline muted class="ninja-border"></video>
            <p class="text-center text-xs mt-1">VOCÊ (GENIN)</p>
        </div>
        <div>
            <video id="remoteVideo" autoplay playsinline class="ninja-border"></video>
            <p class="text-center text-xs mt-1">CONTATO (JONIN)</p>
        </div>
    </div>

    <div class="bg-gray-900 p-4 rounded-lg flex flex-col gap-3">
        <div class="flex gap-2">
            <input id="callInput" type="text" placeholder="Cole o ID do contato" class="bg-black border border-red-500 p-2 flex-1 outline-none text-white">
            <button onclick="createCall()" class="btn">INICIAR JUTSU</button>
            <button onclick="answerCall()" class="btn" style="background:#0066ff">ATENDER</button>
        </div>
        
        <div id="idDisplay" class="text-sm bg-red-900/20 p-2 rounded border border-red-500/30 text-center">
            Seu ID de Invocação: <span id="myId" class="font-bold text-white">Gerando...</span>
        </div>

        <div id="chat" class="h-32 overflow-y-auto border-t border-gray-700 pt-2 text-sm"></div>
        
        <div class="flex gap-2 items-center">
            <button onclick="alert('Áudio gravando...')" class="text-xl">🎙️</button>
            <input id="msg" type="text" placeholder="Enviar pergaminho..." class="bg-transparent border-b border-red-500 flex-1 p-1 outline-none">
            <button onclick="sendMsg()" class="text-xl text-red-500">➤</button>
        </div>
    </div>

    <script>
        // --- CONFIGURAÇÃO OBRIGATÓRIA ---
        const firebaseConfig = {
            apiKey: "COLE_SUA_API_KEY_AQUI",
            projectId: "COLE_SEU_PROJECT_ID_AQUI",
            appId: "COLE_SEU_APP_ID_AQUI"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        let localStream, remoteStream, peerConnection;
        const servers = { iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }] };

        // 1. Inicializar Câmera e ID
        async function start() {
            localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            document.getElementById('localVideo').srcObject = localStream;
            
            const myId = Math.random().toString(36).substring(7);
            document.getElementById('myId').innerText = myId;
            window.myId = myId;
        }

        // 2. Criar Chamada
        async function createCall() {
            const callId = document.getElementById('callInput').value;
            if(!callId) return alert("Insira o ID do contato!");

            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            peerConnection.ontrack = event => {
                document.getElementById('remoteVideo').srcObject = event.streams[0];
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            await db.collection('calls').doc(callId).set({ offer });

            // Ouvir resposta
            db.collection('calls').doc(callId).onSnapshot(snap => {
                const data = snap.data();
                if (data?.answer && !peerConnection.currentRemoteDescription) {
                    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            });
        }

        // 3. Atender Chamada
        async function answerCall() {
            const callId = window.myId;
            const callDoc = await db.collection('calls').doc(callId).get();
            const offer = callDoc.data().offer;

            peerConnection = new RTCPeerConnection(servers);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            peerConnection.ontrack = event => {
                document.getElementById('remoteVideo').srcObject = event.streams[0];
            };

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            await db.collection('calls').doc(callId).update({ answer });
        }

        function sendMsg() {
            const m = document.getElementById('msg').value;
            const c = document.getElementById('chat');
            c.innerHTML += `<div><b>Você:</b> ${m}</div>`;
            document.getElementById('msg').value = '';
        }

        start();
    </script>
</body>
</html>
