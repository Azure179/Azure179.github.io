export function overviewLeader(
  point: { x: number; y: number },
  end: { x: number; y: number },
) {
  const dx = end.x - point.x;
  const elbow = end.x - Math.sign(dx) * Math.min(50, Math.abs(dx) * 0.42);
  return `M ${point.x} ${point.y} L ${elbow} ${end.y} L ${end.x} ${end.y}`;
}
export function placeOverviewLabel(
  index: number,
  width: number,
  height: number,
  labelWidth: number,
  labelHeight: number,
  point?: { x: number; y: number },
  titleHeight = 90,
) {
  if (width <= 650) {
    // Two compact indexes share one baseline above the projected archives.
    // Reserve the expanded details height so selection never moves the title.
    return {
      x: index ? width - labelWidth - 20 : 20,
      y: Math.max(166, Math.min(height * 0.29, height - labelHeight - 80)),
    };
  }
  if (point) {
    // Put the text outside the real anchor, so the leader cannot cross a title.
    // Mirrored offsets follow the diagonal A1/T1 pair; portrait keeps stacked UI.
    const gap = Math.min(60, width * 0.035);
    return {
      x: Math.max(
        24,
        Math.min(
          width - labelWidth - 24,
          point.x + (index ? gap : -labelWidth - gap),
        ),
      ),
      y: Math.max(
        158,
        Math.min(
          height - labelHeight - 65,
          point.y + (index ? gap : -gap) - titleHeight,
        ),
      ),
    };
  }
  const spread = Math.max(labelWidth / 2 + 24, width * 0.18);
  return {
    x: width / 2 + (index ? spread : -spread) - labelWidth / 2,
    y: Math.max(138, Math.min(height * 0.43, height - labelHeight - 65)),
  };
}
