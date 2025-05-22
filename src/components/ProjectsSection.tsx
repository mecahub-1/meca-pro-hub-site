
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Remplacement d'un dessinateur projeteur dans un bureau d'étude",
    description: "6 mois en présentiel, pour épauler un ingénieur sur un projet interne. Gestion complète du dossier technique",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 2,
    title: "Support technique sur site pour une ligne d'assemblage agroalimentaire",
    description: "Réingénierie, validation, mise en plan",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 3,
    title: "Production d'une liasse complète de plans normalisés ISO",
    description: "Plus de 85 plans de détails et des plans d'ensemble pour un fabricant de presses hydrauliques (100% à distance)",
    image: "/lovable-uploads/56f0da4b-20e7-4304-9415-cff4078b1fc4.png"
  }
];

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <section className="section-padding bg-white dark:bg-gray-800">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-2 text-mecahub-contrast dark:text-white mb-4">Nos réalisations</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Des exemples concrets de nos missions récentes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div 
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${project.image})`
                }}
              ></div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300 ${
                activeProject === project.id ? 'opacity-100' : 'opacity-95'
              }`}>
                <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-white/80 text-sm">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <p className="text-lg font-medium text-mecahub-primary dark:text-blue-400">Et bien plus encore...</p>
        </div>
      </div>
    </section>
  );
}
