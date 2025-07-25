import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import blogImage from "@/assets/blog-mission-mecahub.jpg";

const blogPosts = {
  "comment-se-deroule-une-mission-mecahub-pro": {
    title: "Comment se déroule une mission avec MECAHUB PRO ?",
    subtitle: "Une méthode simple, claire et structurée",
    image: blogImage,
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