
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="section-padding bg-mecahub-secondary dark:bg-gray-900">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-6">
                Contactez-nous pour un devis
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Complétez le formulaire ci-dessous et nous reviendrons vers vous rapidement.
              </p>
            </div>
          </div>
        </section>
        
        <section className="section-padding bg-white dark:bg-gray-800">
          <div className="container-padded">
            <div className="max-w-2xl mx-auto">
              {/* Enlèvement de l'alerte puisque nous avons résolu le problème d'email */}
              <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
