<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Emanuel: Shinobi World</title>
    <style>
        body { margin: 0; overflow: hidden; background: #1a1a1a; font-family: 'Segoe UI', sans-serif; }
        #ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; color: white; }
        
        /* Tema Naruto */
        .top-bar { position: absolute; top: 20px; width: 100%; display: flex; justify-content: space-around; pointer-events: auto; }
        .ui-btn { background: #ff9800; color: #fff; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; border: 2px solid #000; box-shadow: 4px 4px 0 #000; }
        
        /* Avatar 3D Style */
        #profile-area { position: absolute; top: 80px; left: 20px; pointer-events: auto; text-align: center; }
        #avatar-pic { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #ff9800; background: #333; cursor: pointer; object-fit: cover; }

        /* Overlay Shuriken */
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

        /* Botão Enviar Rasengan Melhorado */
        .btn-send { 
            position: relative; width: 60px; height: 60px; background: #2196f3; 
            border-radius: 50%; border: none; cursor: pointer; pointer-events: auto;
            display: flex; align-items: center; justify-content: center; overflow: visible;
        }
        
        /* Canvas do Rasengan (Sobreposto ao botão) */
        #rasengan-container { position: absolute; width: 120px; height: 120px; pointer-events: none; display: none; z-index: 10; }

        #chat-container { position: absolute; bottom: 120px; right: 20px; width: 300px; pointer-events: auto; display: flex; gap: 10px; }
        #chat-input { flex: 1; padding: 10px; border-radius: 20px; border: 2px solid #ff9800; background: #000; color: #fff; }
        
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

        <div id="profile-area">
            <img id="avatar-pic" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shinobi" onclick="initAvatarCreator()">
            <p style="font-size: 12px;">Editar Avatar</p>
        </div>

        <div id="chat-container">
            <input type="text" id="chat-input" placeholder="Enviar mensagem...">
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div id="rasengan-container"></div>
                <button class="btn-send" onclick="sendWithRasengan()">⚡</button>
            </div>
        </div>

        <div id="controls">
            <div class="btn-dir" id="btn-up" style="grid-column: 2;">▲</div>
            <div class="btn-dir" id="btn-left" style="grid-column: 1; grid-row: 2;">◀</div>
            <div class="btn-dir" id="btn-down" style="grid-column: 2; grid-row: 2;">▼</div>
            <div class="btn-dir" id="btn-right" style="grid-column: 3; grid-row: 2;">▶</div>
        </div>
    </div>

    <script type="importmap">
        { "imports": { "three": "https://unpkg.com/three@0.160.0/build/three.module.js" } }
    </script>

    <script type="module">
        import * as THREE from 'three';

        // --- CENA PRINCIPAL ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const player = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xff9800}));
        player.add(body);
        player.position.y = 0.5;
        scene.add(player);

        // --- LÓGICA DO AVATAR 3D (Ready Player Me) ---
        window.initAvatarCreator = () => {
            const subdomain = 'demo'; // Você pode criar o seu no readyplayer.me
            const frame = document.createElement('iframe');
            frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
            frame.style.cssText = "position:fixed; top:5%; left:5%; width:90%; height:90%; z-index:1000; border:none; border-radius:20px;";
            frame.id = "rpm-frame";
            document.body.appendChild(frame);

            window.addEventListener('message', function subscribe(event) {
                const json = parse(event);
                if (json?.source === 'readyplayerme' && json?.eventName === 'v1.avatar.exported') {
                    document.getElementById('avatar-pic').src = `${json.data.url}.png`;
                    document.getElementById('rpm-frame').remove();
                    window.removeEventListener('message', subscribe);
                }
            });
            function parse(event) { try { return JSON.parse(event.data); } catch { return null; } }
        };

        // --- ANIMAÇÃO DO RASENGAN ---
        let rasenganScene, rasenganRenderer, rasenganCamera, rasenganBall;
        
        function initRasenganFX() {
            const container = document.getElementById('rasengan-container');
            rasenganScene = new THREE.Scene();
            rasenganCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
            rasenganRenderer = new THREE.WebGLRenderer({ alpha: true });
            rasenganRenderer.setSize(120, 120);
            container.appendChild(rasenganRenderer.domElement);

            const geo = new THREE.SphereGeometry(1, 32, 32);
            const mat = new THREE.MeshBasicMaterial({ 
                color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.8 
            });
            rasenganBall = new THREE.Mesh(geo, mat);
            rasenganScene.add(rasenganBall);
            rasenganCamera.position.z = 2;
        }
        initRasenganFX();

        window.sendWithRasengan = () => {
            const input = document.getElementById('chat-input');
            if(!input.value) return;

            const container = document.getElementById('rasengan-container');
            container.style.display = 'block';

            // Logica de envio
            console.log("Mensagem Enviada: " + input.value);
            input.value = "";

            // Efeito visual por 1.5s
            let startTime = Date.now();
            function animateFX() {
                if(Date.now() - startTime > 1500) {
                    container.style.display = 'none';
                    return;
                }
                rasenganBall.rotation.y += 0.3;
                rasenganBall.rotation.x += 0.2;
                rasenganBall.scale.setScalar(Math.random() * 0.5 + 1);
                rasenganRenderer.render(rasenganScene, rasenganCamera);
                requestAnimationFrame(animateFX);
            }
            animateFX();
        };

        // --- SISTEMA DE CHAMADAS ---
        window.startCall = async (type) => {
            const overlay = document.getElementById('call-overlay');
            overlay.style.display = 'flex';
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
                if(type === 'video') document.getElementById('localVideo').srcObject = stream;
            } catch (err) { alert("Erro ninja: " + err); endCall(); }
        };

        window.endCall = () => {
            document.getElementById('call-overlay').style.display = 'none';
            const video = document.getElementById('localVideo');
            if(video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
        };

        // --- LOOP PRINCIPAL ---
        function animate() {
            requestAnimationFrame(animate);
            camera.position.lerp(new THREE.Vector3(player.position.x, 5, player.position.z + 10), 0.1);
            camera.lookAt(player.position);
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
