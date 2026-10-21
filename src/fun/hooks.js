import { useSyncExternalStore } from 'react'

function subscribeMedia(query, callback) {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => subscribeMedia(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function formatCuritibaTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())
}
