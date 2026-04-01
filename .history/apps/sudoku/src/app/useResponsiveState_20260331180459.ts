import { useEffect, useState } from 'react'

export const useResponsiveState = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [height, setHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  )

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = width < 600
  const isTablet = width >= 600 && width < 900
  const isDesktop = width >= 900

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    contentDensity: isMobile ? 'compact' : isTablet ? 'comfortable' : 'spacious',
  }
}
