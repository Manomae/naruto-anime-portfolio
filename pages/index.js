<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel Ultra Update</title>
    <style>
        /* BASE DA INTERFACE (IGUAL AO SEU PRINT) */
        body { margin: 0; background: #000; font-family: sans-serif; display: flex; height: 100vh; overflow: hidden; }
        
        /* BARRA LATERAL ESTILIZADA */
        .sidebar { width: 60px; background: #0a0a0a; border-right: 2px solid #ff9800; display: flex; flex-direction: column; align-items: center; padding-top: 20px; gap: 15px; }
        .side-icon { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .side-icon.active { border-color: #ff9800; box-shadow: 0 0 10px #ff9800; }
        .side-icon img { width: 25px; }

        /* ÁREA PRINCIPAL DE CHAT */
        .main-chat { flex: 1; display: flex; flex-direction: column; background: #000; position: relative; }
        .header { height: 50px; background: #0a0a0a; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid #222; justify-content: space-between; }
        #messages { flex: 1; overflow-y: auto; padding: 20px; color: white; }

        /* PAINEL DE CHAKRA (A MUDANÇA QUE VOCÊ PEDIU) */
        #chakra-panel { display: none; height: 120px; background: #000; border-top: 2px solid #ffeb3b; position: relative; overflow: hidden; }
        .chakra-drop { position: absolute; background: linear-gradient(to bottom, #ffeb3b, #ff9800); border-radius: 50% 50% 10% 10%; animation: fall infinite linear; }
        @keyframes fall { from { transform: translateY(-50px); opacity: 1; } to { transform: translateY(150px); opacity: 0; } }

        /* BARRA DE INPUT ATUALIZADA */
        .input-bar { height: 70px; background: #0a0a0a; display: flex; align-items: center; padding: 0 15px; gap: 10px; }
        .input-bar input { flex: 1; background: #1a1a1a; border: 1px solid #333; padding: 12px; border-radius: 20px; color: white; outline: none; }
        
        /* BOTÃO NARUTO (SUBSTITUINDO O RAIO) */
        #naruto-btn { 
            width: 50px; height: 50px; 
            background: url('https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/naruto-face.png'); 
            background-size: cover; border-radius: 50%; cursor: pointer; border: 2px solid #ff9800;
            transition: 0.3s;
        }
        #naruto-btn:hover { transform: scale(1.1) rotate(10deg); box-shadow: 0 0 15px #ff9800; }
    </style>
</head>
<body>

<div class="sidebar">
    <div class="side-icon active"><img src="https://cdn-icons-png.flaticon.com/512/681/681494.png"></div>
    <div class="side-icon"></div>
    <div class="side-icon active"></div> <div class="side-icon"></div>
    <div class="side-icon" style="background: #673ab7; color: white; font-weight: bold;">M</div>
    <div class="side-icon" style="border:none;"><img src="https://cdn-icons-png.flaticon.com/512/126/126472.png"></div>
</div>

<div class="main-chat">
    <div class="header">
        <span style="color: white; font-weight: bold;">Maria Lucilene</span>
        <div>
            <span style="cursor:pointer; margin-right: 15px;">📞</span>
            <span style="cursor:pointer;">📹</span>
        </div>
    </div>

    <div id="messages">
        <div style="margin-bottom: 15px;"><b>Sistema:</b> <br>Ultra Atualização Emanuel carregada!</div>
    </div>

    <div id="chakra-panel" onclick="sendChakra()">
        <div style="position:absolute; width:100%; text-align:center; top:40%; color:#ffeb3b; z-index:10; font-weight:bold; pointer-events:none;">
            CHAKRA ANIMADO INFINITO
        </div>
    </div>

    <div class="input-bar">
        <button onclick="toggleChakra()" style="background:none; border:none; cursor:pointer; font-size:20px;">🎬</button>
        <button style="background:none; border:none; cursor:pointer; font-size:20px;">📎</button>
        <input type="text" id="msg-input" placeholder="Use /gif ou mensagem...">
        <div id="naruto-btn" onclick="enviar()"></div>
    </div>
</div>

<script>
    function toggleChakra() {
        const p = document.getElementById('chakra-panel');
        p.style.display = (p.style.display === 'none' || p.style.display === '') ? 'block' : 'none';
        if(p.style.display === 'block') startRain();
    }

    function startRain() {
        const p = document.getElementById('chakra-panel');
        for(let i=0; i<20; i++) {
            const drop = document.createElement('div');
            drop.className = 'chakra-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.width = '8px';
            drop.style.height = '15px';
            drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            p.appendChild(drop);
        }
    }

    function enviar() {
        const input = document.getElementById('msg-input');
        if(input.value.trim() !== "") {
            const m = document.getElementById('messages');
            m.innerHTML += `<div style="margin-bottom:10px;"><b>Você:</b> <br>${input.value}</div>`;
            input.value = "";
            m.scrollTop = m.scrollHeight;
        }
    }

    function sendChakra() {
        const m = document.getElementById('messages');
        m.innerHTML += `<div style="color:#ffeb3b; border:1px solid #ffeb3b; padding:10px; border-radius:10px;">🔥 Energia de Chakra Enviada!</div>`;
        toggleChakra();
    }
</script>

</body>
</html>
