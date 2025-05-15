
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-mecahub-contrast text-white py-12">
      <div className="container-padded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MecaHUB Pro</h3>
            <p className="text-gray-300 mb-4">
              Votre renfort technique en ingénierie mécanique.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-gray-300 hover:text-white transition-colors">
                  Rejoindre l'équipe
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Mentions légales</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal" className="text-gray-300 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} MecaHUB Pro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
