import { useEffect, useRef } from 'react'
import { progress } from '../progress.js'

// Galeria horizontal guiada pela rolagem vertical (roda, trackpad, toque e teclado),
// com interpolação suave e parallax nas imagens, como no Kibun.
export default function HScroll({ children, resetKey }) {
  const wrap = useRef(null)
  const track = useRef(null)
  const state = useRef({ target: 0, current: 0, max: 0 })

  useEffect(() => {
    state.current.target = 0
    state.current.current = 0
  }, [resetKey])

  useEffect(() => {
    const el = wrap.current
    const tr = track.current
    const st = state.current
    const clamp = (v) => Math.max(0, Math.min(st.max, v))
    const measure = () => {
      st.max = Math.max(0, tr.scrollWidth - window.innerWidth)
      st.target = clamp(st.target)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(tr)
    window.addEventListener('resize', measure)

    const onWheel = (e) => {
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      st.target = clamp(st.target + d * (e.deltaMode === 1 ? 32 : 1))
    }
    let touchX = 0, touchY = 0, last = 0, vel = 0
    const onStart = (e) => {
      touchX = e.touches[0].clientX
      touchY = e.touches[0].clientY
      vel = 0
    }
    const onMove = (e) => {
      const x = e.touches[0].clientX, y = e.touches[0].clientY
      const dx = touchX - x, dy = touchY - y
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy
      st.target = clamp(st.target + d * 1.4)
      vel = d * 1.4
      touchX = x
      touchY = y
    }
    const onEnd = () => (st.target = clamp(st.target + vel * 10))
    const onKey = (e) => {
      const step = window.innerWidth * 0.6
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) st.target = clamp(st.target + step)
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) st.target = clamp(st.target - step)
      if (e.key === 'Home') st.target = 0
      if (e.key === 'End') st.target = st.max
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd)
    window.addEventListener('keydown', onKey)

    let raf
    const vw = () => window.innerWidth
    const tick = () => {
      st.current += (st.target - st.current) * 0.085
      if (Math.abs(st.target - st.current) < 0.05) st.current = st.target
      tr.style.transform = `translate3d(${-st.current}px,0,0)`
      // parallax: cada imagem desliza dentro da moldura conforme se aproxima do centro
      const imgs = tr.querySelectorAll('[data-px]')
      const mid = vw() / 2
      for (const img of imgs) {
        const r = img.parentElement.getBoundingClientRect()
        if (r.right < -200 || r.left > vw() + 200) continue
        const off = (r.left + r.width / 2 - mid) / vw()
        img.style.transform = `translate3d(${off * -9}%,0,0) scale(1.14)`
      }
      progress.set(st.max ? st.current / st.max : 0)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      window.removeEventListener('keydown', onKey)
      progress.set(null)
    }
  }, [])

  return (
    <div className="hs" ref={wrap}>
      <div className="hs-track" ref={track}>
        {children}
      </div>
    </div>
  )
}
