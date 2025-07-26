import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import blogImage from "@/assets/blog-mission-mecahub.jpg";
import blogImageRD from "@/assets/blog-integration-rd.jpg";

const blogPosts = {
  "comment-se-deroule-une-mission-mecahub-pro": {
    title: "Comment se déroule une mission avec MECAHUB PRO ?",
    subtitle: "Une méthode simple, claire et structurée",
    image: "/lovable-uploads/43a485ed-8e45-427e-a3a9-41dee32f88fb.png",
    date: "2025-01-22",
    readTime: "5 min",
    category: "Méthode",
    content: `
Chez MECAHUB PRO, nous accompagnons les entreprises industrielles dans la réussite de leurs projets mécaniques en leur proposant des experts techniques immédiatement opérationnels.
Mais comment se déroule concrètement une mission ? Voici notre approche étape par étape.

## 1. 🎯 Compréhension précise de vos besoins

Tout commence par un échange clair et ciblé :
Nous analysons avec vous :

- La nature du projet
- Les compétences requises (logiciels, expérience, autonomie…)
- La durée et la charge estimée
- Le mode d'intervention souhaité (sur site, à distance, hybride)

Notre objectif est de vous proposer une solution parfaitement adaptée, ni plus ni moins.

## 2. 🔍 Sélection du bon profil technique

En fonction de votre besoin, nous sélectionnons un ou plusieurs experts de notre réseau :

- Techniciens ou ingénieurs
- Indépendants ou salariés de MECAHUB PRO
- Spécialisés dans votre secteur (automobile, machines spéciales, tôlerie, plasturgie, etc.)

Vous ne choisissez pas un CV, vous choisissez un résultat.
Chaque profil proposé est déjà validé techniquement par nos soins.

## 3. 🛠️ Mise en place de la mission

Une fois le profil validé :

- La mission est cadrée par un devis clair ou un contrat forfaitaire
- Les objectifs et livrables sont définis ensemble
- Un point de démarrage est fixé avec vos équipes

Nos intervenants s'intègrent à vos process existants (logiciels, méthodes, fournisseurs) sans perturber votre organisation.

## 4. 📈 Suivi régulier de la prestation

Pendant toute la durée de la mission :

- Vous gardez un contact direct avec l'intervenant
- MECAHUB PRO assure un suivi discret mais rigoureux
- En cas de besoin, nous ajustons le périmètre ou les délais avec réactivité

Notre but est simple : que le projet avance efficacement, sans perte de temps ni tension.

## 5. 📂 Livraison des livrables & transmission complète

En fin de mission, vous recevez :

- Les fichiers CAO et documents techniques dans vos formats internes
- Une base claire de fournisseurs ou de choix techniques, si applicable
- Une documentation structurée, prête à être reprise par vos équipes

➡️ Le savoir produit reste chez vous. Rien ne repart, tout est transmissible.

## 🤝 Une relation basée sur la confiance

Chez MECAHUB PRO, nous ne plaçons pas des profils pour "remplir une case".
Nous apportons une solution concrète, calibrée, fiable, pour vous faire gagner du temps, sécuriser vos projets et fluidifier vos ressources.

Vous avez un besoin ponctuel ? Un projet à lancer rapidement ?
Nous pouvons vous aider.

📩 Contact : contact@mecahub-pro.fr  
🌐 En savoir plus : www.mecahub-pro.fr
    `
  },
  "integration-reussie-expert-rd-profil-transforme-mission-succes-durable": {
    title: "Intégration réussie d'un expert en R&D : quand le bon profil transforme une mission en succès durable",
    subtitle: "Contexte : un projet R&D stratégique mais une équipe à effectif constant",
    image: "/lovable-uploads/230311eb-752a-4b7f-9325-ba59bf0e6750.png",
    date: "2025-01-25",
    readTime: "7 min",
    category: "Cas client",
    content: `
Une entreprise industrielle spécialisée dans les équipements de haute précision préparait un nouveau produit en R&D, avec des enjeux forts en termes de conception, fiabilité et délai.

❗ Le problème : l'entreprise ne souhaitait pas agrandir son équipe en interne à ce stade du développement, pour des raisons de charge variable, de budget, et de stratégie RH.

Pour avancer sans perturber son organisation, elle a fait appel à MECAHUB PRO afin de renforcer son bureau d'études avec un intervenant externe, pour une mission initiale de 8 mois.

## 🎯 Objectif de la mission

- Intervenir en interne au sein du BE, 5 jours par semaine
- Travailler sur la conception complète d'un sous-système mécanique
- Participer aux choix techniques, aux revues de conception, à l'optimisation du design
- S'intégrer pleinement à l'équipe R&D sans créer de rupture de méthode ou de communication

## 👨‍💻 Notre solution : un expert technique parfaitement intégré

MECAHUB PRO a proposé un profil technique solide, maîtrisant parfaitement les outils CAO utilisés par le client et avec une excellente capacité d'adaptation aux environnements industriels exigeants.

Dès la première semaine :

- Le consultant s'est intégré naturellement dans les rituels de l'équipe
- Il a adopté les méthodes et outils internes du BE
- Il a apporté des idées neuves et structurées, sans perturber les process existants

> "On avait l'impression qu'il faisait partie de l'équipe depuis des années. Il posait les bonnes questions, avançait sans blocage, et restait aligné avec notre logique de développement."
> — Chef de projet R&D

## 📆 Une mission prolongée, puis convertie en CDI

Initialement prévue pour 8 mois, la mission a été prolongée de 7 mois supplémentaires.

Pourquoi ?
➡️ Parce que l'expert apportait une vraie valeur métier,
➡️ Parce qu'il participait à la transmission d'informations techniques,
➡️ Et surtout, parce que son comportement professionnel et sa rigueur inspiraient confiance.

Finalement, le client a proposé un CDI, que le consultant a accepté après accord tripartite.

> "Ce n'était pas prévu. Mais à force de travailler avec lui, la question s'est posée naturellement. C'était devenu un élément structurant de notre équipe R&D."

## 🔍 Ce qu'il faut retenir

- Un prestataire externe bien sélectionné peut s'intégrer aussi bien qu'un salarié, sans perturber l'équilibre interne.
- Il est possible de faire avancer un projet ambitieux tout en gardant la souplesse d'une mission, sans engagement RH initial.
- Et quand la mission devient stratégique, rien n'empêche une collaboration long terme, y compris une embauche si les deux parties le souhaitent.

## 🛠️ Notre rôle chez MECAHUB PRO

Nous ne proposons pas "des CV".
Nous plaçons des experts fiables, professionnels, adaptés à vos contraintes, capables :

- De s'intégrer à vos équipes,
- D'être efficaces rapidement,
- Et de vous faire gagner du temps, sans désorganiser vos équipes internes.

📩 Vous avez un projet stratégique mais pas les ressources en interne ?
Vous souhaitez renforcer votre bureau d'études sans alourdir votre structure ?

➡️ Contactez-nous : contact@mecahub-pro.fr
➡️ En savoir plus : www.mecahub-pro.fr
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-2 mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="heading-3 mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold mb-4">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('➡️')) {
        return <p key={index} className="bg-primary/5 p-4 rounded-lg mb-4 font-medium">{line}</p>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="section-padding">
          <div className="container-padded">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="heading-1 mb-4">{post.title}</h1>
              <p className="text-xl text-primary font-medium mb-8">{post.subtitle}</p>
              
              <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <div className="text-foreground">
                {formatContent(post.content)}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary/5">
          <div className="container-padded">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-2 mb-4">Vous avez un projet ?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Parlons de votre besoin et trouvons ensemble la solution adaptée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/join">Rejoindre nos experts</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;