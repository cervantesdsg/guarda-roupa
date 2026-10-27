import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Chrome, Intro, Menu, Page, ProductDetail, useRoute } from './components/ui.jsx'
import { loadProfile, STYLES } from './data.js'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import Curadoria from './pages/Curadoria.jsx'
import Explorar from './pages/Explorar.jsx'

const seenIntro = () => {
  try {
    return sessionStorage.getItem('intro') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const { path, params } = useRoute()
  const [profile, setProfile] = useState(loadProfile)
  const [menu, setMenu] = useState(false)
  const [intro, setIntro] = useState(() => path === '/' && !seenIntro())
  const endIntro = useCallback(() => {
    setIntro(false)
    try {
      sessionStorage.setItem('intro', '1')
    } catch {}
  }, [])

  const corners = {
    '/': [<a className="link-u" href="#/curadoria">Curadoria</a>, <a className="link-u" href="#/explorar">Explorar tudo</a>],
    '/curadoria': [
      <a className="link-u" href={profile ? '#/resultado' : '#/'}>{profile ? `Seu estilo: ${STYLES[profile.main].name}` : 'Fazer o teste'}</a>,
      <a className="link-u" href="#/explorar">Explorar tudo</a>,
    ],
    '/resultado': [<a className="link-u" href="#/">Refazer teste</a>, <a className="link-u" href="#/explorar">Explorar tudo</a>],
    '/explorar': [<a className="link-u" href="#/curadoria">Curadoria</a>, <a className="link-u" href="#/">Refazer teste</a>],
  }
  const [tl, bl] = corners[path] ?? corners['/']

  // Fluxo: teste de estilo → resultado → curadoria por categoria → explorar tudo.
  let page
  if (path === '/resultado') page = <Result profile={profile} />
  else if (path === '/curadoria') page = <Curadoria profile={profile} params={params} />
  else if (path === '/explorar') page = <Explorar profile={profile} params={params} />
  else page = <Quiz onDone={setProfile} ready={!intro} />

  return (
    <>
      <AnimatePresence mode="wait">
        <Page k={path} key={path}>{page}</Page>
      </AnimatePresence>
      <Chrome tl={tl} bl={bl} onMenu={() => setMenu(true)} showProgress={path !== '/'} />
      <ProductDetail />
      <Menu open={menu} onClose={() => setMenu(false)} hasProfile={!!profile} />
      <AnimatePresence>{intro && <Intro onDone={endIntro} />}</AnimatePresence>
    </>
  )
}
