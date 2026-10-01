import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Lab } from "@/components/sections/lab";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Activity } from "@/components/sections/activity";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Work />
      <Lab />
      <Experience />
      <Stack />
      <Activity />
      <Contact />
    </main>
  );
}
