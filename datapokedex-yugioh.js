// Base de dados de Pokémons para a Pokédex
export const pokedexData = [
  { id: 1, nome: "Pikachu", tipo: "Elétrico", modelo3D: "pikachu.gltf", icone: "⚡" },
  { id: 2, nome: "Charizard", tipo: "Fogo / Voador", modelo3D: "charizard.gltf", icone: "🔥" },
  { id: 3, nome: "Mewtwo", tipo: "Psíquico", modelo3D: "mewtwo.gltf", icone: "🔮" },
  { id: 4, nome: "Lucario", tipo: "Lutador / Aço", modelo3D: "lucario.gltf", icone: "⚔️" },
  { id: 5, nome: "Gengar", tipo: "Fantasma / Veneno", modelo3D: "gengar.gltf", icone: "👻" },
];

// Mundos, Personagens e Monstros de Yu-Gi-Oh!
export const yugiohWorldData = {
  mundos: [
    { id: "dm", nome: "Yu-Gi-Oh! Duel Monsters (Clássico)", tema: "Egito Antigo & Cidade do Domínio" },
    { id: "gx", nome: "Yu-Gi-Oh! GX", tema: "Academia de Duelos" },
    { id: "5ds", nome: "Yu-Gi-Oh! 5D's", tema: "Neo Domino City & D-Wheels" },
    { id: "zexal", nome: "Yu-Gi-Oh! ZEXAL", tema: "Mundo Astral & Cidade de Heartland" }
  ],
  personagens: [
    { id: "yugi", nome: "Yami Yugi / Yugi Muto", deckPrincipal: "Mago Negro" },
    { id: "kaiba", nome: "Seto Kaiba", deckPrincipal: "Dragão Branco de Olhos Azuis" },
    { id: "jaden", nome: "Jaden Yuki", deckPrincipal: "E-HERO (Herói do Elemento)" },
    { id: "yusei", nome: "Yusei Fudo", deckPrincipal: "Dragão Poeira de Estrela" }
  ]
};