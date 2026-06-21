import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ModulesShowcase from "@/components/landing/ModulesShowcase";
import Workflow from "@/components/landing/Workflow";
import DesignerHighlight from "@/components/landing/DesignerHighlight";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ModulesShowcase />
      <Workflow />
      <DesignerHighlight />
      <Footer />
    </main>
  );
}
