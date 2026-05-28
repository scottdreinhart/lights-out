/**
 * Particle system for game effects using AssemblyScript
 * Handles physics calculations for star explosions and effects
 */

const GRAVITY = 0.15
const DAMPING = 0.98
const BOUNCE_DAMPING = 0.6
const MIN_VELOCITY = 0.01

export class Particle {
  x: f32
  y: f32
  vx: f32
  vy: f32
  life: f32
  maxLife: f32
  colorIndex: u32
  trailOpacity: f32

  constructor(x: f32, y: f32, vx: f32, vy: f32, life: f32, colorIndex: u32) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.life = life
    this.maxLife = life
    this.colorIndex = colorIndex
    this.trailOpacity = 1.0
  }

  update(width: f32, height: f32): void {
    // Apply gravity
    this.vy += GRAVITY

    // Apply velocity
    this.x += this.vx
    this.y += this.vy

    // Apply damping
    this.vx *= DAMPING
    this.vy *= DAMPING

    // Bounce off edges with damping
    if (this.x < 0 || this.x > width) {
      this.vx *= -BOUNCE_DAMPING
      this.x = this.x < 0 ? 0 : width
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -BOUNCE_DAMPING
      this.y = this.y < 0 ? 0 : height
    }

    // Update life and trail opacity
    this.life -= 1.0
    const lifeRatio = this.life / this.maxLife
    this.trailOpacity = lifeRatio * lifeRatio // Smooth fade out

    // Stop very slow particles
    const speed = f32(f32.sqrt(this.vx * this.vx + this.vy * this.vy))
    if (speed < MIN_VELOCITY) {
      this.vx = 0
      this.vy = 0
    }
  }

  isAlive(): boolean {
    return this.life > 0
  }

  getOpacity(): f32 {
    return this.trailOpacity
  }
}

export class ParticleSystem {
  particles: Particle[] = []
  width: f32
  height: f32

  constructor(width: f32, height: f32) {
    this.width = width
    this.height = height
  }

  createBurst(
    centerX: f32,
    centerY: f32,
    particleCount: u32,
    speed: f32,
    colors: u32,
  ): void {
    const angle_step = 360.0 / f32(particleCount)

    for (let i: u32 = 0; i < particleCount; i++) {
      const angle = angle_step * f32(i) * 0.01745329 // Convert to radians
      const velocity = speed * (0.7 + f32(i % 3) * 0.15) // Vary velocity

      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity

      const colorIndex = i % colors
      const particle = new Particle(
        centerX,
        centerY,
        vx,
        vy,
        120.0, // Life time in frames
        colorIndex,
      )
      this.particles.push(particle)
    }
  }

  update(): void {
    // Update all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.update(this.width, this.height)

      // Remove dead particles
      if (!p.isAlive()) {
        this.particles.splice(i, 1)
      }
    }
  }

  getParticleData(): Float32Array {
    // Return flat array: [x, y, opacity, colorIndex, ...] for each particle
    const data = new Float32Array(this.particles.length * 4)

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      const idx = i * 4

      data[idx] = p.x
      data[idx + 1] = p.y
      data[idx + 2] = p.getOpacity()
      data[idx + 3] = f32(p.colorIndex)
    }

    return data
  }

  getParticleCount(): u32 {
    return u32(this.particles.length)
  }

  clear(): void {
    this.particles = []
  }
}
