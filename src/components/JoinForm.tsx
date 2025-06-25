import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function JoinForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "",
    position: "",
    skills: "",
    software: "",
    experience: "",
    availability: "",
    cv: null as File | null,
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, cv: e.target.files![0] }));
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("formType", "job");

      const response = await fetch(
        "https://jswapqasgatjjwgbrsdc.supabase.co/functions/v1/upload-file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de l'upload: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur d'upload:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.cv) {
        throw new Error("Le CV est obligatoire.");
      }
      
      // Uploader le CV
      const uploadResult = await uploadFile(formData.cv);

      // Données à envoyer à l'API
      const emailData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        position: formData.position,
        skills: formData.skills,
        software: formData.software,
        experience: formData.experience,
        availability: formData.availability,
        message: formData.message,
        cvData: {
          fileName: uploadResult.fileName,
          fileUrl: uploadResult.fileUrl
        }
      };

      // Enregistrer la candidature dans la base de données
      const { data: jobData, error: jobError } = await supabase
        .from("job_applications")
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          position: formData.position,
          skills: formData.skills,
          software: formData.software,
          experience: formData.experience,
          availability: formData.availability,
          message: formData.message,
          cv_path: uploadResult.fileUrl
        });

      if (jobError) {
        console.error("Erreur d'enregistrement en base:", jobError);
      }

      // Envoyer l'email
      const response = await fetch(
        "https://jswapqasgatjjwgbrsdc.supabase.co/functions/v1/send-form-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formType: "job",
            formData: emailData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi du formulaire");
      }

      // Réinitialiser le formulaire
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        status: "",
        position: "",
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
    } catch (error: any) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: error.message || "Veuillez réessayer ultérieurement.",
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent className="animate-none">
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="employee">Salarié</SelectItem>
              <SelectItem value="internship">Alternance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="position" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Poste à occuper <span className="text-red-500">*</span>
        </label>
        <input
          id="position"
          name="position"
          type="text"
          required
          value={formData.position}
          onChange={handleChange}
          placeholder="Ex: Dessinateur projeteur mécanique, Ingénieur mécanique..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
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
          CV ou autres documents (format PDF) <span className="text-red-500">*</span>
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
