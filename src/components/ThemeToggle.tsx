
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check if user has a preferred theme in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      // Default to dark mode if no preference is stored or if dark is preferred
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full w-9 h-9 p-0"
    >
      <Sun className={`h-5 w-5 rotate-0 scale-100 transition-all ${theme === 'dark' ? 'opacity-0 scale-0' : 'opacity-100'}`} />
      <Moon className={`absolute h-5 w-5 rotate-90 transition-all ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 scale-0'}`} />
    </Button>
  );
}
