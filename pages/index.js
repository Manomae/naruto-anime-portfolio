<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emanuel - Dashboard Total</title>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <style>
        :root {
            --bg-dark: #0a0a0a;
            --panel-bg: rgba(20, 20, 20, 0.9);
            --accent-orange: #ff9d00;
            --accent-glow: rgba(255, 157, 0, 0.3);
            --text-gray: #b0b0b0;
            --glass-border: rgba(255, 255, 255, 0.05);
        }

        * { margin: 0; padding: 0; box-box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }

        body {
            background-color: var(--bg-dark);
            color: white;
            height: 100vh;
            display: flex;
            overflow: hidden;
        }

        /* BARRA LATERAL MODERNA */
        nav {
            width: 70px;
            background: var(--panel-bg);
            border-right: 1px solid var(--glass-border);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            backdrop-filter: blur(10px);
            z-index: 10;
        }

        .nav-item {
            width: 45px;
            height: 45px;
            margin-bottom: 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s;
            color: var(--text-gray);
            border: 1px solid transparent;
            position: relative;
        }

        .nav-item:hover, .nav-item.active {
            color: var(--accent-orange);
            background: var(--accent-glow);
            border-color: var(--accent-orange);
            box-shadow: 0 0 15px var(--accent-glow);
        }

        .nav-item.profile {
            background: #4a148c; /* Cor do seu 'M' no print */
            color: white;
            font-weight: bold;
            margin-top: auto; /* Joga para o final */
        }

        /* ÁREA PRINCIPAL */
        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        }

        /* HEADER DO CHAT */
        header {
            padding: 15px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--glass-border);
            background: rgba(0,0,0,0.2);
        }

        .user-info h3 { font-size: 1rem; letter-spacing: 1px; }

        /* MENSAGENS (O Vazio que estava no print) */
        #chat-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .msg {
            max-width: 70%;
            padding: 12px;
            border-radius: 15px;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .msg.received {
            background: rgba(255,255,255,0.05);
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        /* CAMPO DE ENTRADA (ESTILO PÍLULA) */
        .input-area {
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .input-wrapper {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--glass-border);
            border-radius: 25px;
            padding: 10px 20px;
            display: flex;
            align-items: center;
        }

        input {
            background: transparent;
            border: none;
            color: white;
            flex: 1;
            outline: none;
            padding: 5px;
        }

        .btn-action {
            background: none;
            border: none;
            color: var(--accent-orange);
            cursor: pointer;
            font-size: 1.2rem;
            transition: 0.2s;
        }

        .btn-action:hover { transform: scale(1.2); }

    </style>
</head>
<body>

    <nav>
        <div class="nav-item active"><i class="fas fa-users"></i></div>
        <div class="nav-item"><i class="fas fa-gamepad"></i></div>
        <div class="nav-item"><i class="fas fa-folder"></i></div>
        <div class="nav-item"><i class="fas fa-code"></i></div>
        
        <div class="nav-item profile">M</div>
        <div class="nav-item"><i class="fas fa-cog"></i></div>
    </nav>

    <main>
        <header>
            <div class="user-info">
                <h3>sgxdgg</h3>
                <small style="color: #00ff00;">● Online</small>
            </div>
            <div class="actions">
                <button class="btn-action" style="margin-right: 15px;"><i class="fas fa-phone"></i></button>
                <button class="btn-action"><i class="fas fa-video"></i></button>
            </div>
        </header>

        <div id="chat-content">
            <div class="msg received">Bem-vindo de volta! O sistema foi atualizado para a versão Pro.</div>
        </div>

        <div class="input-area">
            <button class="btn-action"><i class="fas fa-paperclip"></i></button>
            <div class="input-wrapper">
                <input type="text" id="userInput" placeholder="Digite uma mensagem...">
                <button class="btn-action" onclick="sendMessage()"><i class="fas fa-bolt"></i></button>
            </div>
        </div>
    </main>

    <script>
        // Função simples para testar o envio
        function sendMessage() {
            const input = document.getElementById('userInput');
            const chat = document.getElementById('chat-content');
            
            if(input.value.trim() !== "") {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'msg';
                msgDiv.style.alignSelf = 'flex-end';
                msgDiv.style.background = 'var(--accent-orange)';
                msgDiv.style.color = 'black';
                msgDiv.style.borderBottomRightRadius = '2px';
                msgDiv.textContent = input.value;
                
                chat.appendChild(msgDiv);
                input.value = "";
                chat.scrollTop = chat.scrollHeight;

                // Aqui você integraria o seu 'db.collection("messages").add()' do Firebase
            }
        }

        // Enviar com Enter
        document.getElementById('userInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
