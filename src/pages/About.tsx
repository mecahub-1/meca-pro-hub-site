
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="section-padding bg-mecahub-secondary dark:bg-gray-900">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-6">
                L'ingénierie mécanique appliquée, sur le terrain.
              </h1>
            </div>
          </div>
        </section>
        
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                MecaHUB Pro est une structure indépendante spécialisée dans la prestation technique sur site.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Fondée par un ingénieur issu de l'industrie lourde, notre entreprise comprend les contraintes 
                réelles de vos projets : délais courts, documentation exigeante, livrables propres.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Nous déployons, chez vous ou à distance, des profils immédiatement opérationnels. 
                Notre réseau est composé d'indépendants sélectionnés, mais aussi de collaborateurs internes.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                Notre méthode : écoute, réactivité, qualité.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
