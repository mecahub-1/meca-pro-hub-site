
import { Check } from "lucide-react";

const reasons = [
  {
    id: 1,
    title: "Interventions rapides et souples",
    description: "Nous nous adaptons à votre planning et répondons aux urgences."
  },
  {
    id: 2,
    title: "Prestation documentée",
    description: "Exploitable immédiatement par vos équipes."
  },
  {
    id: 3,
    title: "Réseau validé de professionnels expérimentés",
    description: "Des compétences éprouvées et une expertise reconnue."
  },
  {
    id: 4,
    title: "Communication claire",
    description: "Délais respectés, interlocuteur unique."
  }
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-mecahub-primary text-white">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-2 mb-4">Pourquoi choisir MecaHUB Pro</h2>
          <p className="text-white/80">
            Notre engagement envers l'excellence technique et le service client nous différencie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason) => (
            <div key={reason.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-white p-1">
                <Check className="h-5 w-5 text-mecahub-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                <p className="text-white/80">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
