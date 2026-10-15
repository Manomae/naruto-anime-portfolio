import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialização do Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrkutAuthModal({ aberta, aoFechar, aoAutenticarSucesso }) {
  const [modo, setModo] = useState('cadastro'); // 'login' | 'cadastro'
  const [etapaCadastro, setEtapaCadastro] = useState(1); // 1: Conta | 2: Foto & Mascote 3D IA

  // Campos do Formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [codNome, setCodNome] = useState('');
  const [aniversario, setAniversario] = useState('');
  
  // Foto de Perfil
  const [tipoOrigemFoto, setTipoOrigemFoto] = useState('ia'); // 'pc' | 'url' | 'ia'
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=EmanuelOS');
  const [promptFotoIA, setPromptFotoIA] = useState('Cyberpunk Anime Avatar Neon 3D');

  // Mascote 3D
  const [nomeMascote, setNomeMascote] = useState('Cyber Robotoc 3D');
  const [promptMascoteIA, setPromptMascoteIA] = useState('Mini Robô Futurista Neon Azul e Magenta');
  const [mascotePreview, setMascotePreview] = useState('🤖');

  const [carregando, setCarregando] = useState(false);

  if (!aberta) return null;

  // --- LOGIN SOCIAL (OAuth Supabase) ---
  const handleLoginSocial = async (provedor) => {
    try {
      setCarregando(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provedor, // 'google', 'facebook', etc.
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : ''
        }
      });
      if (error) throw error;
    } catch (err) {
      alert(`Erro ao conectar com ${provedor}: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  // --- GERAR FOTO DE PERFIL COM IA ---
  const gerarFotoPerfilIA = () => {
    if (!promptFotoIA.trim()) return;
    const urlGerada = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(promptFotoIA)}`;
    setAvatarUrl(urlGerada);
  };

  // --- GERAR MASCOTE 3D COM IA ---
  const gerarMascote3DIA = () => {
    if (!promptMascoteIA.trim()) return;
    const mascotesIcones = ['🤖', '👾', '🐕', '🦊', '🐉', '🛸'];
    const sorteado = mascotesIcones[Math.floor(Math.random() * mascotesIcones.length)];
    setMascotePreview(sorteado);
    alert(`⚡ Mascote 3D criado com o Prompt IA: "${promptMascoteIA}"`);
  };

  // --- UPLOAD DE ARQUIVO LOCAL ---
  const handleUploadArquivoLocal = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SUBMIT DO CADASTRO / LOGIN EMAIL ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (modo === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        alert("⚡ Login efetuado no Orkut Social 3D!");
        if (aoAutenticarSucesso) aoAutenticarSucesso(data.user);
        aoFechar();
      } else {
        // Cadastro Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { nome, apelido, codNome, aniversario, avatarUrl }
          }
        });
        if (error) throw error;

        // Inserir Perfil na Tabela
        if (data.user) {
          await supabase.from('profiles').insert([{
            id: data.user.id,
            nome,
            apelido,
            cod_nome: codNome,
            aniversario,
            avatar_url: avatarUrl,
            provedor_login: 'email'
          }]);

          // Inserir Mascote 3D
          await supabase.from('mascotes_3d').insert([{
            user_id: data.user.id,
            nome_mascote: nomeMascote,
            prompt_ia: promptMascoteIA,
            avatar_mascote_url: avatarUrl,
            ativo: true
          }]);

          alert("🎉 Conta e Mascote 3D salvos com sucesso no Supabase!");
          if (aoAutenticarSucesso) aoAutenticarSucesso(data.user);
          aoFechar();
        }
      }
    } catch (err) {
      alert(`Erro no processo de ${modo}: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }}>
      <div style={{
        width: '440px', maxWidth: '92vw', backgroundColor: 'rgba(8, 15, 30, 0.96)',
        border: '2px solid #00f0ff', borderRadius: '16px', padding: '20px',
        boxShadow: '0 0 35px rgba(0,240,255,0.3)', color: '#fff', position: 'relative'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00f0ff', paddingBottom: '10px', marginBottom: '14px' }}>
          <span style={{ fontSize: '14px', color: '#00f0ff', fontWeight: 'bold' }}>
            {modo === 'login' ? '🔑 ACESSAR ORKUT SOCIAL 3D' : `📝 NOVO CADASTRO (ETAPA ${etapaCadastro}/2)`}
          </span>
          <button onClick={aoFechar} style={{ background: 'none', border: 'none', color: '#ed2580', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>

        {/* Botoes de Login Social */}
        {modo === 'login' && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Conectar via Redes Sociais:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => handleLoginSocial('google')} style={{ padding: '8px', backgroundColor: '#4285f4', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Google</button>
              <button onClick={() => handleLoginSocial('facebook')} style={{ padding: '8px', backgroundColor: '#1877f2', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>📘 Facebook</button>
            </div>
            <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '10px', color: '#94a3b8' }}>--- OU EMAIL ---</div>
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {modo === 'login' ? (
            <>
              <input type="email" required placeholder="Seu E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
              <input type="password" required placeholder="Sua Senha" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
            </>
          ) : (
            <>
              {etapaCadastro === 1 && (
                <>
                  <input type="text" required placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  <input type="text" required placeholder="Apelido no Orkut" value={apelido} onChange={(e) => setApelido(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  <input type="text" required placeholder="Cód/Nome Único (@seu_cod)" value={codNome} onChange={(e) => setCodNome(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  <input type="text" required placeholder="Aniversário (ex: 24/01)" value={aniversario} onChange={(e) => setAniversario(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  <input type="email" required placeholder="E-mail de Acesso" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  <input type="password" required placeholder="Sua Senha" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ padding: '8px', fontSize: '11px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                  
                  <button type="button" onClick={() => setEtapaCadastro(2)} style={{ padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                    Avançar para Foto & Mascote 3D ➔
                  </button>
                </>
              )}

              {etapaCadastro === 2 && (
                <>
                  <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #ed2580' }}>
                    <span style={{ fontSize: '10px', color: '#ed2580', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🎨 Configurar Avatar & Mascote 3D</span>
                    <input type="file" accept="image/*" onChange={handleUploadArquivoLocal} style={{ fontSize: '10px', marginBottom: '6px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" placeholder="Prompt Foto IA" value={promptFotoIA} onChange={(e) => setPromptFotoIA(e.target.value)} style={{ flexGrow: 1, padding: '6px', fontSize: '10px', backgroundColor: '#09090b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
                      <button type="button" onClick={gerarFotoPerfilIA} style={{ padding: '6px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>Gerar IA</button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff' }}>
                    <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🤖 Mascote Virtual ({mascotePreview})</span>
                    <input type="text" placeholder="Nome do Mascote" value={nomeMascote} onChange={(e) => setNomeMascote(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '10px', backgroundColor: '#09090b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', marginBottom: '6px' }} />
                    <button type="button" onClick={gerarMascote3DIA} style={{ width: '100%', padding: '6px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Gerar Mascote IA</button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button type="button" onClick={() => setEtapaCadastro(1)} style={{ padding: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}>Voltar</button>
                    <button type="submit" disabled={carregando} style={{ flexGrow: 1, padding: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {carregando ? 'Salvando...' : 'Finalizar Cadastro & Salvar'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {modo === 'login' && (
            <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
              {carregando ? 'Entrando...' : 'Entrar no Orkut'}
            </button>
          )}
        </form>

        {/* Alternar Modo */}
        <button onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setEtapaCadastro(1); }} style={{ background: 'none', border: 'none', color: '#ed2580', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '14px', width: '100%', textAlign: 'center' }}>
          {modo === 'login' ? 'Ainda não tem conta? Criar nova conta!' : 'Já tem uma conta? Fazer Login!'}
        </button>
      </div>
    </div>
  );
}
