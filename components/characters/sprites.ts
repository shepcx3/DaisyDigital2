// Placeholder pixel art until the real character art arrives.
// 16-wide grids; each letter maps to a palette colour. Frames swap rows for idle animations.

type Sprite = {
  pal: Record<string, string>;
  rows: string[];
  blink: Record<number, string>;
  typing?: Record<number, string>;
};

export const SPRITES: Record<"erica" | "bri", Sprite> = {
  erica: {
    pal: { H: "#3b2420", S: "#f6cfb0", E: "#2a1240", W: "#ffffff", B: "#ff9ccf", M: "#c2185b", C: "#a9d8ff", A: "#ff8fc7", K: "#e3e6ee", T: "#7cc4ff", L: "#9a9eab" },
    rows: [
      ".....HHHHHH..AA.",
      "...HHHHHHHHHAAA.",
      "..HHHHHHHHHHHA..",
      "..HHSHHHHHSHHH..",
      "..HSSSSSSSSSSH..",
      ".HHSSSSSSSSSSHH.",
      ".HHSEESSSSEESHH.",
      ".HHSEWSSSSEWSHH.",
      ".HHSBSSSSSSBSHH.",
      ".HHSSSSMMSSSSHH.",
      ".HHHSSSSSSSSHHH.",
      ".HHH..SSSS..HHH.",
      ".HH..CCCCCC..HH.",
      "....CCCCCCCC....",
      "..SKKKKKKKKKKS..",
      "..SKTKTKTKTKKS..",
      "..KKKKKKKKKKKK..",
      ".LLLLLLLLLLLLLL.",
    ],
    blink: { 6: ".HHSSSSSSSSSSHH.", 7: ".HHSEESSSSEESHH." },
    typing: { 15: "..SKKTKTKTKTKS.." },
  },
  bri: {
    pal: { H: "#f2c66d", Y: "#ffe14d", S: "#f6d2b8", E: "#2a1240", W: "#ffffff", B: "#ff9ccf", M: "#c2185b", C: "#ff8fc7", R: "#3b2a4f" },
    rows: [
      "......HHHH......",
      ".....HHHHHH.....",
      "...HHHHHHHHHH...",
      "..HHHHHHHHHHHY..",
      "..HHHHSSSSSSHYY.",
      "..HSSSSSSSSSSH..",
      "..HSEESSSSEESH..",
      "..HSEWSSSSEWSH..",
      "..HSBSSSSSSBSH..",
      "..HSSSSMMSSSSH..",
      "..HHSSSSSSSSHH..",
      "..HH..SSSS..HH..",
      "....CCCCCCCC....",
      "...CCCCCCCCCC...",
      "..CCCCCCCCCCRRR.",
      "..SCCCCCCCCSRWR.",
      "...CCCCCCCC.RRR.",
      "...CC....CC.....",
    ],
    blink: { 6: "..HSSSSSSSSSSH..", 7: "..HSEESSSSEESH.." },
    typing: { 15: "..SCCCCCCCCSRRR." },
  },
};

/** Merge runs of the same colour into wider rects (fewer DOM nodes). */
export function rects(row: string, y: number, pal: Record<string, string>) {
  const out: { x: number; y: number; w: number; fill: string }[] = [];
  for (let x = 0; x < row.length; ) {
    const c = row[x];
    let w = 1;
    while (row[x + w] === c) w++;
    if (pal[c]) out.push({ x, y, w, fill: pal[c] });
    x += w;
  }
  return out;
}
