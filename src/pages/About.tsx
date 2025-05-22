
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Clock, Check, FileText, Shield } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
const commitments = [{
  icon: Clock,
  title: "Réactivité opérationnelle",
  description: "Retour sous 24h pour toute demande de renfort ou devis"
}, {
  icon: Check,
  title: "Compétence éprouvée",
  description: "Profils validés avec références, autonomie et maîtrise des outils CAO"
}, {
  icon: FileText,
  title: "Livrables normés et clairs",
  description: "Documentation technique selon vos standards internes (norme ISO)"
}, {
  icon: Shield,
  title: "Discrétion et confidentialité",
  description: "Engagement contractuel de non-divulgation, même sur site client"
}];
const About = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="section-padding bg-mecahub-secondary dark:bg-gray-900 pt-28">
          <div className="container-padded">
            <div className="max-w-4xl mx-auto">
              <h1 className="heading-1 text-mecahub-contrast dark:text-white mb-6">
                Un partenaire technique fiable, expérimenté, et opérationnel
              </h1>
            </div>
          </div>
        </section>
        
        {/* Main Content Section */}
        <section className="section-padding bg-white dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg font-medium border-l-4 border-mecahub-primary pl-4 italic">Fondé par une équipe d'ingénieurs et dessinateur projeteurs, MecaHUB Pro est un bureau de prestation technique indépendant, spécialisé dans l'externalisation et le renfort d'expertise mécanique.</p>
                  
                  <p className="text-gray-700 dark:text-gray-300 my-6">
                    Nous accompagnons les services industriels, bureaux d'études et directions projets 
                    dans la réalisation de leurs objectifs grâce à une approche opérationnelle, 
                    structurée et alignée sur les standards professionnels du secteur.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Notre valeur ajoutée repose sur notre capacité à déployer rapidement des profils 
                    qualifiés – indépendants ou salariés – au sein de vos équipes, pour répondre à 
                    vos pics d'activité, besoins de renfort, ou phases critiques.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8">
                    Que vous soyez une PME, une ETI ou un groupe international, nous intégrons vos méthodes, 
                    vos outils, et vos exigences qualité avec une exigence constante de livrables propres, 
                    documentés, et directement exploitables.
                  </p>
                </div>
                
                {/* Secondary image moved lower to align with commitment cards */}
                <div className="mx-auto max-w-md lg:max-w-full mt-16 lg:mt-[4.5rem]">
                  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    
                  </div>
                </div>
              </div>
              
              {/* Right Column - Image and Commitments */}
              <div className="space-y-10">
                {/* Main Professional Image */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <AspectRatio ratio={4 / 3}>
                    <img src="/lovable-uploads/7ebce9b3-aa36-429b-b0e9-9c80245c3f02.png" alt="Ingénieurs en situation professionnelle autour d'une maquette 3D" className="object-cover w-full h-full" />
                  </AspectRatio>
                </div>
                
                {/* Our Commitments Section */}
                <div>
                  <h2 className="heading-3 mb-6 text-mecahub-contrast dark:text-white">Nos engagements</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {commitments.map((commitment, index) => <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-l-4 border-mecahub-primary">
                        <CardContent className="p-5 flex items-start space-x-4">
                          <div className="bg-mecahub-primary/10 p-2 rounded-full">
                            <commitment.icon className="h-6 w-6 text-mecahub-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-mecahub-contrast dark:text-white">
                              {commitment.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              {commitment.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial/Reference Section */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-6xl mx-auto bg-mecahub-secondary/50 dark:bg-gray-700/50 p-8 rounded-lg w-full">
                <div className="flex items-center mb-4">
                  <Badge variant="outline" className="text-mecahub-primary bg-mecahub-primary/10 border-mecahub-primary/20">
                    Nos références
                  </Badge>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                  MecaHUB Pro intervient régulièrement auprès d'acteurs de l'automobile, de l'agro-industrie, de la machine spéciale et du ferroviaire. 
                  Nos interventions sont menées avec la même rigueur, qu'il s'agisse d'un projet court en PME ou d'un déploiement prolongé dans un environnement industriel exigeant.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-3">
                  <Badge variant="secondary">Automobile</Badge>
                  <Badge variant="secondary">Agro-industrie</Badge>
                  <Badge variant="secondary">Machine spéciale</Badge>
                  <Badge variant="secondary">Ferroviaire</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default About;
