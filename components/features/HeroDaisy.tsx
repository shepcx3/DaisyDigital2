import { asset } from "@/lib/utils";
import s from "./hero.module.css";

/** Flat daisy for the hero. Phase 5 swaps in the 3D chrome daisy on capable devices; this stays as the fallback. */
export function HeroDaisy() {
  return (
    <div className={s.daisySlot} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/daisy.svg")} alt="" className={s.flatDaisy} />
    </div>
  );
}
