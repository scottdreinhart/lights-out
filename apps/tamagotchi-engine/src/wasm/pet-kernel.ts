// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import type { DecayProfile, PetRuntime } from '@/domain'

import { PET_WASM_BASE64 } from './pet-wasm'

interface PetWasmExports {
  calculateDecayProfile: (elapsedMinutes: number) => number
}

interface PetWasmModule {
  instance: WebAssembly.Instance
}

let petWasmModule: PetWasmModule | null = null
let calculateDecayProfileWasm: ((elapsedMinutes: number) => number) | null = null

function decodeDecayProfile(profileValue: number): DecayProfile {
  return {
    hungerLoss: profileValue & 0xff,
    happinessLoss: (profileValue >> 8) & 0xff,
    weightLoss: (profileValue >> 16) & 0xff,
  }
}

function createFallbackDecayProfile(elapsedMinutes: number): DecayProfile {
  return {
    hungerLoss: Math.max(1, Math.floor(elapsedMinutes / 30)),
    happinessLoss: Math.max(1, Math.floor(elapsedMinutes / 45)),
    weightLoss: Math.floor(elapsedMinutes / 60),
  }
}

async function initPetWasm(): Promise<PetWasmModule | null> {
  if (petWasmModule) {
    return petWasmModule
  }

  if (PET_WASM_BASE64.length === 0) {
    return null
  }

  const binaryString = atob(PET_WASM_BASE64)
  const bytes = Uint8Array.from(binaryString, (character) => character.charCodeAt(0))

  const wasmResult = await WebAssembly.instantiate(bytes, {})
  petWasmModule = { instance: wasmResult.instance }

  const wasmExports = wasmResult.instance.exports as unknown as PetWasmExports
  const calculateDecayProfile = wasmExports.calculateDecayProfile
  calculateDecayProfileWasm =
    typeof calculateDecayProfile === 'function' ? calculateDecayProfile : null

  return petWasmModule
}

export async function primePetWasm(): Promise<void> {
  await initPetWasm()
}

export function createPetRuntime(): PetRuntime {
  return {
    calculateDecayProfile(elapsedMinutes: number): DecayProfile {
      if (calculateDecayProfileWasm) {
        return decodeDecayProfile(calculateDecayProfileWasm(elapsedMinutes))
      }

      return createFallbackDecayProfile(elapsedMinutes)
    },
  }
}
