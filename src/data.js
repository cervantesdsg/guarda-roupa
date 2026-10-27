import { looks } from './looks.js'
import { products } from './products.js'

export { looks, products }

export const STYLE_IDS = ['classico', 'bold', 'contemporaneo', 'natural']

export const STYLES = {
  classico: {
    name: 'Clássico',
    short: 'Atemporal, alinhado, sem esforço aparente.',
    desc: 'Peças que nunca saem de moda: camiseta branca, polo de tricô, chino, camisa de algodão, jaqueta Harrington, mocassim. Cores neutras, caimento certo e zero exagero.',
    pieces: ['Polo de tricô', 'Chino bege', 'Camisa Oxford', 'Pullover gola V', 'Mocassim', 'Harrington'],
    palette: ['#1f2a3a', '#c9b79c', '#f4f1ea', '#6b4a32'],
    taste: 'Você valoriza o que dura. Prefere qualidade a novidade, gosta de se sentir bem-vestido sem chamar atenção e confia no básico bem feito: bom tecido, caimento certo e cores que conversam entre si.',
    contexts: [
      ['Trabalho', 'Polo de tricô ou camisa com chino e mocassim resolvem reunião, escritório e almoço com cliente.'],
      ['Jantar e eventos', 'Blazer sem gravata sobre camiseta ou camisa: arrumado sem parecer fantasiado.'],
      ['Família e ocasiões especiais', 'Pullover gola V, calça de alfaiataria e sapato de couro — impossível errar.'],
    ],
    mix: 'Traga uma peça clássica — um mocassim, um blazer, uma camisa Oxford — para dar acabamento ao seu estilo principal.',
  },
  bold: {
    name: 'Bold',
    short: 'Preto, couro, atitude.',
    desc: 'Raiz rock e rebelde: jaqueta de couro, jeans escuro ou lavado, camiseta de banda, coturno e Chelsea. Mais contraste, mais textura, mais presença.',
    pieces: ['Jaqueta de couro', 'Jeans reto', 'Camiseta preta', 'Overshirt xadrez', 'Coturno', 'Chelsea'],
    palette: ['#141414', '#3a3a3a', '#7a1f1f', '#b8b2a6'],
    taste: 'Você gosta de presença. Roupa, para você, é atitude: contraste, preto, couro e textura. Prefere ser lembrado a passar despercebido, e se sente mais você quando o look tem um pouco de rebeldia.',
    contexts: [
      ['Noite e shows', 'Jaqueta de couro, camiseta preta e jeans escuro: o uniforme que nunca falha.'],
      ['Encontros', 'Uma Chelsea ou um coturno com o seu look de sempre muda a energia na hora.'],
      ['Fim de semana na cidade', 'Overshirt xadrez aberta sobre camiseta e jeans reto.'],
    ],
    mix: 'Use uma peça bold — a jaqueta de couro, a bota, o preto total — quando quiser mais personalidade sem abandonar o seu estilo.',
  },
  contemporaneo: {
    name: 'Contemporâneo',
    short: 'Volume, cor e referência de rua.',
    desc: 'Streetwear com repertório: calças amplas, overshirts utilitárias, cardigãs, peças com cor e tênis retrô. Proporções novas e mistura de esporte com alfaiataria.',
    pieces: ['Calça wide', 'Overshirt utilitária', 'Jaqueta com cor', 'Tênis retrô', 'Bomber', 'Boné'],
    palette: ['#2d4a8a', '#e3a21a', '#5b6b3c', '#efe9dc'],
    taste: 'Você gosta de referência e de novidade. Presta atenção em proporção, cor e no que está acontecendo na rua. Mistura esporte com alfaiataria sem medo e trata a roupa como forma de expressão criativa.',
    contexts: [
      ['Saídas com amigos', 'Calça mais ampla, camiseta com estampa e tênis retrô: confortável e com repertório.'],
      ['Viagens urbanas', 'Overshirt utilitária e bomber resolvem o dia inteiro andando pela cidade.'],
      ['Trabalho criativo ou informal', 'Blazer desestruturado com camiseta e tênis — moderno sem ser careta.'],
    ],
    mix: 'Uma peça contemporânea — tênis retrô, calça wide, jaqueta com cor — atualiza o look e tira o ar de "sempre igual".',
  },
  natural: {
    name: 'Natural',
    short: 'Linho, tons de terra, conforto.',
    desc: 'Leveza e fibras naturais: camisa de linho, regata, tricô aberto, calças fluidas, bermuda, sandália e espadrille. Tons terrosos e uma vibe de férias permanente.',
    pieces: ['Camisa de linho', 'Calça fluida', 'Tricô leve', 'Bermuda', 'Sandália', 'Espadrille'],
    palette: ['#a07a4f', '#e8dcc6', '#6d7350', '#f6f2ea'],
    taste: 'Você prioriza conforto e leveza. Gosta de fibras naturais, de tons de terra e de roupas que acompanham o corpo e o clima. Seu estilo transmite tranquilidade — como se estivesse sempre de férias, mas com cuidado.',
    contexts: [
      ['Fim de semana e praia', 'Camisa de linho aberta, bermuda e sandália ou espadrille.'],
      ['Almoços e eventos ao ar livre', 'Calça fluida clara com tricô leve ou camisa de linho.'],
      ['Home office e dias tranquilos', 'Regata ou camiseta texturizada com calça confortável.'],
    ],
    mix: 'Troque uma peça do seu look por uma versão em linho ou tricô leve nos dias quentes ou mais descontraídos.',
  },
}

