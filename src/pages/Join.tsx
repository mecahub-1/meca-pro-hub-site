
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JoinForm } from "@/components/JoinForm";

const Join = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="section-padding bg-mecahub-secondary dark:bg-gray-900">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-6">
                Rejoindre MecaHUB Pro
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Vous êtes dessinateur projeteur, technicien ou ingénieur ? Vous souhaitez travailler 
                en tant qu'indépendant ou intégrer une structure dynamique ?
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                MecaHUB Pro étudie chaque candidature avec sérieux, pour des missions ponctuelles, 
                longues, ou des postes en interne.
              </p>
            </div>
          </div>
        </section>
        
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-padded">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-8">
                <JoinForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Join;
