import { Capacitor } from '@capacitor/core'

export const extFetch = Capacitor.getPlatform() === 'web' ? cfetch : fetch
