import { createLaunchVelocity, sampleTrajectory } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('angle war trajectory', () => {
  it('creates an upward launch from default artillery angle', () => {
    const velocity = createLaunchVelocity(-1.1, 12)
    expect(velocity.x).toBeGreaterThan(0)
    expect(velocity.y).toBeLessThan(0)
  })

  it('samples a parabolic arc that eventually descends', () => {
    const points = sampleTrajectory({ x: 10, y: 500 }, -1.0, 11, 60)
    expect(points.length).toBe(60)

    const openingY = points[0].y
    const apexY = Math.min(...points.map((point) => point.y))
    const endingY = points[points.length - 1].y

    expect(apexY).toBeLessThan(openingY)
    expect(endingY).toBeGreaterThan(apexY)
  })
})
