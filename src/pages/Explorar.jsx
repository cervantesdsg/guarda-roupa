import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, Fade, go, ProductCard, Reveal } from '../components/ui.jsx'
import { CATEGORIES, matchScore, products, STYLES, STYLE_IDS } from '../data.js'

const SORTS = [
  ['match', 'Mais a minha cara'],
  ['asc', 'Menor preço'],
  ['desc', 'Maior preço'],
]

export default function Explorar({ profile, params }) {
  const cat = CATEGORIES.includes(params.cat) ? params.cat : 'Todas'
  const [style, setStyle] = useState(profile ? 'meu' : 'todos')
  const [origin, setOrigin] = useState('todas')
  const [sort, setSort] = useState(profile ? 'match' : 'asc')

  const list = useMemo(() => {
    const weights =
      style === 'meu' && profile ? profile.pct
        : style !== 'todos' && style !== 'meu' ? Object.fromEntries(STYLE_IDS.map((id) => [id, id === style ? 1 : 0]))
        : profile?.pct
    let l = products
      .filter((p) => cat === 'Todas' || p.cat === cat)
      .filter((p) => origin === 'todas' || (origin === 'br' ? !p.intl && !p.ref : p.intl))
      .map((p) => ({ ...p, score: weights ? matchScore(p, weights) : null }))
    if (style !== 'todos') l = l.filter((p) => p.score >= 0.55)
    if (sort === 'match' && weights) l.sort((a, b) => b.score - a.score)
    if (sort === 'asc') l.sort((a, b) => (a.priceBRL ?? 1e9) - (b.priceBRL ?? 1e9))
    if (sort === 'desc') l.sort((a, b) => (b.priceBRL ?? -1) - (a.priceBRL ?? -1))
    return l
  }, [cat, style, origin, sort, profile])

  const filterKey = `${cat}-${style}-${origin}-${sort}`

  return (
    <div className="page-scroll">
      <div className="explore">
        <Reveal className="title-xl">Explorar <em>tudo</em></Reveal>
        <Fade delay={0.3} style={{ marginTop: 40 }}>
          <div className="filters">
            <span className="lbl">Categoria</span>
            {['Todas', ...CATEGORIES].map((c) => (
              <button key={c} className={`chip ${c === cat ? 'on' : ''}`}
                onClick={() => go(c === 'Todas' ? '/explorar' : `/explorar?cat=${encodeURIComponent(c)}`)}>
                {c}
              </button>
            ))}
          </div>
          <div className="filters">
            <span className="lbl">Estética</span>
            {profile && <button className={`chip ${style === 'meu' ? 'on' : ''}`} onClick={() => setStyle('meu')}>Meu estilo</button>}
            <button className={`chip ${style === 'todos' ? 'on' : ''}`} onClick={() => setStyle('todos')}>Todas</button>
            {STYLE_IDS.map((id) => (
              <button key={id} className={`chip ${style === id ? 'on' : ''}`} onClick={() => setStyle(id)}>{STYLES[id].name}</button>
            ))}
          </div>
          <div className="filters">
            <span className="lbl">Origem</span>
            {[['todas', 'Todas'], ['br', 'Lojas no Brasil'], ['intl', 'Internacional']].map(([k, l]) => (
              <button key={k} className={`chip ${origin === k ? 'on' : ''}`} onClick={() => setOrigin(k)}>{l}</button>
            ))}
            <span style={{ flex: 1 }} />
            {SORTS.filter(([k]) => k !== 'match' || profile || style !== 'todos').map(([k, l]) => (
              <button key={k} className={`link-u ${sort === k ? 'on' : 'muted'}`} style={{ marginLeft: 14 }} onClick={() => setSort(k)}>{l}</button>
            ))}
          </div>
        </Fade>

        <div className="muted" style={{ marginTop: 32 }}>{list.length} peças</div>
        <AnimatePresence mode="wait">
          <motion.div key={filterKey} className="grid" style={{ marginTop: 16 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            {list.map((p) => (
              <ProductCard key={p.id} p={p} showMatch={style !== 'todos' && sort === 'match'} />
            ))}
          </motion.div>
        </AnimatePresence>
        {!list.length && <p className="title-m muted" style={{ marginTop: 40 }}>Nenhuma peça com esses filtros.</p>}
      </div>
    </div>
  )
}
