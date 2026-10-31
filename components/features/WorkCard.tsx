import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { BrowserWindow } from "@/components/system/BrowserWindow";
import { Sticker } from "@/components/system/primitives";
import type { CaseStudy } from "@/content/site";
import s from "./work.module.css";

/** Case study card: a browser window you click into (camera-flash transition). */
export function WorkCard({ c }: { c: CaseStudy }) {
  return (
    <Sticker seed={`work-${c.slug}`} max={2.5} className={s.stickerFill}>
      <BrowserWindow tab={c.brand} icon="tab" className={s.card}>
        <Link href={`/work/${c.slug}/`} className={s.link} transitionTypes={["cam-flash"]}>
          <span className={s.brand}>{c.brand}</span>
          <span className="micro-label">{c.services.length ? c.services.join(" · ") : c.label}</span>
          <span className={s.open}>open case study <Icon name="arrow" size={18} /></span>
        </Link>
      </BrowserWindow>
    </Sticker>
  );
}
