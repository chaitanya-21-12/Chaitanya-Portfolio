"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const NavigationOverlay = dynamic(() => import("@/components/NavigationOverlay"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });

import Projects from "@/components/Projects";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import GitHubStats from "@/components/GitHubStats";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <>
      <div className="mobile-ambient" aria-hidden="true" />
      <CursorGlow />
      <Loader onComplete={handleLoaderComplete} />

      {loaded && (
        <>
          <Header onNavOpen={openNav} />
          <NavigationOverlay isOpen={navOpen} onClose={closeNav} />
          <main id="main-content">
            <Hero isVisible={loaded} />
            <About />
            <Projects />
            <Experience />
            <Skills />
            <GitHubStats />
            <Education />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
