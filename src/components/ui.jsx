import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { progress } from '../progress.js'
import { STYLES, STYLE_IDS } from '../data.js'

export const EASE = [0.22, 1, 0.36, 1]

// ---------- roteamento por hash ----------
export function useRoute() {
  const read = () => (window.location.hash.replace(/^#/, '') || '/').split('?')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const [path, query = ''] = route
  return { path, params: Object.fromEntries(new URLSearchParams(query)) }
}
export const go = (to) => (window.location.hash = to)

// ---------- moldura fixa ----------
export function Chrome({ tl, bl, onMenu, showProgress }) {
  const bar = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(
    () =>
      progress.subscribe((v) => {
        setVisible(v !== null)
        if (bar.current && v !== null) bar.current.style.transform = `scaleX(${Math.max(0.04, v)})`
      }),
    []
  )
  return (
    <div className="chrome">
      <button className="tr avatar-btn" onClick={onMenu} aria-label="Abrir menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
        </svg>
      </button>
      <div className="bl">{tl}</div>
      <div className="br">{bl}</div>
      {showProgress && visible && (
        <div className="progress"><i ref={bar} /></div>
      )}
      <a className="logo" href="#/" aria-label="Manual do Guarda-Roupa Masculino — início">
        <img src="/logo.png" alt="Manual do Guarda-Roupa Masculino" />
      </a>
    </div>
  )
}

// ---------- menu tela cheia ----------
export function Menu({ open, onClose, hasProfile }) {
  const items = [
    ['Teste de estilo', '#/'],
    hasProfile && ['Meu estilo', '#/resultado'],
    ['Curadoria', '#/curadoria'],
    ['Explorar tudo', '#/explorar'],
  ].filter(Boolean)
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <button className="close link-u" onClick={onClose}>Fechar</button>
          <nav>
            {items.map(([label, href], i) => (
              <a key={href} href={href} onClick={onClose}>
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: EASE }}
                >
                  {label}
                </motion.span>
              </a>
            ))}
          </nav>
          <div className="foot">
            <img src="/logo.png" alt="Manual do Guarda-Roupa Masculino" style={{ height: 34, width: 'auto' }} />
            <a className="link-u" href="mailto:correioanticool@gmail.com">correioanticool@gmail.com</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------- intro: as quatro estéticas giram em torno da marca ----------
export function Intro({ onDone }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i >= STYLE_IDS.length) {
      const t = setTimeout(onDone, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setI(i + 1), 620)
    return () => clearTimeout(t)
  }, [i, onDone])
  return (
    <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <motion.div
        className="mark"
        style={{ position: 'absolute', top: 'calc(50% - 150px)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <img src="/logo.png" alt="Manual do Guarda-Roupa Masculino" style={{ width: 'min(300px, 70vw)' }} />
      </motion.div>
      <AnimatePresence>
        {i < STYLE_IDS.length && (
          <motion.div
            key={i}
            className="word"
            initial={{ opacity: 0, rotate: -14, x: '-50%', y: '-30%', filter: 'blur(6px)' }}
            animate={{ opacity: 1, rotate: -4, x: '-50%', y: '-50%', filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotate: 8, x: '-50%', y: '-80%', filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {STYLES[STYLE_IDS[i]].name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Texto que sobe linha a linha.
export function Reveal({ children, delay = 0, as = 'div', className, style }) {
  const M = motion[as]
  return (
    <div style={{ overflow: 'hidden' }}>
      <M
        className={className}
        style={style}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </M>
    </div>
  )
}

export function Fade({ children, delay = 0, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

// ---------- card de peça ----------
// Peça aberta no painel de detalhes, publicada fora do React como o progresso.
const detailSubs = new Set()
export const openProduct = (p) => detailSubs.forEach((fn) => fn(p))

// Entrada simples: só um fade curto quando o card aparece, sem recorte nem parallax.
// O card inteiro abre os detalhes; a ida para a loja acontece só dentro do painel.
export function ProductCard({ p, width, showMatch = true }) {
  const colors = [p.comp, p.colors && '+ cores'].filter(Boolean).join(' · ')
  return (
    <motion.article
      className="p-card"
      style={{ width }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes: ${p.name}`}
      onClick={() => openProduct(showMatch ? p : { ...p, score: null })}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openProduct(showMatch ? p : { ...p, score: null }))}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="frame" style={p.ref ? { background: '#fff' } : undefined}>
        <img src={p.img} alt={p.name} loading="lazy" draggable={false}
          style={p.ref ? { transform: 'none', objectFit: 'contain', objectPosition: 'center', padding: '12%' } : { transform: 'none' }} />
        {showMatch && p.score != null && (
          <span className="match"><i className="dot" />{Math.round(p.score * 100)}% seu estilo</span>
        )}
        {p.ref && <span className="ref-badge">referência</span>}
      </div>
      <div className="p-meta">
        <div className="p-row">
          <span className="name">{p.name}</span>
          {p.price && <span className="price">{p.price}</span>}
        </div>
        <div className="p-row">
          <span>{p.brand}{p.intl && <span className="muted"> · internacional</span>}</span>
          {colors && <span className="muted comp">{colors}</span>}
        </div>
      </div>
    </motion.article>
  )
}

// ---------- painel de detalhes ----------
export function ProductDetail() {
  const [p, setP] = useState(null)
  useEffect(() => {
    detailSubs.add(setP)
    return () => detailSubs.delete(setP)
  }, [])
  useEffect(() => {
    if (!p) return
    const k = (e) => e.key === 'Escape' && setP(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [p])
  const close = () => setP(null)
  const rows = p && [
    ['Categoria', p.cat],
    ['Marca', p.brand],
    ['Composição', p.comp],
    ['Cores', p.colors ? 'Disponível em outras cores' : null],
    ['Onde comprar', p.ref ? null : p.intl ? 'Loja internacional (Europa, Reino Unido ou EUA)' : 'Loja no Brasil'],
  ].filter(([, v]) => v)
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }} onClick={close}>
          <motion.aside
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-label={p.name}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <button className="close link-u" onClick={close}>Fechar</button>
            <div className="detail-img" style={p.ref ? { background: '#fff' } : undefined}>
              <img src={p.img} alt={p.name} style={p.ref ? { objectFit: 'contain', padding: '10%' } : undefined} />
              {p.score != null && <span className="match"><i className="dot" />{Math.round(p.score * 100)}% seu estilo</span>}
            </div>
            <div className="detail-body">
              <div className="p-row">
                <h2 className="title-m">{p.name}</h2>
                {p.price && <span className="title-m">{p.price}</span>}
              </div>
              {p.note && <p className="detail-note">“{p.note}”</p>}
              <dl className="detail-list">
                {rows.map(([k, v]) => (
                  <div key={k}><dt className="muted">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              {p.url ? (
                <a className="btn solid detail-cta" href={p.url} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => {
                    // A loja sempre abre em outra aba; o site nunca é substituído.
                    const w = window.open(p.url, '_blank')
                    if (w) {
                      w.opener = null
                      e.preventDefault()
                    }
                  }}>
                  Ver na loja {p.brand} <span className="arr">↗</span>
                </a>
              ) : null}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Page({ children, k }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
