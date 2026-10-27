import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: o site funciona tanto na raiz quanto em cervantesdsg.github.io/guarda-roupa/
export default defineConfig({ base: './', plugins: [react()] })
