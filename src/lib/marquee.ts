/** Keep the viewport inside the middle of three identical copies. */
export function wrapMarqueePosition(position: number, span: number): number {
  if (!Number.isFinite(position) || !Number.isFinite(span) || span <= 0) return 0;
  return span + ((position - span) % span + span) % span;
}
