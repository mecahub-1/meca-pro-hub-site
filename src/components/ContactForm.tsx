
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    requestType: "",
    details: "",
    urgency: "",
    file: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'une soumission de formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, on pourrait envoyer les données à Supabase ou une autre base de données
      console.log("Form data submitted:", formData);
      
      // Réinitialiser le formulaire
      setFormData({
        company: "",
        name: "",
        email: "",
        phone: "",
        requestType: "",
        details: "",
        urgency: "",
        file: null
      });
      
      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons dans les plus brefs délais.",
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
          <label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom du contact <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email professionnel <span className="text-red-500">*</span>
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
      </div>
      
      <div className="space-y-2">
        <label htmlFor="requestType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Objet de la demande <span className="text-red-500">*</span>
        </label>
        <select
          id="requestType"
          name="requestType"
          required
          value={formData.requestType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Sélectionnez une option</option>
          <option value="reinforcement">Renfort technique</option>
          <option value="plans">Mise en plan</option>
          <option value="study">Étude</option>
          <option value="other">Autre</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="details" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Détail de la demande <span className="text-red-500">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={5}
          required
          value={formData.details}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
        ></textarea>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="urgency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Urgence <span className="text-red-500">*</span>
        </label>
        <select
          id="urgency"
          name="urgency"
          required
          value={formData.urgency}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="">Sélectionnez une option</option>
          <option value="immediate">Immédiat</option>
          <option value="oneWeek">1 semaine</option>
          <option value="notUrgent">Non urgent</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload fichier (optionnel)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Les données saisies sont utilisées uniquement pour vous recontacter. 
        Aucun traitement commercial ou externe ne sera effectué.
      </p>
    </form>
  );
}
