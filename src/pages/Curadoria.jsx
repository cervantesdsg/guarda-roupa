import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import HScroll from '../components/HScroll.jsx'
import { EASE, Fade, go, ProductCard, Reveal } from '../components/ui.jsx'
import { CATEGORIES, products, recommend, STYLES } from '../data.js'

const H = 'calc(100vh - var(--frame-top) - var(--frame-bottom))'
const PER_CATEGORY = 8

export default function Curadoria({ profile, params }) {
  const pct = profile?.pct ?? { classico: 0.25, bold: 0.25, contemporaneo: 0.25, natural: 0.25 }
  const cat = CATEGORIES.includes(params.cat) ? params.cat : CATEGORIES[0]
  const idx = CATEGORIES.indexOf(cat)
  const next = CATEGORIES[(idx + 1) % CATEGORIES.length]
  const items = recommend(pct, cat, PER_CATEGORY)
  const total = products.filter((p) => p.cat === cat).length
  const label = profile
    ? `${STYLES[profile.main].name}${profile.second ? ' + ' + STYLES[profile.second].name : ''}`
    : null

  return (
    <>
      <CategoryNav cat={cat} />
      <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
        <HScroll resetKey={cat}>
          <section className="panel text" style={{ width: 'min(44vw, 520px)' }}>
            {label && (
              <Fade>
                <div className="kicker" style={{ marginBottom: 18 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}</strong>
                </div>
              </Fade>
            )}
            <Reveal className="title-xl" delay={0.1}>{cat}</Reveal>
            {!profile && (
              <Fade delay={0.4} style={{ marginTop: 28 }}>
                <a className="btn" href="#/">Descobrir meu estilo <span className="arr">→</span></a>
              </Fade>
            )}
          </section>

          {items.map((p) => (
            <section className="panel" key={p.id}>
              <ProductCard p={p} width={`min(calc(${H} * 0.56), 78vw)`} showMatch={!!profile} />
            </section>
          ))}

          <section className="panel text" style={{ width: 'min(52vw, 560px)', paddingLeft: '6vw' }}>
            <div className="title-l" style={{ marginBottom: 28 }}>
              {total} itens em<br /><em>{cat.toLowerCase()}</em>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn" href={`#/explorar?cat=${encodeURIComponent(cat)}`}>Explorar todas <span className="arr">→</span></a>
              <a className="btn solid" href={`#/curadoria?cat=${encodeURIComponent(next)}`}>Próxima: {next} <span className="arr">→</span></a>
            </div>
          </section>
        </HScroll>
      </motion.div>
    </>
  )
}

// Barra de categorias que rola para o lado: setas e bordas esmaecidas
// deixam claro que há mais categorias além das visíveis.
function CategoryNav({ cat }) {
  const nav = useRef(null)
  const [edges, setEdges] = useState({ left: false, right: false })
  useEffect(() => {
    const el = nav.current
    const update = () =>
      setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', update)
    }
  }, [])

  // mantém a categoria ativa sempre visível
  useEffect(() => {
    nav.current.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [cat])

  const slide = (dir) => nav.current.scrollBy({ left: dir * nav.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <div className="cat-nav-wrap">
      <button className="cat-arrow" onClick={() => slide(-1)} disabled={!edges.left} aria-label="Ver categorias anteriores">←</button>
      <nav ref={nav} className={`cat-nav ${edges.left ? 'fade-l' : ''} ${edges.right ? 'fade-r' : ''}`} aria-label="Categorias">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${c === cat ? 'on' : ''}`} onClick={() => go(`/curadoria?cat=${encodeURIComponent(c)}`)}>
            {c}
          </button>
        ))}
      </nav>
      <button className="cat-arrow" onClick={() => slide(1)} disabled={!edges.right} aria-label="Ver mais categorias">→</button>
    </div>
  )
}
