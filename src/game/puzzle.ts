export type PieceId = "tl" | "tr" | "bl" | "br";

export const PIECES: PieceId[] = ["tl", "tr", "bl", "br"];

export const TARGET: Record<PieceId, { x: number; y: number }> = {
  tl: { x: 0, y: 0 },
  tr: { x: 0, y: 0 },
  bl: { x: 0, y: 0 },
  br: { x: 0, y: 0 },
};

export type Piece = { id: PieceId; x: number; y: number; group: number };

const START: Record<PieceId, { x: number; y: number }>[] = [
  { tl: { x: 46, y: 37 }, tr: { x: -47, y: 39 }, bl: { x: 46, y: -44 }, br: { x: -47, y: -44 } },
  { tl: { x: -22, y: 38 }, tr: { x: 22, y: -42 }, bl: { x: 40, y: 18 }, br: { x: -44, y: -8 } },
];

export function freshPieces(seed: number): Piece[] {
  const layout = START[seed % START.length];
  return PIECES.map((id, i) => ({ id, x: layout[id].x, y: layout[id].y, group: i + 1 }));
}

export function moveGroup(pieces: Piece[], group: number, dx: number, dy: number): Piece[] {
  return pieces.map((p) =>
    p.group === group
      ? { ...p, x: clamp(p.x + dx, -58, 58), y: clamp(p.y + dy, -58, 58) }
      : p,
  );
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function adjacent(a: PieceId, b: PieceId) {
  const pair = [a, b].sort().join("");
  return pair === "tltr" || pair === "blbr" || pair === "bltl" || pair === "brtr";
}

const SNAP = 14;
export const MAGNET_PULL = 20;

export function magnet(pieces: Piece[], group: number): { pieces: Piece[]; locked: boolean } {
  let best: { dx: number; dy: number; dist: number } | null = null;
  for (const a of pieces) {
    if (a.group !== group) continue;
    for (const b of pieces) {
      if (b.group === group || !adjacent(a.id, b.id)) continue;
      const expectX = TARGET[a.id].x - TARGET[b.id].x;
      const expectY = TARGET[a.id].y - TARGET[b.id].y;
      const dx = b.x + expectX - a.x;
      const dy = b.y + expectY - a.y;
      const dist = Math.hypot(dx, dy);
      if (!best || dist < best.dist) best = { dx, dy, dist };
    }
  }
  if (!best || best.dist > MAGNET_PULL) return { pieces, locked: false };
  if (best.dist <= SNAP) {
    const snapped = trySnap(pieces);
    return { pieces: snapped.pieces, locked: snapped.snapped };
  }
  const strength = 0.35 + (1 - best.dist / MAGNET_PULL) * 0.4;
  return {
    pieces: pieces.map((p) =>
      p.group === group ? { ...p, x: p.x + best.dx * strength, y: p.y + best.dy * strength } : p,
    ),
    locked: false,
  };
}

export function trySnap(pieces: Piece[]): { pieces: Piece[]; snapped: boolean } {
  let next = pieces.map((p) => ({ ...p }));
  let snapped = false;
  let guard = 0;
  while (guard++ < 6) {
    let hit = false;
    for (let i = 0; i < next.length; i++) {
      for (let j = i + 1; j < next.length; j++) {
        const a = next[i];
        const b = next[j];
        if (a.group === b.group || !adjacent(a.id, b.id)) continue;
        const expectX = TARGET[a.id].x - TARGET[b.id].x;
        const expectY = TARGET[a.id].y - TARGET[b.id].y;
        if (Math.abs(a.x - b.x - expectX) > SNAP || Math.abs(a.y - b.y - expectY) > SNAP) continue;
        const drop = Math.max(a.group, b.group);
        const keep = Math.min(a.group, b.group);
        const ox = a.x - (b.x + expectX);
        const oy = a.y - (b.y + expectY);
        next = next.map((p) => (p.group === drop ? { ...p, group: keep, x: p.x + ox, y: p.y + oy } : p));
        snapped = true;
        hit = true;
      }
    }
    if (!hit) break;
  }
  if (new Set(next.map((p) => p.group)).size === 1) {
    next = next.map((p) => ({ ...p, x: TARGET[p.id].x, y: TARGET[p.id].y }));
  }
  return { pieces: next, snapped };
}

export function isComplete(pieces: Piece[]) {
  return (
    new Set(pieces.map((p) => p.group)).size === 1 &&
    pieces.every((p) => Math.abs(p.x - TARGET[p.id].x) < 1.2 && Math.abs(p.y - TARGET[p.id].y) < 1.2)
  );
}
