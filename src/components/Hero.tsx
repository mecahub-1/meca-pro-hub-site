import { Link } from "react-router-dom";
export function Hero() {
  return <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      filter: "brightness(0.7) saturate(1.1)"
    }}></div>
      
      {/* Gradient overlay with background image */}
      <div className="hero-overlay mx-0 px-0" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: "0.3"
    }}></div>
      
      {/* Gradient overlay */}
      <div className="hero-overlay mx-0 px-0 bg-transparent"></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center mx-auto">
        <h1 className="animate-fade-in-up heading-1 text-white mb-6 max-w-4xl mx-auto text-center">
          MecaHUB Pro – Votre renfort technique en ingénierie mécanique.
        </h1>
        <p className="animate-fade-in-up animation-delay-200 text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto text-center">
          Nous intervenons directement au sein de vos équipes pour assurer vos projets techniques, 
          combler un besoin temporaire ou externaliser certaines tâches stratégiques.
        </p>
        <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/contact" className="btn-primary">
            Demander un devis
          </Link>
          <Link to="/join" className="btn-secondary">
            Proposer mon profil
          </Link>
        </div>
      </div>
    </div>;
}