import type { KeyboardActionBinding } from './useKeyboardControls'

export interface GridNavigationActionNames {
	up?: string
	down?: string
	left?: string
	right?: string
	upAlt?: string
	downAlt?: string
	leftAlt?: string
	rightAlt?: string
	confirm?: string
	cancel?: string
}

export interface CreateGridNavigationKeyboardBindingsOptions {
	enabled?: boolean
	includeWasd?: boolean
	allowRepeat?: boolean
	confirmKeys?: readonly string[]
	cancelKeys?: readonly string[]
	actionNames?: GridNavigationActionNames
}

export interface DirectionKeyboardBindings {
	up?: () => void
	down?: () => void
	left?: () => void
	right?: () => void
}

export interface DirectionKeyboardBindingKeys {
	up?: readonly string[]
	down?: readonly string[]
	left?: readonly string[]
	right?: readonly string[]
}

export interface CreateDirectionalKeyboardBindingsOptions {
	enabled?: boolean
	allowRepeat?: boolean
	includeWasd?: boolean
	directionKeys?: DirectionKeyboardBindingKeys
	actionNames?: GridNavigationActionNames
	confirmKeys?: readonly string[]
	cancelKeys?: readonly string[]
}

const DEFAULT_ACTION_NAMES: Required<GridNavigationActionNames> = {
	up: 'up',
	down: 'down',
	left: 'left',
	right: 'right',
	upAlt: 'up-w',
	downAlt: 'down-s',
	leftAlt: 'left-a',
	rightAlt: 'right-d',
	confirm: 'confirm',
	cancel: 'cancel',
}

export const createGridNavigationKeyboardBindings = (
	moveFocus: (deltaRow: number, deltaCol: number) => void,
	onAction?: () => void,
	onCancel?: () => void,
	{
		enabled = true,
		includeWasd = true,
		allowRepeat = false,
		confirmKeys = ['Space', 'Enter'],
		cancelKeys = ['Escape', 'KeyQ'],
		actionNames,
	}: CreateGridNavigationKeyboardBindingsOptions = {},
): KeyboardActionBinding[] => {
	const names = { ...DEFAULT_ACTION_NAMES, ...actionNames }
	const movementBinding = allowRepeat ? { allowRepeat: true as const } : undefined

	return [
		{ action: names.up, keys: ['ArrowUp'] as readonly string[], onTrigger: () => moveFocus(-1, 0), enabled, ...movementBinding },
		{ action: names.down, keys: ['ArrowDown'] as readonly string[], onTrigger: () => moveFocus(1, 0), enabled, ...movementBinding },
		{ action: names.left, keys: ['ArrowLeft'] as readonly string[], onTrigger: () => moveFocus(0, -1), enabled, ...movementBinding },
		{ action: names.right, keys: ['ArrowRight'] as readonly string[], onTrigger: () => moveFocus(0, 1), enabled, ...movementBinding },
		...(includeWasd
			? [
				{ action: names.upAlt, keys: ['KeyW'] as readonly string[], onTrigger: () => moveFocus(-1, 0), enabled, ...movementBinding },
				{ action: names.downAlt, keys: ['KeyS'] as readonly string[], onTrigger: () => moveFocus(1, 0), enabled, ...movementBinding },
				{ action: names.leftAlt, keys: ['KeyA'] as readonly string[], onTrigger: () => moveFocus(0, -1), enabled, ...movementBinding },
				{ action: names.rightAlt, keys: ['KeyD'] as readonly string[], onTrigger: () => moveFocus(0, 1), enabled, ...movementBinding },
			]
			: []),
		...(onAction ? [{ action: names.confirm, keys: confirmKeys as readonly string[], onTrigger: onAction, enabled }] : []),
		...(onCancel ? [{ action: names.cancel, keys: cancelKeys as readonly string[], onTrigger: onCancel, enabled }] : []),
	]
}

export const createDirectionalKeyboardBindings = (
	directions: DirectionKeyboardBindings,
	onAction?: () => void,
	onCancel?: () => void,
	{
		enabled = true,
		allowRepeat = false,
		includeWasd = true,
		directionKeys,
		actionNames,
		confirmKeys = ['Space', 'Enter'],
		cancelKeys = ['Escape', 'KeyQ'],
	}: CreateDirectionalKeyboardBindingsOptions = {},
): KeyboardActionBinding[] => {
	const names = { ...DEFAULT_ACTION_NAMES, ...actionNames }
	const movementBinding = allowRepeat ? { allowRepeat: true as const } : undefined
	const keys = {
		up: (directionKeys?.up ?? ['ArrowUp']) as readonly string[],
		down: (directionKeys?.down ?? ['ArrowDown']) as readonly string[],
		left: (directionKeys?.left ?? ['ArrowLeft']) as readonly string[],
		right: (directionKeys?.right ?? ['ArrowRight']) as readonly string[],
	}

	return [
		...(directions.up ? [{ action: names.up, keys: keys.up, onTrigger: directions.up, enabled, ...movementBinding }] : []),
		...(directions.down ? [{ action: names.down, keys: keys.down, onTrigger: directions.down, enabled, ...movementBinding }] : []),
		...(directions.left ? [{ action: names.left, keys: keys.left, onTrigger: directions.left, enabled, ...movementBinding }] : []),
		...(directions.right ? [{ action: names.right, keys: keys.right, onTrigger: directions.right, enabled, ...movementBinding }] : []),
		...(includeWasd
			? [
				...(directions.up ? [{ action: names.upAlt, keys: ['KeyW'], onTrigger: directions.up, enabled, ...movementBinding }] : []),
				...(directions.down ? [{ action: names.downAlt, keys: ['KeyS'], onTrigger: directions.down, enabled, ...movementBinding }] : []),
				...(directions.left ? [{ action: names.leftAlt, keys: ['KeyA'], onTrigger: directions.left, enabled, ...movementBinding }] : []),
				...(directions.right ? [{ action: names.rightAlt, keys: ['KeyD'], onTrigger: directions.right, enabled, ...movementBinding }] : []),
			]
			: []),
		...(onAction ? [{ action: names.confirm, keys: confirmKeys, onTrigger: onAction, enabled }] : []),
		...(onCancel ? [{ action: names.cancel, keys: cancelKeys, onTrigger: onCancel, enabled }] : []),
	]
}