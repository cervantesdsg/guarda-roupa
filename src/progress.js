// Progresso da galeria horizontal, publicado fora do React para não re-renderizar a cada frame.
const subs = new Set()
export const progress = {
  value: null,
  set(v) {
    if (v === this.value) return
    this.value = v
    subs.forEach((fn) => fn(v))
  },
  subscribe(fn) {
    subs.add(fn)
    return () => subs.delete(fn)
  },
}
