<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Emanuel: Shinobi World</title>
    <style>
        body { margin: 0; overflow: hidden; background: #1a1a1a; font-family: 'Segoe UI', sans-serif; }
        #ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; color: white; }
        
        /* Tema Naruto: Cores e Estilo */
        .top-bar { position: absolute; top: 20px; width: 100%; display: flex; justify-content: space-around; pointer-events: auto; }
        .ui-btn { background: #ff9800; color: #fff; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; border: 2px solid #000; box-shadow: 4px 4px 0 #000; }
        
        /* Overlay de Chamada Shuriken */
        #call-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: none; flex-direction: column;
            align-items: center; justify-content: center; z-index: 100; pointer-events: auto;
        }
        .shuriken-loader {
            width: 100px; height: 100px; border: 5px solid #ff9800;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            animation: spin 1s linear infinite; background: #555;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Botão Enviar Rasengan */
        .btn-send { 
            position: relative; width: 60px; height: 60px; background: #2196f3; 
            border-radius: 50%; border: none; cursor: pointer; pointer-events: auto;
            display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .rasengan-anim {
            position: absolute; width: 100%; height: 100%;
            background: radial-gradient(circle, #fff 10%, #2196f3 70%);
            opacity: 0; transition: 0.3s;
        }
        .btn-send:active .rasengan-anim { opacity: 1; transform: scale(1.5) rotate(360deg); }

        /* Controles e Chat */
        #chat-container { position: absolute; bottom: 120px; right: 20px; width: 300px; pointer-events: auto; display: none; }
        #chat-input { width: 100%; padding: 10px; border-radius: 20px; border: 2px solid #ff9800; background: #000; color: #fff; }
        
        #controls { position: absolute; bottom: 20px; left: 20px; display: grid; grid-template-columns: repeat(3, 60px); gap: 10px; pointer-events: auto; }
        .btn-dir { width: 60px; height: 60px; background: rgba(255,152,0,0.5); border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; }
    </style>
</head>
<body>

    <div id="call-overlay">
        <div class="shuriken-loader"></div>
        <h2 id="call-type">CONECTANDO VIA SHURIKEN...</h2>
        <video id="localVideo" autoplay playsinline style="width: 200px; border: 3px solid #ff9800; margin-top: 20px;"></video>
        <button class="ui-btn" onclick="endCall()" style="margin-top: 20px; background: #f44336;">ENCERRAR</button>
    </div>

    <div id="ui-layer">
        <div class="top-bar">
            <button class="ui-btn" onclick="startCall('audio')">📞 ÁUDIO HD</button>
            <button class="ui-btn" onclick="startCall('video')">📷 VÍDEO NINJA</button>
            <button class="ui-btn" onclick="openCamera()">🤳 CÂMERA</button>
        </div>

        <div id="chat-container">
            <input type="text" id="chat-input" placeholder="Enviar mensagem...">
            <button class="btn-send" onclick="sendWithRasengan()">
                <div class="rasengan-anim"></div>
                ⚡
            </button>
        </div>

        <div id="controls">
            <div class="btn-dir" id="btn-up" style="grid-column: 2;">▲</div>
            <div class="btn-dir" id="btn-left" style="grid-column: 1; grid-row: 2;">◀</div>
            <div class="btn-dir" id="btn-down" style="grid-column: 2; grid-row: 2;">▼</div>
            <div class="btn-dir" id="btn-right" style="grid-column: 3; grid-row: 2;">▶</div>
        </div>
        
        <input type="file" id="cam-input" accept="image/*" capture="camera" style="display:none">
    </div>

    <script type="importmap">
        { "imports": { "three": "https://unpkg.com/three@0.160.0/build/three.module.js" } }
    </script>

    <script type="module">
        import * as THREE from 'three';

        // --- CENA 3D (BASEADA NO SEU ARQUIVO) ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        // Player (Representação)
        const player = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xff9800}));
        player.add(body);
        player.position.y = 0.5;
        scene.add(player);

        // --- LÓGICA DE CHAMADA E MÍDIA ---
        window.startCall = async (type) => {
            const overlay = document.getElementById('call-overlay');
            const callTypeText = document.getElementById('call-type');
            overlay.style.display = 'flex';
            callTypeText.innerText = type === 'video' ? "JUTSU DE VÍDEO CONFERÊNCIA..." : "CONEXÃO DE ÁUDIO SHINOBI...";

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: type === 'video', 
                    audio: { echoCancellation: true, noiseSuppression: true } 
                });
                if(type === 'video') document.getElementById('localVideo').srcObject = stream;
            } catch (err) {
                alert("Falha na conexão ninja: " + err);
                endCall();
            }
        };

        window.endCall = () => {
            const overlay = document.getElementById('call-overlay');
            overlay.style.display = 'none';
            const video = document.getElementById('localVideo');
            if(video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());
        };

        window.openCamera = () => document.getElementById('cam-input').click();

        window.sendWithRasengan = () => {
            const input = document.getElementById('chat-input');
            if(input.value) {
                console.log("Mensagem com Rasengan: " + input.value);
                input.value = "";
                // Aqui você pode integrar o Firebase que você já usa no projeto Emanuel
            }
        };

        // --- MOVIMENTAÇÃO (Simplificada para o exemplo) ---
        const move = { f: false, b: false, l: false, r: false };
        document.getElementById('btn-up').onpointerdown = () => move.f = true;
        document.getElementById('btn-up').onpointerup = () => move.f = false;
        // ... (Repetir para outros botões de direção)

        function animate() {
            requestAnimationFrame(animate);
            if(move.f) player.position.z -= 0.1;
            camera.position.lerp(new THREE.Vector3(player.position.x, 5, player.position.z + 10), 0.1);
            camera.lookAt(player.position);
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
