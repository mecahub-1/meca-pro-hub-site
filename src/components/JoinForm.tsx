
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function JoinForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "",
    skills: "",
    software: "",
    experience: "",
    availability: "",
    cv: null as File | null,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, cv: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'une soumission de formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, on pourrait envoyer les données à Supabase ou une autre base de données
      console.log("Profile data submitted:", formData);
      
      // Réinitialiser le formulaire
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        status: "",
        skills: "",
        software: "",
        experience: "",
        availability: "",
        cv: null,
        message: ""
      });
      
      toast({
        title: "Candidature envoyée !",
        description: "Nous étudierons votre profil et reviendrons vers vous rapidement.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Veuillez réessayer ultérieurement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom et prénom <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Sélectionnez une option</option>
            <option value="freelance">Freelance</option>
            <option value="employee">Salarié</option>
            <option value="internship">Alternance</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Compétences clés <span className="text-red-500">*</span>
        </label>
        <input
          id="skills"
          name="skills"
          type="text"
          required
          value={formData.skills}
          onChange={handleChange}
          placeholder="Ex: Conception mécanique, simulation, calcul de structures..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="software" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Logiciels maîtrisés <span className="text-red-500">*</span>
        </label>
        <input
          id="software"
          name="software"
          type="text"
          required
          value={formData.software}
          onChange={handleChange}
          placeholder="Ex: SolidWorks, Catia V5, AutoCAD..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="experience" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Secteurs d'expérience <span className="text-red-500">*</span>
        </label>
        <input
          id="experience"
          name="experience"
          type="text"
          required
          value={formData.experience}
          onChange={handleChange}
          placeholder="Ex: Automobile, Aéronautique, Agroalimentaire..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="availability" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Disponibilité <span className="text-red-500">*</span>
        </label>
        <input
          id="availability"
          name="availability"
          type="text"
          required
          value={formData.availability}
          onChange={handleChange}
          placeholder="Ex: Immédiate, Dans 1 mois, Temps partiel..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="cv" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          CV (format PDF) <span className="text-red-500">*</span>
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf"
          required
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Message libre (facultatif)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
      </button>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ces données ne seront utilisées que dans le cadre du recrutement ou d'une éventuelle mise en relation.
      </p>
    </form>
  );
}
