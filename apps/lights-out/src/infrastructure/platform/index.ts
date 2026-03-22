export type RuntimePlatform = 'web' | 'android' | 'ios' | 'desktop'

export const detectRuntimePlatform = (): RuntimePlatform => {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('android')) {
    return 'android'
  }
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return 'ios'
  }
  if (userAgent.includes('electron')) {
    return 'desktop'
  }

  return 'web'
}
