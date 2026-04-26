import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// --- CONFIGURAÇÃO REAL DO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyD60jeX_HrJ6agEQTJE85zonqYwil4u5dc",
    authDomain: "shinobisync-ec4e9.firebaseapp.com",
    projectId: "shinobisync-ec4e9",
    storageBucket: "shinobisync-ec4e9.firebasestorage.app",
    messagingSenderId: "634559333749",
    appId: "1:634559333749:web:167b301b3a6c4fb0343f3c",
    measurementId: "G-1VTYT7BGEJ"
};

// Inicializa o Firebase apenas uma vez
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
                
                setStatus('SISTEMA ONLINE');

                // Ouvinte de Invocação (Alerta de Chamada)
                db.collection('calls').doc(generatedId).onSnapshot(async (snapshot) => {
                    const data = snapshot.data();
                    if (data?.offer && !pc.current) {
                        if (confirm(`🚨 INVOCADOR DETECTADO (ID: ${data.from})! Aceitar chamado?`)) {
                            await answerCall(data.offer, data.from);
                        }
                    }
                });
            } catch (e) { 
                setStatus('ERRO DE CÂMERA');
                console.error(e);
            }
        }
        initSystem();

        return () => {
            if (pc.current) pc.current.close();
        };
    }, []);

    const setupPeerConnection = (target) => {
        pc.current = new RTCPeerConnection(servers);
        
        localStream.current.getTracks().forEach(track => {
            pc.current.addTrack(track, localStream.current);
        });

        pc.current.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                db.collection('calls').doc(target).collection('candidates').add(event.candidate.toJSON());
            }
        };

        // Escutar candidatos ICE do outro Shinobi
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

        db.collection('calls').doc(targetId).onSnapshot(snap => {
            const data = snap.data();
            if (data?.answer && !pc.current.currentRemoteDescription) {
                pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                setStatus('CONECTADO');
            }
        });
    };

    const answerCall = async (offer, fromId) => {
        setupPeerConnection(fromId);
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        await db.collection('calls').doc(myId).update({ answer });
        setStatus('CONECTADO');
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center bg-black">
            <Head>
                <title>SHINOBI CONNECT - ANBU ELITE</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Permanent+Marker&display=swap');
                body { background: radial-gradient(circle, #1a1a1d 0%, #000000 100%); color: #fff; font-family: 'Orbitron', sans-serif; overflow: hidden; }
                .terminal { border: 2px solid #ff9a00; background: rgba(0,0,0,0.9); box-shadow: 0 0 30px rgba(255,154,0,0.3); position: relative; }
                .video-box { border: 2px solid #466b52; background: #000; overflow: hidden; position: relative; }
                video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
                .btn-jutsu { background: #cc0000; color: #fff; font-weight: 900; font-family: 'Permanent Marker', cursive; padding: 12px 30px; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); transition: 0.3s; cursor: pointer; border: none; text-transform: uppercase; }
                .btn-jutsu:hover { background: #ff9a00; box-shadow: 0 0 20px #ff9a00; transform: scale(1.05); }
                .sharingan { position: absolute; top: 15px; right: 15px; width: 35px; opacity: 0.6; animation: spin 5s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <div className="terminal w-full max-w-6xl p-6 rounded-2xl relative overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/388/388531.png" className="sharingan" alt="Sharingan" />
                
                <header className="flex flex-col md:flex-row justify-between items-center border-b-2 border-orange-500/20 pb-4 mb-6">
                    <div>
                        <h1 className="text-4xl text-orange-500 font-black tracking-tighter">KONOHA<span className="text-white">_NET</span></h1>
                        <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase mt-1">SISTEMA OPERACIONAL ANBU v4.2</p>
                    </div>
                    <div className="text-center md:text-right mt-3 md:mt-0">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Código de Invocação Atual:</p>
                        <div className="text-5xl font-black text-red-600 drop-shadow-[0_0_8px_red] tracking-tighter">{myId}</div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-4 h-80">
                            <div className="video-box rounded-tl-3xl shadow-lg">
                                <video ref={localVideoRef} autoPlay playsInline muted />
                                <div className="absolute top-0 left-4 bg-orange-600 px-3 text-[10px] font-bold uppercase">Meu Jutsu</div>
                            </div>
                            <div className="video-box rounded-br-3xl shadow-lg">
                                <video ref={remoteVideoRef} autoPlay playsInline />
                                <div className="absolute top-0 left-4 bg-red-600 px-3 text-[10px] font-bold uppercase">Alvo Detectado</div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 border-l-4 border-orange-500 rounded-lg shadow-inner">
                            <label className="text-[10px] text-orange-400 block mb-3 font-bold uppercase tracking-widest">Digitar ID do Shinobi Contato:</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input 
                                    type="text" 
                                    maxLength="6" 
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    placeholder="000000" 
                                    className="bg-black border-b-2 border-orange-500/30 flex-1 text-4xl font-black tracking-[10px] text-center text-orange-500 outline-none focus:border-orange-500 font-mono"
                                />
                                <button onClick={callContact} className="btn-jutsu text-xl">INVOCAR</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-5 flex flex-col h-full rounded-2xl shadow-xl">
                        <h3 className="text-xs font-bold text-orange-500 mb-4 italic border-b border-orange-500/20 pb-2 uppercase tracking-tighter">Pergaminho de Mensagens</h3>
                        <div className="flex-1 text-[11px] font-mono text-green-400 space-y-3 overflow-y-auto mb-4 pr-2">
                            <div className="bg-white/5 p-2 rounded">// Chakra Network v4.2 Ativa</div>
                            <div className="bg-white/5 p-2 rounded">// Escaneando arredores...</div>
                            {status === 'CONECTADO' && <div className="text-white bg-green-900/50 p-2 border-l-4 border-green-500 animate-pulse font-bold">// CANAL P2P ESTABELECIDO!</div>}
                        </div>
                        <div className="flex gap-2 border-t border-white/10 pt-4 items-center">
                            <input type="text" placeholder="Jutsu de mensagem..." className="bg-transparent border-b border-orange-500/30 flex-1 outline-none text-xs p-2" />
                            <button className="text-orange-500 font-bold text-xs hover:text-white uppercase">Enviar</button>
                        </div>
                    </div>
                </main>

                <footer className="mt-6 pt-3 border-t border-orange-500/10 flex flex-col md:flex-row justify-between text-[9px] font-bold text-zinc-600 tracking-widest gap-2">
                    <span className="uppercase">Modo: P2P Direct Chakra Link</span>
                    <span className="text-orange-600 animate-pulse font-black text-center">{status}</span>
                    <span className="uppercase md:text-right">Konoha Encryption v4.0 ANBU</span>
                </footer>
            </div>
        </div>
    );
}
