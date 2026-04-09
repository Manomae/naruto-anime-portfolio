<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel Ultra Update</title>
    <style>
        /* RESET E BASE */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; font-family: 'Segoe UI', sans-serif; display: flex; height: 100vh; color: white; }

        /* BARRA LATERAL (IDÊNTICA AO SEU PRINT) */
        .sidebar { 
            width: 70px; 
            background: #0a0a0a; 
            border-right: 2px solid #ff9800; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            padding: 20px 0; 
            gap: 20px;
        }
        .icon-circle { 
            width: 45px; height: 45px; 
            border-radius: 50%; 
            border: 2px solid #333; 
            display: flex; align-items: center; justify-content: center; 
            cursor: pointer; transition: 0.3s;
        }
        .icon-circle.active { border-color: #ff9800; box-shadow: 0 0 10px #ff9800; }
        .icon-circle.purple { background: #673ab7; border: none; font-weight: bold; }

        /* CONTAINER PRINCIPAL */
        .main-content { flex: 1; display: flex; flex-direction: column; position: relative; }
        
        /* HEADER */
        .header { 
            height: 60px; background: #0a0a0a; 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0 20px; border-bottom: 1px solid #222; 
        }

        /* ÁREA DE MENSAGENS */
        #chat-box { flex: 1; padding: 20px; overflow-y: auto; background: #000; }

        /* O NOVO PAINEL DE CHAKRA (GIFS ANIMADOS PONTUDOS) */
        #chakra-panel { 
            display: none; height: 150px; background: #000; 
            border-top: 3px solid #ffeb3b; position: relative; overflow: hidden; 
        }
        .chakra-hair { 
            position: absolute; width: 10px; background: linear-gradient(to bottom, #ffeb3b, #ff9800); 
            border-radius: 0 0 50% 50%; animation: fall infinite linear; 
        }
        @keyframes fall { 
            from { transform: translateY(-100px); opacity: 1; } 
            to { transform: translateY(200px); opacity: 0; } 
        }

        /* BARRA DE BAIXO (INPUT) */
        .bottom-bar { 
            height: 80px; background: #0a0a0a; 
            display: flex; align-items: center; padding: 0 15px; gap: 10px; 
        }
        .btn-action { background: #1a1a1a; border: none; border-radius: 50%; width: 40px; height: 40px; color: #ff9800; cursor: pointer; font-size: 18px; }
        .input-wrapper { flex: 1; background: #111; border: 1px solid #333; border-radius: 25px; padding: 10px 20px; }
        #msg-input { width: 100%; background: transparent; border: none; color: white; outline: none; }

        /* BOTÃO DO NARUTO (MUDANÇA DO RAIO) */
        #naruto-send { 
            width: 55px; height: 55px; 
            background: url('https://raw.githubusercontent.com/manomae/manomae.github.io/main/assets/naruto-face.png'); 
            background-size: cover; border-radius: 50%; cursor: pointer; 
            border: 2px solid #ff9800; transition: 0.3s;
        }
        #naruto-send:hover { transform: scale(1.2) rotate(10deg); box-shadow: 0 0 20px #ff9800; }
    </style>
</head>
<body>

<div class="sidebar">
    <div class="icon-circle active" style="background: #ff9800;"><img src="https://cdn-icons-png.flaticon.com/512/681/681494.png" width="25"></div>
    <div class="icon-circle"></div>
    <div class="icon-circle active"></div>
    <div class="icon-circle"></div>
    <div class="icon-circle purple">M</div>
    <div class="icon-circle" style="border:none;"><img src="https://cdn-icons-png.flaticon.com/512/126/126472.png" width="25"></div>
</div>

<div class="main-content">
    <div class="header">
        <span style="font-weight: bold;">Maria Lucilene</span>
        <div style="display: flex; gap: 20px;">
            <span>📞</span>
            <span>📹</span>
        </div>
    </div>

    <div id="chat-box">
        <div style="color: #666; font-size: 12px; text-align: center; margin-bottom: 20px;">Hoje 16:37</div>
        <p><b>Sistema:</b> Ultra Atualização: Modo Chakra Ativado.</p>
    </div>

    <div id="chakra-panel" onclick="enviarChakra()">
        <div style="position: absolute; width: 100%; text-align: center; top: 40%; color: #ffeb3b; font-weight: bold; z-index: 5;">
            GIFS ANIMADOS: CLIQUE PARA ENVIAR ENERGIA
        </div>
    </div>

    <div class="bottom-bar">
        <button class="btn-action" onclick="toggleChakra()">🎬</button>
        <button class="btn-action">📎</button>
        <div class="input-wrapper">
            <input type="text" id="msg-input" placeholder="Naruto">
        </div>
        <div id="naruto-send" onclick="enviarMensagem()"></div>
    </div>
</div>

<script>
    function toggleChakra() {
        const panel = document.getElementById('chakra-panel');
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if(!isVisible) {
            panel.innerHTML = '<div style="position: absolute; width: 100%; text-align: center; top: 40%; color: #ffeb3b; font-weight: bold; z-index: 5;">GIFS ANIMADOS: CLIQUE PARA ENVIAR ENERGIA</div>';
            for(let i=0; i<30; i++) {
                let hair = document.createElement('div');
                hair.className = 'chakra-hair';
                hair.style.left = Math.random() * 100 + '%';
                hair.style.height = (Math.random() * 40 + 20) + 'px';
                hair.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
                hair.style.animationDelay = Math.random() * 2 + 's';
                panel.appendChild(hair);
            }
        }
    }

    function enviarMensagem() {
        const input = document.getElementById('msg-input');
        if(input.value.trim() !== "") {
            const chat = document.getElementById('chat-box');
            chat.innerHTML += `<div style="margin-bottom:15px; text-align:right;"><b>Você:</b><br>${input.value}</div>`;
            input.value = "";
            chat.scrollTop = chat.scrollHeight;
        }
    }

    function enviarChakra() {
        const chat = document.getElementById('chat-box');
        chat.innerHTML += `<div style="border: 2px solid #ffeb3b; color: #ffeb3b; padding: 10px; border-radius: 10px; background: #111;">🔥 Energia de Chakra Amarela Enviada!</div>`;
        toggleChakra();
        chat.scrollTop = chat.scrollHeight;
    }
</script>

</body>
</html>
