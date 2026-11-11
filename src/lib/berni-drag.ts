export type BerniPosition = { x: number; y: number };
export type BerniPositionRatio = { x: number; y: number };

export function clampBerniPosition(
  position: BerniPosition, viewport: { width: number; height: number },
  size: { width: number; height: number },
): BerniPosition {
  const margin = 8;
  const maxX = Math.max(margin, viewport.width - size.width - margin);
  const maxY = Math.max(margin, viewport.height - size.height - margin);
  return {
    x: Math.round(Math.min(maxX, Math.max(margin, position.x))),
    y: Math.round(Math.min(maxY, Math.max(margin, position.y))),
  };
}

export function normalizeBerniPosition(position: BerniPosition, viewport: { width: number; height: number }, size: { width: number; height: number }): BerniPositionRatio {
  const maxX = Math.max(1, viewport.width - size.width);
  const maxY = Math.max(1, viewport.height - size.height);
  return {
    x: Math.min(1, Math.max(0, position.x / maxX)),
    y: Math.min(1, Math.max(0, position.y / maxY)),
  };
}

export function denormalizeBerniPosition(ratio: BerniPositionRatio, viewport: { width: number; height: number }, size: { width: number; height: number }): BerniPosition | null {
  if (!Number.isFinite(ratio.x) || !Number.isFinite(ratio.y) || ratio.x < 0 || ratio.y < 0 || ratio.x > 1 || ratio.y > 1) return null;
  return clampBerniPosition({
    x: ratio.x * Math.max(0, viewport.width - size.width),
    y: ratio.y * Math.max(0, viewport.height - size.height),
  }, viewport, size);
}

export function isBerniDragGesture(elapsedMs: number, movedPixels: number): boolean {
  return elapsedMs >= 220 && movedPixels >= 7;
}
