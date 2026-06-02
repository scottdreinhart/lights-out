// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md
//
// This kernel mirrors the deterministic decay math used by the TypeScript
// fallback so the app can switch to WASM without changing behavior.

function packProfile(hungerLoss: i32, happinessLoss: i32, weightLoss: i32): i32 {
  return (hungerLoss & 0xff) | ((happinessLoss & 0xff) << 8) | ((weightLoss & 0xff) << 16)
}

export function calculateDecayProfile(elapsedMinutes: i32): i32 {
  const hungerLoss = Math.max(1, i32(Math.floor(elapsedMinutes / 30)))
  const happinessLoss = Math.max(1, i32(Math.floor(elapsedMinutes / 45)))
  const weightLoss = i32(Math.floor(elapsedMinutes / 60))

  return packProfile(hungerLoss, happinessLoss, weightLoss)
}