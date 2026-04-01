import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Allyane from "@/components/Allyane";
import AppMugitu from "@/components/AppMugitu";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Team />
        <Allyane />
        <AppMugitu />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
