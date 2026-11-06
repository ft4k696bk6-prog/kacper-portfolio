/** A continuous twisted loop: perspective and rotation, not a flat texture. */
export function createKineticForm(strands = 52, samples = 120) {
  return Array.from({ length: strands }, (_, strand) => {
    const v = strand / strands * Math.PI * 2;
    return Array.from({ length: samples + 1 }, (_, sample) => {
      const u = sample / samples * Math.PI * 2;
      const twist = v + u * 1.5;
      const radius = 1 + .3 * Math.cos(twist);
      return [radius * Math.cos(u), radius * Math.sin(u), .3 * Math.sin(twist)] as const;
    });
  });
}

export function createKineticProjection(time: number) {
  const azimuth = time * .18;
  const tilt = .85 + Math.sin(time * .23) * .55;
  const sinA = Math.sin(azimuth), cosA = Math.cos(azimuth);
  const sinT = Math.sin(tilt), cosT = Math.cos(tilt);
  const breath = 1 + Math.sin(time * .45) * .13;
  return (point: readonly number[]) => {
  const [x, y, z] = point;
  const rotatedX = x * cosA - z * sinA;
  const rotatedZ = x * sinA + z * cosA;
  const rotatedY = y * cosT - rotatedZ * sinT;
  const depth = y * sinT + rotatedZ * cosT;
  const perspective = 3.6 / (3.6 - depth);
  return { x: rotatedX * perspective * breath, y: rotatedY * perspective * breath, depth };
  };
}

export function projectKineticPoint(point: readonly number[], time: number) {
  return createKineticProjection(time)(point);
}
