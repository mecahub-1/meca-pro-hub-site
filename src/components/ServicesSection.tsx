
import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Renfort technique chez le client",
    description: "Notre cœur de métier : intégrer vos équipes pour soutenir vos projets directement sur site."
  },
  {
    id: 2,
    title: "Études mécaniques externalisées",
    description: "Confiez-nous vos études complexes pour un travail de qualité, livré dans les délais."
  },
  {
    id: 3,
    title: "Réalisation de liasses de mise en plan 2D",
    description: "Création de documentation technique conforme aux normes ISO."
  },
  {
    id: 4,
    title: "Conception 3D",
    description: "Modélisation avancée sur SolidWorks, Catia et autres logiciels de référence."
  },
  {
    id: 5,
    title: "Reprise de plans existants",
    description: "Modernisation et correction de vos documents techniques existants."
  },
  {
    id: 6,
    title: "Rédaction de dossiers techniques",
    description: "Documentation complète et précise pour vos projets industriels."
  },
  {
    id: 7,
    title: "Support projet à distance ou sur site",
    description: "Assistance ponctuelle ou continue selon vos besoins spécifiques."
  }
];

export function ServicesSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="section-padding bg-mecahub-secondary dark:bg-gray-900">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">Nos domaines d'intervention</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Notre expertise principale : le renfort technique chez le client, mais nous intervenons également sur :
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 ${
                hoveredId === service.id ? 'shadow-lg transform -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <h3 className="text-lg font-semibold text-mecahub-primary mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
