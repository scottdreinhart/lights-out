// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import type { PetActionType, PetBank, PetGenetics, PetState, VariantId } from './types'

const TRAITS: readonly PetGenetics[] = [
  {
    traitId: 'thrifty',
    traitLabel: 'Thrifty',
    augmentLabel: 'Bank discount',
    augmentDetail: 'Reduces paid care costs by 1 credit and improves daily savings.',
    costDiscount: 1,
    pressureBias: -2,
    rewardBoost: 1,
    memorialBonusMinutes: 0,
  },
  {
    traitId: 'spark',
    traitLabel: 'Spark',
    augmentLabel: 'Play boost',
    augmentDetail: 'Premium play restores extra happiness and steadies focus.',
    costDiscount: 0,
    pressureBias: -1,
    rewardBoost: 2,
    memorialBonusMinutes: 0,
  },
  {
    traitId: 'resilient',
    traitLabel: 'Resilient',
    augmentLabel: 'Memorial buffer',
    augmentDetail: 'Extends the memorial window and softens resurrection pressure.',
    costDiscount: 0,
    pressureBias: -3,
    rewardBoost: 0,
    memorialBonusMinutes: 12 * 60,
  },
  {
    traitId: 'steady',
    traitLabel: 'Steady',
    augmentLabel: 'Focus bias',
    augmentDetail: 'Improves calm play and reduces pressure from mild debt.',
    costDiscount: 0,
    pressureBias: -1,
    rewardBoost: 1,
    memorialBonusMinutes: 0,
  },
] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hashSeed(seed: string): number {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return hash
}

export function createPetGenetics(variantId: VariantId, petName: string): PetGenetics {
  const seed = `${variantId}:${petName}`
  const trait = TRAITS[hashSeed(seed) % TRAITS.length]
  return { ...trait }
}

export function getPetGenetics(state: PetState): PetGenetics {
  return state.genetics ?? createPetGenetics(state.variantId, state.name)
}

export function createPetBank(): PetBank {
  return {
    balance: 8,
    earned: 8,
    spent: 0,
  }
}

export function getPetBank(state: PetState): PetBank {
  return state.bank ?? createPetBank()
}

export function creditPetBank(state: PetState, amount: number): PetBank {
  const bank = getPetBank(state)
  return {
    balance: bank.balance + amount,
    earned: bank.earned + amount,
    spent: bank.spent,
  }
}

export function debitPetBank(state: PetState, amount: number): PetBank {
  const bank = getPetBank(state)
  return {
    balance: bank.balance - amount,
    earned: bank.earned,
    spent: bank.spent + amount,
  }
}

export function getActionPrice(state: PetState, action: PetActionType): number {
  const trait = getPetGenetics(state)
  const basePriceByAction: Partial<Record<PetActionType, number>> = {
    treat: 0,
    feedMeal: 3,
    feedSnack: 1,
    gamePlay: 1,
    arcadePlay: 3,
    medicine: 2,
  }

  const basePrice = basePriceByAction[action] ?? 0
  return Math.max(0, basePrice - trait.costDiscount)
}

export function getBankPressure(state: PetState): number {
  const bank = getPetBank(state)
  return bank.balance < 0 ? clamp(Math.abs(bank.balance) * 2, 0, 20) : 0
}

export function getBankMemo(state: PetState): string {
  const bank = getPetBank(state)
  return `${bank.balance} credits`
}
