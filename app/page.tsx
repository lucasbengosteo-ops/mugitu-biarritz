import Nav from "@/components/Nav";
import ConcoursBanner from "@/components/ConcoursBanner";
import Hero from "@/components/Hero";
import Histoire from "@/components/Histoire";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Allyane from "@/components/Allyane";
import LaCliniqueDuCoureur from "@/components/LaCliniqueDuCoureur";
import AppMugitu from "@/components/AppMugitu";
import Andrew from "@/components/Andrew";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ConcoursBanner />
        <Histoire />
        <Services />
        <Team />
        <Allyane />
        <LaCliniqueDuCoureur />
        <AppMugitu />
        <Andrew />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
