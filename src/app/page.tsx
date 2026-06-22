import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Accreditations } from "@/components/site/Accreditations";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Calculator } from "@/components/site/Calculator";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { getSectionContent } from "@/lib/content";

// Public marketing page. Editable content is read from the CMS (with defaults).
export const dynamic = "force-dynamic";

// Accreditation strip is toggleable (README "Toggleable (see props)").
const SHOW_ACCREDITATIONS = true;

export default async function HomePage() {
  const [hero, about, contact] = await Promise.all([
    getSectionContent("hero"),
    getSectionContent("about"),
    getSectionContent("contact"),
  ]);

  return (
    <main>
      <Header />
      <Hero content={hero} />
      {SHOW_ACCREDITATIONS && <Accreditations />}
      <About content={about} />
      <Services />
      <Testimonials />
      <Calculator />
      <Contact content={contact} />
      <Footer content={contact} />
    </main>
  );
}
