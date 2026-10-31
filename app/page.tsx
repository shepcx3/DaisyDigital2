import Link from "next/link";

export default function Home() {
  return (
    <main id="main" className="container-dd" style={{ paddingBlock: 80 }}>
      <span className="micro-label">brb brainstorming</span>
      <h1 style={{ fontSize: "3rem" }}>daisy digital</h1>
      <p>the new site is blooming. <Link href="/styleguide/">see the style guide</Link>.</p>
    </main>
  );
}
