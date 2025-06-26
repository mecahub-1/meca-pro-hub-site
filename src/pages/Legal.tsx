
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Legal = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-padded">
            <div className="max-w-4xl mx-auto">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-8">
                Mentions légales – MecaHUB Pro
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <section className="mb-8">
                  <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">
                    Éditeur du site
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p><strong>Nom du site :</strong> MecaHUB Pro</p>
                    <p><strong>Raison sociale :</strong> MecaHUB</p>
                    <p><strong>Forme juridique :</strong> SARL</p>
                    <p><strong>Capital social :</strong> 500 €</p>
                    <p><strong>Siège social :</strong> 2 allée des Bouleaux, 91420 Morangis – France</p>
                    <p><strong>SIRET :</strong> 940 757 677 00015</p>
                    <p><strong>RCS :</strong> Évry</p>
                    <p><strong>Responsable de la publication :</strong> Dejan MARINKOVIC</p>
                    <p><strong>Adresse email de contact :</strong> contact@mecahub.fr</p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">
                    Hébergement
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p><strong>Hébergeur :</strong> Hostinger International Ltd.</p>
                    <p><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
                    <p><strong>Site web :</strong> <a href="https://www.hostinger.com" className="text-mecahub-primary hover:underline">https://www.hostinger.com</a></p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">
                    Propriété intellectuelle
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    L'ensemble du contenu du site MecaHUB Pro (textes, images, logos, illustrations, documents techniques) est protégé par le Code de la propriété intellectuelle.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Toute reproduction ou utilisation, totale ou partielle, sans autorisation écrite préalable est strictement interdite.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">
                    Responsabilité
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    MecaHUB Pro s'efforce de fournir des informations précises et à jour. Toutefois, l'éditeur ne saurait être tenu responsable des erreurs ou omissions, ni d'une indisponibilité temporaire du site.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