export const PROFILE_TYPES = [
  'Uma estética predominante',
  'Uma estética predominante + uma complementar',
  'Mistura de estéticas',
]

export const CATEGORIES = [
  'Camisetas', 'Polos', 'Tricôs', 'Camisas', 'Camisas sociais', 'Jaquetas',
  'Blazers', 'Calças', 'Alfaiataria', 'Tênis', 'Botas', 'Sapatos',
]

// 8 rodadas: cada uma mostra um look de cada estética, em ordem embaralhada.
export const QUIZ_ROUNDS = 8
export function buildQuiz(seed = Date.now()) {
  let s = seed % 2147483647
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647
  const pools = Object.fromEntries(
    STYLE_IDS.map((id) => [id, [...looks[id]].sort(() => rand() - 0.5)])
  )
  return Array.from({ length: QUIZ_ROUNDS }, (_, i) =>
    STYLE_IDS.map((id) => ({ style: id, src: pools[id][i % pools[id].length] })).sort(() => rand() - 0.5)
  )
}

export function computeProfile(picks) {
  const counts = Object.fromEntries(STYLE_IDS.map((id) => [id, 0]))
  picks.forEach((p) => p && counts[p]++)
  const total = picks.filter(Boolean).length
  const pct = Object.fromEntries(STYLE_IDS.map((id) => [id, total ? counts[id] / total : 0.25]))
  const ranked = [...STYLE_IDS].sort((a, b) => pct[b] - pct[a])
  const [main, second] = ranked
  let type = 2
  if (pct[main] >= 0.85) type = 0
  else if (pct[main] + pct[second] >= 0.75 && pct[second] >= 0.2) type = 1
  return { pct, ranked, main, second: type === 0 ? null : second, type }
}

// Similaridade de cosseno entre o perfil (percentuais) e as notas de estilo da peça.
export function matchScore(product, pct) {
  const norm = (v) => Math.sqrt(STYLE_IDS.reduce((a, id) => a + v[id] ** 2, 0)) || 1
  const dot = STYLE_IDS.reduce((a, id) => a + pct[id] * product.styles[id], 0)
  return dot / (norm(pct) * norm(product.styles))
}

export function recommend(pct, cat, limit) {
  const list = products
    .filter((p) => !cat || p.cat === cat)
    .map((p) => ({ ...p, score: matchScore(p, pct) }))
    .sort((a, b) => b.score - a.score)
  return limit ? list.slice(0, limit) : list
}

const KEY = 'guarda-roupa:perfil'
export function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  } catch {
    return null
  }
}
export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {}
}
