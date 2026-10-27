import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, go } from '../components/ui.jsx'
import { buildQuiz, computeProfile, QUIZ_ROUNDS, saveProfile, STYLES } from '../data.js'

const PROMPTS = [
  'Qual desses você vestiria hoje?',
  'Num fim de semana sem compromisso…',
  'Um jantar com amigos.',
  'Qual combina mais com você?',
  'Viagem de três dias. Qual mala?',
  'Primeiro encontro.',
  'O look que você salvaria.',
  'Última: qual é mais você?',
]

export default function Quiz({ onDone, ready = true }) {
  const rounds = useMemo(() => buildQuiz(), [])
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState([])
  const [chosen, setChosen] = useState(null)

  const pick = (style, idx) => {
    if (chosen !== null) return
    setChosen(idx)
    setTimeout(() => {
      const next = [...picks, style]
      if (step + 1 >= QUIZ_ROUNDS) {
        const profile = computeProfile(next)
        saveProfile(profile)
        onDone(profile)
        go('/resultado')
        return
      }
      setPicks(next)
      setStep(step + 1)
      setChosen(null)
    }, 750)
  }
  const back = () => {
    if (!step) return
    setPicks(picks.slice(0, -1))
    setStep(step - 1)
  }

  return (
    <div className="quiz">
      <div className="quiz-head">
        <AnimatePresence mode="wait">
          <motion.h1
            key={step}
            className="title-m"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {PROMPTS[step]}
          </motion.h1>
        </AnimatePresence>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} aria-label={`Rodada ${step + 1} de ${QUIZ_ROUNDS}`}>
          {Array.from({ length: QUIZ_ROUNDS }, (_, i) => (
            <motion.span
              key={i}
              animate={{ width: i === step ? 28 : 8, background: i <= step ? '#1c1c1a' : 'rgba(28,28,26,.18)' }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ height: 2, display: 'block' }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {ready ? <motion.div key={step} className="quiz-grid" exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {rounds[step].map((opt, i) => (
            <motion.button
              key={opt.src}
              className="quiz-opt"
              onClick={() => pick(opt.style, i)}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{
                clipPath: 'inset(0% 0 0 0)',
                opacity: chosen === null || chosen === i ? 1 : 0.25,
                scale: chosen === i ? 0.97 : 1,
              }}
              transition={{ duration: 1, delay: chosen === null ? i * 0.08 : 0, ease: EASE }}
              aria-label={`Escolher look ${i + 1}`}
            >
              <img src={opt.src} alt="" draggable={false} />
              <span className="tag">Escolher este</span>
              {chosen === i && (
                <motion.span
                  className="match"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <i className="dot" /> {STYLES[opt.style].name}
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div> : <div className="quiz-grid" />}
      </AnimatePresence>

      <div className="quiz-foot">
        <button className="link-u muted" onClick={back} style={{ visibility: step ? 'visible' : 'hidden' }}>← Voltar</button>
        <span className="muted">{String(step + 1).padStart(2, '0')} / {String(QUIZ_ROUNDS).padStart(2, '0')}</span>
        <button className="link-u muted" onClick={() => pick(null, -1)}>Nenhum desses</button>
      </div>
    </div>
  )
}
