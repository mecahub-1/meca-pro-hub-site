import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import blogImage from "@/assets/blog-mission-mecahub.jpg";
import blogImageRD from "@/assets/blog-integration-rd.jpg";

const blogPosts = [
  {
    id: 2,
    title: "Intégration réussie d'un expert en R&D : quand le bon profil transforme une mission en succès durable",
    excerpt: "Découvrez comment un expert MECAHUB PRO s'est parfaitement intégré dans une équipe R&D, transformant une mission temporaire en collaboration durable.",
    image: "/lovable-uploads/9c0f76a7-0f10-49dc-ac6d-838c02a5710e.png",
    date: "2025-01-25",
    readTime: "7 min",
    category: "Cas client",
    slug: "integration-reussie-expert-rd-profil-transforme-mission-succes-durable"
  },
  {
    id: 1,
    title: "Comment se déroule une mission avec MECAHUB PRO ?",
    excerpt: "Découvrez notre méthode simple, claire et structurée pour accompagner les entreprises industrielles dans leurs projets mécaniques.",
    image: "/lovable-uploads/43a485ed-8e45-427e-a3a9-41dee32f88fb.png",
    date: "2025-01-22",
    readTime: "5 min",
    category: "Méthode",
    slug: "comment-se-deroule-une-mission-mecahub-pro"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container-padded">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="heading-1 mb-6">
                Blog MECAHUB PRO
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Découvrez nos conseils, retours d'expérience et actualités du secteur mécanique industriel
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-padding">
          <div className="container-padded">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover-scale group cursor-pointer">
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;