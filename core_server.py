import time
import math
import firebase_admin
from firebase_admin import credentials, firestore

# --- 1. CONFIGURAÇÃO DA CHAVE DO FIREBASE ---
# Certifique-se de que o arquivo 'serviceAccountKey.json' está na mesma pasta deste script!
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("🔥 NÚCLEO SERVER SHINOBI ATIVO COM SUCESSO! 🔥")
except Exception as e:
    print(f"❌ Erro ao carregar credenciais do Firebase: {e}")
    print("Verifique se o arquivo 'serviceAccountKey.json' está na mesma pasta do script.")
    exit()

# --- 2. CONFIGURAÇÃO DA BASE NINJA (VILA DA FOLHA) ---
# Altere essas coordenadas para a latitude e longitude da sua casa se quiser testar de verdade!
COORDS_VILA_DA_FOLHA = (-23.55052, -46.633308) # Exemplo: São Paulo Centro

def calcular_distancia_haversine(coord1, coord2):
    """Calcula a distância real em Km entre duas coordenadas geográficas"""
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    R = 6371.0 # Raio da Terra em km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

# --- 3. MONITORAMENTO EM TEMPO REAL (LISTEN TO FIRESTORE) ---
def processar_dados_firestore(doc_snapshot, changes, read_time):
    for change in changes:
        # Quando um documento é adicionado ou modificado
        if change.type.name in ["ADDED", "MODIFIED"]:
            data = change.document.to_dict()
            shinobi_id = data.get('shinobiId')
            name = data.get('name', 'Shinobi Anônimo')
            lat = data.get('latitude')
            lon = data.get('longitude')
            
            # Evita processar se as coordenadas estiverem vazias ou se for um loop da nossa própria análise
            if lat is None or lon is None or "aiAnalysis" in data and change.type.name == "MODIFIED":
                continue
                
            print(f"\n📡 Sinal de GPS recebido de {name} (ID: {shinobi_id})")
            print(f"📍 Coordenadas -> Lat: {lat} | Lon: {lon}")
            
            # --- PROCESSAMENTO INTELIGENTE (IA / LÓGICA DE GEOLOCALIZAÇÃO) ---
            distancia = calcular_distancia_haversine((lat, lon), COORDS_VILA_DA_FOLHA)
            
            # Define se está seguro ou exposto (ex: fora de um raio de 500 metros da base)
            limite_seguranca_km = 0.5 
            zona_segura = distancia <= limite_seguranca_km
            
            # Quadrante cardeal baseado na base
            setor_lat = "Norte" if lat >= COORDS_VILA_DA_FOLHA[0] else "Sul"
            setor_lon = "Leste" if lon >= COORDS_VILA_DA_FOLHA[1] else "Oeste"
            quadrante = f"Setor {setor_lat}-{setor_lon} (Fronteira da Folha)"
            
            # Recomendações de Jutsus personalizadas
            if zona_segura:
                status_alerta = "SINAL SEGURO - DENTRO DOS LIMITES DA VILA"
                recomendacao = "Chakra estável. Sistema de defesa ativo. Descanse na base ninja."
            else:
                status_alerta = "⚠️ ALERTA: FORA DO PERÍMETRO DE PROTEÇÃO!"
                recomendacao = "Cuidado! Fora da área de cobertura. Ative o Jutsu de Ocultação de Chakra (Meisagakure no Jutsu) imediatamente!"
            
            # Monta o pacote de análise
            analise_ia = {
                "quadranteNinja": quadrante,
                "zonaSegura": zona_segura,
                "distanciaProximoSinal": f"{distancia:.3f} km da Vila da Folha",
                "recomendacaoJutsu": recomendacao,
                "statusAlerta": status_alerta
            }
            
            # Grava a análise de volta no mesmo documento no Firebase
            try:
                doc_ref = db.collection('shinobis_location').document(shinobi_id)
                doc_ref.update({
                    "aiAnalysis": analise_ia
                })
                print(f"🧠 IA do Núcleo processou o território e atualizou o Firebase para {name}!")
                print(f"📊 {status_alerta} | Distância: {distancia:.3f} km")
            except Exception as err:
                print(f"❌ Erro ao atualizar análise no Firestore: {err}")

# Registra o ouvinte em tempo real na coleção 'shinobis_location'
print("Aguardando atualizações de GPS no mapa...")
doc_watch = db.collection('shinobis_location').on_snapshot(processar_dados_firestore)

# Mantém o script rodando no terminal do seu notebook
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 Desligando o Núcleo Server. Até a próxima missão!")
