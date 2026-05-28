// Zip WASM helpers (AssemblyScript)
// This module provides deterministic primitives that can be expanded to full
// maze pathfinding while preserving JS fallback behavior in the runtime layer.

export function zipHeuristicDistance(
  fromRow: i32,
  fromCol: i32,
  toRow: i32,
  toCol: i32,
): i32 {
  const dr = fromRow > toRow ? fromRow - toRow : toRow - fromRow
  const dc = fromCol > toCol ? fromCol - toCol : toCol - fromCol
  return dr + dc
}

export function zipDirectionFromDelta(deltaRow: i32, deltaCol: i32): i32 {
  // Encoding: 0=up, 1=down, 2=left, 3=right, -1=invalid
  if (deltaRow === -1 && deltaCol === 0) {
    return 0
  }
  if (deltaRow === 1 && deltaCol === 0) {
    return 1
  }
  if (deltaRow === 0 && deltaCol === -1) {
    return 2
  }
  if (deltaRow === 0 && deltaCol === 1) {
    return 3
  }
  return -1
}
