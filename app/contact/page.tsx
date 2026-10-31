import type { Metadata } from "next";
import { ContactForm } from "@/components/features/ContactForm";
import { BrowserWindow } from "@/components/system/BrowserWindow";
import { Section, SectionHead } from "@/components/system/layout";
import { Annotation } from "@/components/system/primitives";
import { contact, microcopy } from "@/content/site";
import s from "./contact.module.css";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  return (
    <main id="main">
      <Section accent="pink" labelledBy="contact-h">
        <SectionHead as="h1" id="contact-h" label={contact.label} secret="we always read it" title={contact.title} intro={contact.intro} />
        <div className={s.grid}>
          <div className={s.side}>
            {/* phase 5: the bee buzzes in here and becomes the button */}
            <Annotation>{microcopy.shy}</Annotation>
          </div>
          <BrowserWindow as="section" tab="new_message" icon="message" aria-label="contact form">
            <ContactForm />
          </BrowserWindow>
        </div>
      </Section>
    </main>
  );
}
