import { motion } from 'framer-motion'
import HScroll from '../components/HScroll.jsx'
import { EASE, Fade, Reveal } from '../components/ui.jsx'
import { CATEGORIES, looks, PROFILE_TYPES, STYLES } from '../data.js'

const H = 'calc(100vh - var(--frame-top) - var(--frame-bottom))'
const lookW = `min(calc(${H} * 0.42), 72vw)`
const firstCat = `#/curadoria?cat=${encodeURIComponent(CATEGORIES[0])}`

function Look({ src }) {
  return (
    <section className="panel">
      <motion.div
        className="frame"
        style={{ width: lookW }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <img src={src} alt="" draggable={false} style={{ transform: 'none' }} />
      </motion.div>
    </section>
  )
}

export default function Result({ profile }) {
  if (!profile) {
    return (
      <div className="quiz" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div className="title-l">Você ainda não fez o teste.</div>
        <a className="btn solid" href="#/" style={{ marginTop: 28 }}>Descobrir meu estilo <span className="arr">→</span></a>
      </div>
    )
  }
  const { pct, ranked, main, type } = profile
  const m = STYLES[main]
  const others = ranked.filter((id) => id !== main && pct[id] > 0)

  return (
    <HScroll>
      <section className="panel text" style={{ width: 'min(max(56vw, 340px), 720px)' }}>
        <Fade><div className="kicker" style={{ marginBottom: 18 }}>{PROFILE_TYPES[type]}</div></Fade>
        <Reveal className="title-l" delay={0.1}>Seu estilo é</Reveal>
        <Reveal className="title-xl" delay={0.2}><em>{m.name}</em></Reveal>
        <Fade delay={0.45} style={{ marginTop: 26 }}>
          <p className="title-m" style={{ fontStyle: 'italic' }}>{m.short}</p>
          <p className="lede" style={{ marginTop: 16, maxWidth: '46ch' }}>{m.taste}</p>
        </Fade>
        <Fade delay={0.6} style={{ marginTop: 30 }}>
          <div className="bars">
            {ranked.map((id, i) => (
              <div className="bar" key={id}>
                <span>{STYLES[id].name}</span>
                <span className="track">
                  <motion.span
                    className="fill"
                    style={{ width: `${pct[id] * 100}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.7 + i * 0.1, ease: EASE }}
                  />
                </span>
                <span className="muted" style={{ textAlign: 'right' }}>{Math.round(pct[id] * 100)}%</span>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {looks[main].slice(0, 3).map((src) => <Look key={src} src={src} />)}

      {others.map((id) => {
        const s = STYLES[id]
        return [
          <section key={id} className="panel text" style={{ width: 'min(max(40vw, 320px), 500px)', paddingLeft: '5vw' }}>
            <div className="kicker">Também apareceu em você · {Math.round(pct[id] * 100)}%</div>
            <h2 className="title-l" style={{ margin: '14px 0 16px' }}>{s.name}</h2>
            <p className="lede">{s.mix}</p>
            <dl className="ctx-list">
              {s.contexts.map(([ctx, how]) => (
                <div key={ctx}>
                  <dt>{ctx}</dt>
                  <dd className="muted">{how}</dd>
                </div>
              ))}
            </dl>
          </section>,
          <Look key={`${id}-look`} src={looks[id][1]} />,
        ]
      })}

      <section className="panel text" style={{ width: 'min(max(50vw, 320px), 560px)', paddingLeft: '6vw' }}>
        <div className="title-l" style={{ marginBottom: 28 }}>Sua curadoria,<br /><em>por categoria.</em></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn solid" href={firstCat}>Ver minha curadoria <span className="arr">→</span></a>
          <a className="btn" href="#/">Refazer teste</a>
        </div>
      </section>
    </HScroll>
  )
}
