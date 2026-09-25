import type { Mood } from "./playdata";

const MOUTH: Record<string, string> = {
  happy: "M22 40 Q32 50 42 40",
  flat: "M24 44 H40",
  down: "M22 48 Q32 38 42 48",
  open: "M24 40 Q32 50 40 40 Q32 46 24 40",
  tight: "M26 44 H38",
};

function kind(mood: Mood) {
  if (["contenta", "contento", "contentos", "orgullosa", "orgulloso", "orgullosos"].includes(mood)) return "happy";
  if (["frustrada", "enojada", "enojados", "impacientes"].includes(mood)) return "angry";
  if (["asustada", "asustado", "asustados", "sorprendidos"].includes(mood)) return "scared";
  if (["triste", "tristes", "preocupada", "dolorido"].includes(mood)) return "sad";
  if (mood === "nerviosos") return "nervous";
  return "calm";
}

export function EmojiFace({ mood }: { mood: Mood }) {
  const k = kind(mood);
  const brows =
    k === "angry" ? (
      <>
        <path d="M18 24 L28 28" stroke="#1e1830" strokeWidth="2" fill="none" />
        <path d="M46 24 L36 28" stroke="#1e1830" strokeWidth="2" fill="none" />
      </>
    ) : k === "sad" || k === "nervous" ? (
      <>
        <path d="M18 28 L28 24" stroke="#1e1830" strokeWidth="2" fill="none" />
        <path d="M46 28 L36 24" stroke="#1e1830" strokeWidth="2" fill="none" />
      </>
    ) : k === "scared" ? (
      <>
        <path d="M18 22 H28" stroke="#1e1830" strokeWidth="2" />
        <path d="M36 22 H46" stroke="#1e1830" strokeWidth="2" />
      </>
    ) : null;
  const mouth = k === "happy" ? MOUTH.happy : k === "sad" ? MOUTH.down : k === "angry" ? MOUTH.tight : k === "scared" ? MOUTH.open : MOUTH.flat;
  return (
    <svg viewBox="0 0 64 64" className="aspect-square w-[30%] max-w-16" aria-hidden>
      <circle cx="32" cy="34" r="22" fill="#e7c2a4" />
      <circle cx="24" cy="32" r={k === "scared" ? 3.2 : 2.4} fill="#1e1830" />
      <circle cx="40" cy="32" r={k === "scared" ? 3.2 : 2.4} fill="#1e1830" />
      {brows}
      <path d={mouth} stroke="#1e1830" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
