import React, { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80
const GRAVITY = 0.003
const COLORS = [
  '#667eea',
  '#764ba2',
  '#f97316',
  '#22c55e',
  '#f43f5e',
  '#0ea5e9',
  '#a78bfa',
  '#fbbf24',
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotSpeed: number
  opacity: number
}

interface ConfettiOverlayProps {
  onDone?: (() => void) | undefined
  className?: string | undefined
}

const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ onDone, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const parent = canvas.parentElement
    if (!parent) {
      return
    }
    const dpr = window.devicePixelRatio || 1
    let animId: number | null = null

    const resize = (): void => {
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    const w = canvas.width / dpr
    const h = canvas.height / dpr

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 2,
      size: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#FFD700',
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    }))

    let frame = 0
    const maxFrames = 180

    const animate = () => {
      frame++
      ctx.clearRect(0, 0, w, h)

      let alive = 0
      for (const p of particles) {
        p.x += p.vx
        p.vy += GRAVITY * 60
        p.y += p.vy
        p.rotation += p.rotSpeed
        p.opacity = Math.max(0, 1 - frame / maxFrames)
        p.vx *= 0.99

        if (p.opacity <= 0) {
          continue
        }
        alive++

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }

      if (alive > 0 && frame < maxFrames) {
        animId = requestAnimationFrame(animate)
      } else if (onDone) {
        onDone()
      }
    }

    animId = requestAnimationFrame(animate)

    return () => {
      if (animId) {
        cancelAnimationFrame(animId)
      }
    }
  }, [onDone])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

export default ConfettiOverlay
