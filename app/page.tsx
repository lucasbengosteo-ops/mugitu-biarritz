import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Histoire from "@/components/Histoire";
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
        <Histoire />
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
