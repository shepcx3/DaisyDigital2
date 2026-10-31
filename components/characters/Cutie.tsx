import { cx } from "@/lib/utils";
import { SPRITES, rects } from "./sprites";
import s from "./characters.module.css";

type Who = keyof typeof SPRITES;
type Pose = "peek" | "sit" | "hold" | "float" | "stand";

function Frame({ rows, pal, from = 0, className }: { rows: Record<number, string> | string[]; pal: Record<string, string>; from?: number; className?: string }) {
  const entries = Array.isArray(rows) ? rows.map((r, i) => [i, r] as const) : Object.entries(rows).map(([k, r]) => [+k, r] as const);
  return (
    <g className={className}>
      {entries
        .filter(([y]) => y >= from)
        .flatMap(([y, r]) => rects(r, y - from, pal))
        .map((r) => (
          <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
    </g>
  );
}

/** Pixel avatar. Decorative by default; pass `label` when it carries meaning. */
export function Cutie({ who, pose = "stand", sparkles, label, className }: { who: Who; pose?: Pose; sparkles?: boolean; label?: string; className?: string }) {
  const sp = SPRITES[who];
  const rows = pose === "peek" ? sp.rows.slice(0, 12) : sp.rows;
  const blink = Object.fromEntries(Object.entries(sp.blink).filter(([y]) => +y < rows.length));
  const typing = sp.typing && Object.fromEntries(Object.entries(sp.typing).filter(([y]) => +y < rows.length));

  return (
    <span
      className={cx(s.cutie, s[pose], sparkles && s.sparkles, className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg className={s.sprite} viewBox={`0 0 16 ${rows.length}`} shapeRendering="crispEdges">
        <Frame rows={rows} pal={sp.pal} />
        <Frame rows={blink} pal={sp.pal} className={s.blink} />
        {typing && Object.keys(typing).length > 0 && <Frame rows={typing} pal={sp.pal} className={s.typing} />}
      </svg>
      {pose === "hold" && (
        <svg className={s.heldDaisy} viewBox="0 0 24 24" aria-hidden="true">
          <g transform="translate(12 12)" fill="#fffbf5" stroke="#2a1a4a" strokeWidth="1.5">
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cy="-6" rx="2.6" ry="4" transform={`rotate(${r})`} />
            ))}
          </g>
          <circle cx="12" cy="12" r="2.8" fill="#ffd75e" stroke="#2a1a4a" strokeWidth="1.5" />
        </svg>
      )}
    </span>
  );
}
