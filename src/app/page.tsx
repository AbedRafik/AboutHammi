import { About } from "@/components/site/about";
import { BackToTop } from "@/components/site/back-to-top";
import { Backdrop } from "@/components/site/backdrop";
import { Contact } from "@/components/site/contact";
import { CursorAura } from "@/components/site/cursor-aura";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Konami } from "@/components/site/konami";
import { Projects } from "@/components/site/projects";
import { SkipLink } from "@/components/site/skip-link";
import { Skills } from "@/components/site/skills";

export default function Home() {
  return (
    <>
      <Backdrop />
      {/* The pointer's presence-light glows above the fog scene and
          below the content (it shines through the frosted panels), and
          the static grain layer textures everything above it. Both stay
          OUTSIDE the site shell: they belong to the living scene that
          the loader shows while the page itself is still hidden. */}
      <CursorAura />
      <div aria-hidden className="grain" />
      {/* Site shell = everything the loader must hide. While the loader
          is on screen this subtree is visibility:hidden (see .site-shell
          in globals.css): the browser rasterizes zero glass panels during
          the wait, and the visitor sees only the living fog, the grain,
          and the capsule. data-app-ready lifts the veil only AFTER the
          capsule has fully dissolved, so the entrance animations start
          on a clean stage with no overlap. */}
      <div className="site-shell flex min-h-screen flex-col">
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        {/* Game easter egg: the Konami code unlocks an achievement. */}
        <Konami />
      </div>
    </>
  );
}
