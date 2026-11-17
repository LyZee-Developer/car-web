import type { ServiceId } from '~/types/review'

/** Workshop services. Text lives in i18n under `services.items.<id>`; counts index the signs/steps arrays. */
export interface ServiceInfo {
  id: ServiceId
  signs: number
  steps: number
}

export const SERVICES: ServiceInfo[] = [
  { id: 'oil', signs: 4, steps: 4 },
  { id: 'brakes', signs: 4, steps: 5 },
  { id: 'engine', signs: 4, steps: 5 },
  { id: 'tires', signs: 4, steps: 4 },
  { id: 'ac', signs: 4, steps: 4 },
  { id: 'electrical', signs: 4, steps: 4 },
  { id: 'body', signs: 4, steps: 4 },
  { id: 'diag', signs: 4, steps: 4 },
  { id: 'general', signs: 3, steps: 4 },
]

/** "What's wrong with your car?" chips → the services that usually fix it. */
export interface Symptom {
  key: string
  services: ServiceId[]
}

export const SYMPTOMS: Symptom[] = [
  { key: 'brakesNoise', services: ['brakes'] },
  { key: 'warningLight', services: ['diag', 'engine'] },
  { key: 'acWarm', services: ['ac'] },
  { key: 'pullsSide', services: ['tires', 'brakes'] },
  { key: 'wontStart', services: ['electrical'] },
  { key: 'overheating', services: ['engine'] },
  { key: 'oilOverdue', services: ['oil', 'general'] },
  { key: 'bodyDamage', services: ['body'] },
  { key: 'unknownNoise', services: ['diag'] },
]

export type CarPaint = 'silver' | 'graphite' | 'pearl' | 'champagne'

export interface Slide {
  key: string
  /** In-page anchor the slide's link scrolls to. */
  hash: string
  paint: CarPaint
}

export const SLIDES: Slide[] = [
  { key: 'fixed', hash: '#services', paint: 'silver' },
  { key: 'brakes', hash: '#svc-brakes', paint: 'graphite' },
  { key: 'ac', hash: '#svc-ac', paint: 'pearl' },
  { key: 'diag', hash: '#svc-diag', paint: 'champagne' },
]
