import { Capacitor } from '@capacitor/core'
import { cfetch } from './utils/cfetch'

export const extFetch = Capacitor.getPlatform() === 'web' ? cfetch : fetch
