
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { RecruitmentCard } from "@/components/RecruitmentCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ServicesSection />
        <ProjectsSection />
        <WhyChooseUs />
        <RecruitmentCard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
