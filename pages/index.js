import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// CONFIGURAÇÃO REAL QUE VOCÊ MANDOU
const firebaseConfig = {
  apiKey: "AIzaSyD60jeX_HrJ6agEQTJE85zonqYwil4u5dc",
  authDomain: "shinobisync-ec4e9.firebaseapp.com",
  projectId: "shinobisync-ec4e9",
  storageBucket: "shinobisync-ec4e9.firebasestorage.app",
  messagingSenderId: "634559333749",
  appId: "1:634559333749:web:167b301b3a6c4fb0343f3c",
  measurementId: "G-1VTYT7BGEJ"
};

// Inicializa apenas uma vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function ShinobiHome() {
    // ... O restante do código da interface Naruto continua igual daqui para baixo

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function ShinobiHome() {
    const [myId, setMyId] = useState('');
    const [targetId, setTargetId] = useState('');
    const [status, setStatus] = useState('STATUS: AGUARDANDO_CHAKRA');
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    
    const pc = useRef(null);
    const localStream = useRef(null);

    const servers = {
        iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }]
    };

    useEffect(() => {
        const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
        setMyId(generatedId);

        async function initSystem() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStream.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                
                // Ouvir se alguém está me chamando (O Alerta que você amou)
                db.collection('calls').doc(generatedId).onSnapshot(async (snapshot) => {
                    const data = snapshot.data();
                    if (data?.offer && !pc.current) {
                        if (confirm("🚨 INVOCADOR DETECTADO! Aceitar chamado de Konoha?")) {
                            await answerCall(data.offer, generatedId);
                        }
                    }
                });
                setStatus('SISTEMA ONLINE');
            } catch (e) { setStatus('ERRO DE CÂMERA'); }
        }
        initSystem();
    }, []);

    const setupPeerConnection = (target) => {
        pc.current = new RTCPeerConnection(servers);
        
        localStream.current.getTracks().forEach(track => {
            pc.current.addTrack(track, localStream.current);
        });

        pc.current.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Lógica de Candidatos ICE (O segredo da conexão que você pediu)
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                db.collection('calls').doc(target).collection('candidates').add(event.candidate.toJSON());
            }
        };

        // Escutar candidatos do outro lado
        db.collection('calls').doc(myId).collection('candidates').onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                }
            });
        });
    };

    const callContact = async () => {
        if (targetId.length < 6) return alert("ID Inválido!");
        setStatus('INVOCANDO...');
        setupPeerConnection(targetId);

        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);

        await db.collection('calls').doc(targetId).set({ offer, from: myId });

        // Esperar a resposta (Answer)
        db.collection('calls').doc(targetId).onSnapshot(snap => {
            const data = snap.data();
            if (data?.answer && !pc.current.currentRemoteDescription) {
                pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                setStatus('CONECTADO');
            }
        });
    };

    const answerCall = async (offer, id) => {
        setupPeerConnection(id);
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        await db.collection('calls').doc(id).update({ answer });
        setStatus('CONECTADO');
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center bg-black">
            <Head>
                <title>SHINOBI CONNECT - ELITE</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>

            <style jsx global>{`
                body { background: radial-gradient(circle, #1a1a1d 0%, #000 100%); color: #fff; font-family: 'Courier New', monospace; }
                .terminal { border: 3px solid #ff9a00; background: rgba(0,0,0,0.9); box-shadow: 0 0 20px #ff9a00; position: relative; }
                .video-box { border: 2px solid #466b52; background: #000; position: relative; }
                video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
                .btn-jutsu { background: #cc0000; color: #fff; padding: 12px 30px; font-weight: 900; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); transition: 0.3s; border: none; }
                .btn-jutsu:hover { background: #ff9a00; box-shadow: 0 0 20px #ff9a00; transform: scale(1.05); }
                .sharingan { position: absolute; top: 10px; right: 10px; width: 30px; opacity: 0.5; animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="terminal w-full max-w-5xl p-6 rounded-xl overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/388/388531.png" className="sharingan" />
                
                <header className="flex justify-between border-b-2 border-orange-500/20 pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl text-orange-500 font-black">KONOHA_NET</h1>
                        <p className="text-[9px] text-green-500 font-bold italic tracking-widest underline">NÍVEL: ANBU OPERACIONAL</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Código de Invocação:</p>
                        <div className="text-4xl font-black text-red-600 drop-shadow-[0_0_5px_red]">{myId}</div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4 h-64">
                            <div className="video-box rounded-tl-3xl">
                                <video ref={localVideoRef} autoPlay playsinline muted />
                                <div className="absolute top-0 left-4 bg-orange-600 px-2 text-[9px] font-bold">EU</div>
                            </div>
                            <div className="video-box rounded-br-3xl">
                                <video ref={remoteVideoRef} autoPlay playsinline />
                                <div className="absolute top-0 left-4 bg-red-600 px-2 text-[9px] font-bold">ALVO</div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 border-l-4 border-orange-500">
                            <label className="text-[10px] text-orange-400 block mb-2 font-bold uppercase">Digitar ID do Contato:</label>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    maxLength="6" 
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    placeholder="000000" 
                                    className="bg-black border border-green-900 flex-1 text-3xl font-bold tracking-[10px] text-center text-orange-500 outline-none focus:border-orange-500"
                                />
                                <button onClick={callContact} className="btn-jutsu uppercase italic">Invocar</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-4 flex flex-col h-full rounded-lg">
                        <h3 className="text-xs font-bold text-orange-500 mb-4 italic border-b border-orange-500/20 pb-2 uppercase tracking-tighter">Pergaminho de Mensagens</h3>
                        <div className="flex-1 text-[11px] font-mono text-green-400 space-y-2 overflow-y-auto mb-4">
                            <div>// Chakra Network v4.2</div>
                            <div>// Escaneando arredores de Konoha...</div>
                            {status === 'CONECTADO' && <div className="text-white bg-green-900/30 p-1 border-l-2 border-green-500 animate-pulse">CANAL ESTABELECIDO!</div>}
                        </div>
                        <div className="flex gap-2 border-t border-white/10 pt-4 items-center">
                            <span className="text-xl opacity-40 hover:opacity-100 cursor-pointer">🎙️</span>
                            <input type="text" placeholder="Escreva um jutsu..." className="bg-transparent border-b border-orange-500/30 flex-1 outline-none text-xs p-1 focus:border-orange-500 transition-all" />
                            <button className="text-orange-500 font-bold text-xs hover:text-white transition">ENVIAR</button>
                        </div>
                    </div>
                </main>

                <footer className="mt-6 pt-2 border-t border-orange-500/10 flex justify-between text-[8px] font-bold text-zinc-600">
                    <span className="uppercase">Modo: P2P Direct Link</span>
                    <span className="text-orange-600 animate-pulse font-black">{status}</span>
                    <span className="uppercase">Konoha Encryption v4.0</span>
                </footer>
            </div>
        </div>
    );
}
