
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Rejoindre l'équipe", href: "/join" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen 
        ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-white/90" 
        : "bg-transparent"
    }`}>
      <nav className="container-padded flex items-center justify-between py-4">
        <div className="flex items-center gap-x-6">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-mecahub-primary">
              MecaHUB<span className="text-mecahub-contrast dark:text-mecahub-contrast">Pro</span>
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-x-6">
          <div className="flex gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-mecahub-primary ${
                  location.pathname === item.href 
                    ? "text-mecahub-primary" 
                    : "text-mecahub-contrast dark:text-mecahub-contrast"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="ml-2 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block rounded-md py-2 px-3 text-base font-medium ${
                  location.pathname === item.href
                    ? "bg-mecahub-primary/10 text-mecahub-primary"
                    : "text-mecahub-contrast hover:bg-mecahub-secondary hover:text-mecahub-primary dark:text-mecahub-contrast dark:hover:bg-mecahub-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
