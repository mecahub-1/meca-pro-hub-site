
import { Check, Award, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const reasons = [
  {
    id: 1,
    title: "Interventions rapides et souples",
    description: "Nous nous adaptons à votre planning et répondons aux urgences.",
    icon: Check
  },
  {
    id: 2,
    title: "Prestation documentée",
    description: "Exploitable immédiatement par vos équipes.",
    icon: ShieldCheck
  },
  {
    id: 3,
    title: "Réseau validé de professionnels expérimentés",
    description: "Des compétences éprouvées et une expertise reconnue.",
    icon: Award
  },
  {
    id: 4,
    title: "Communication claire",
    description: "Délais respectés, interlocuteur unique.",
    icon: Star
  }
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-mecahub-primary text-white">
      <div className="container-padded">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 mb-5">Pourquoi choisir MecaHUB Pro</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Notre engagement envers l'excellence technique et le service client nous différencie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason) => (
            <Card key={reason.id} className="bg-white/10 backdrop-blur-sm border-none hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-white p-3 mb-5 shadow-glow">
                  <reason.icon className="h-8 w-8 text-mecahub-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">{reason.title}</h3>
                <p className="text-white/80">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
