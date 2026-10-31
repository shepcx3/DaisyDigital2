import type { Metadata } from "next";
import { JoinForm } from "@/components/features/JoinForm";
import { BrowserWindow } from "@/components/system/BrowserWindow";
import { Section, SectionHead } from "@/components/system/layout";
import { careers } from "@/content/site";
import s from "./careers.module.css";

export const metadata: Metadata = { title: "careers" };

export default function CareersPage() {
  return (
    <main id="main">
      <Section accent="violet" labelledBy="careers-h">
        <SectionHead as="h1" id="careers-h" label={careers.label} secret="yes, you can bring your 473 tabs" title={careers.title} intro={careers.intro} />
        {/* phase 5: the watering can sits here and blooms the form open */}
        <BrowserWindow as="section" tab="join_the_team.exe" icon="watering-can" className={s.window} aria-label="application form">
          <JoinForm />
        </BrowserWindow>
      </Section>
    </main>
  );
}
