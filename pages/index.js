import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function ShinobiHome() {
    const [myId, setMyId] = useState('------');
    const [targetId, setTargetId] = useState('');
    const [status, setStatus] = useState('STATUS: AGUARDANDO_CHAKRA');
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    
    // Referências para WebRTC (fora do state para não dar re-render)
    const pc = useRef(null);
    const dataChannel = useRef(null);
    const localStream = useRef(null);

    useEffect(() => {
        // Inicializa o ID e a Câmera quando o componente carrega
        const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
        setMyId(generatedId);

        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStream.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                setStatus('SISTEMA PRONTO');
            } catch (err) {
                console.error("Erro na câmera:", err);
                setStatus('ERRO: CÂMERA NÃO DETECTADA');
            }
        }
        setupCamera();

        // Aqui você deve importar o Firebase dinamicamente se estiver usando Next.js
        // para evitar erros de "window is not defined"
    }, []);

    const callContact = () => {
        if (targetId.length < 6) return alert("Digite um ID válido!");
        alert("Invocando Shinobi ID: " + targetId + "...");
        // A lógica de sinalização do Firebase entraria aqui
    };

    return (
        <div className="shinobi-body">
            <Head>
                <title>SHINOBI CONNECT - ELITE</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>

            <style jsx global>{`
                body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; }
                .terminal { border: 3px solid #ff9a00; background: rgba(0,0,0,0.9); box-shadow: 0 0 20px #ff9a00; }
                .video-box { border: 1px solid #466b52; background: #111; overflow: hidden; position: relative; }
                video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
                .btn-jutsu { background: #cc0000; color: #fff; padding: 10px 20px; font-weight: bold; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
                .btn-jutsu:hover { background: #ff9a00; box-shadow: 0 0 15px #ff9a00; }
            `}</style>

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="terminal w-full max-w-5xl p-6 rounded-lg">
                    <header className="flex justify-between border-b border-orange-500/30 pb-4 mb-6">
                        <div>
                            <h1 className="text-3xl text-orange-500 font-black tracking-tighter">KONOHA_NET</h1>
                            <p className="text-[10px] text-green-500 uppercase">Level: ANBU Operational System</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 uppercase">Seu Código de Invocação:</p>
                            <div className="text-4xl font-black text-red-600 tracking-tighter">{myId}</div>
                        </div>
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4 h-64">
                                <div className="video-box rounded-tl-3xl">
                                    <video ref={localVideoRef} autoPlay playsInline muted />
                                    <span className="absolute top-1 left-2 text-[9px] bg-orange-600 px-1">MEU_JUTSU</span>
                                </div>
                                <div className="video-box rounded-br-3xl">
                                    <video ref={remoteVideoRef} autoPlay playsInline />
                                    <span className="absolute top-1 left-2 text-[9px] bg-red-600 px-1">ALVO</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 border-l-4 border-orange-500">
                                <label className="text-[10px] text-orange-400 block mb-2 font-bold">INVOCAR SHINOBI PELO ID:</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        maxLength="6" 
                                        value={targetId}
                                        onChange={(e) => setTargetId(e.target.value)}
                                        placeholder="000000" 
                                        className="bg-black border border-green-900 flex-1 text-3xl font-bold tracking-[10px] text-center text-orange-500 outline-none focus:border-orange-500"
                                    />
                                    <button onClick={callContact} className="btn-jutsu">INVOCAR</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-4 flex flex-col h-full">
                            <h3 className="text-xs font-bold text-orange-500 mb-4 italic underline underline-offset-4">PERGAMINHO DE TEXTO</h3>
                            <div className="flex-1 text-[11px] font-mono text-green-400 space-y-2 overflow-y-auto mb-4">
                                <div>// Rede de Chakra estabelecida...</div>
                                <div>// Aguardando sinal P2P...</div>
                            </div>
                            <div className="flex gap-2 border-t border-white/10 pt-4">
                                <input type="text" placeholder="Digite sua mensagem..." className="bg-transparent border-b border-orange-500/30 flex-1 outline-none text-xs p-1" />
                                <button className="text-orange-500 font-bold hover:text-white">ENVIAR</button>
                            </div>
                        </div>
                    </main>

                    <footer className="mt-6 pt-2 border-t border-white/5 flex justify-between text-[8px] font-bold text-zinc-500">
                        <span>MODO: P2P_DIRECT_CONNECTION</span>
                        <span className="text-green-600">{status}</span>
                        <span>ENCRYPTION: SHARINGAN_v4</span>
                    </footer>
                </div>
            </div>
        </div>
    );
}
