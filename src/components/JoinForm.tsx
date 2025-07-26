
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { validateFile, sanitizeFilename, FILE_VALIDATION_CONFIGS } from "@/utils/fileValidation";
import { validateFormData, sanitizeInput, VALIDATION_RULES } from "@/utils/inputValidation";
import { formSubmissionLimiter, getRateLimitIdentifier } from "@/utils/rateLimiting";

export function JoinForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "",
    position: [] as string[],
    positionOther: "",
    skills: [] as string[],
    skillsOther: "",
    software: [] as string[],
    softwareOther: "",
    experience: [] as string[],
    experienceOther: "",
    availability: "",
    cv: null as File | null,
    message: ""
  });

  // Options pour les cases à cocher
  const positionOptions = [
    "Dessinateur projeteur mécanique",
    "Ingénieur mécanique",
    "Ingénieur calcul/simulation",
    "Chef de projet mécanique",
    "Responsable bureau d'études",
    "Technicien mécanique",
    "Ingénieur R&D",
    "Concepteur 3D",
    "Ingénieur produit"
  ];

  const skillsOptions = [
    "Conception mécanique",
    "Calcul de structures",
    "Simulation numérique (FEM)",
    "Analyse des contraintes",
    "Mécanique des fluides (CFD)",
    "Thermodynamique",
    "Résistance des matériaux",
    "Assemblage mécanique",
    "Tolérancement dimensionnel",
    "Gestion de projet",
    "Prototypage",
    "Validation expérimentale"
  ];

  const softwareOptions = [
    "SolidWorks",
    "Catia V5/V6",
    "AutoCAD",
    "Inventor",
    "Creo/Pro-E",
    "NX (Unigraphics)",
    "Fusion 360",
    "Ansys",
    "Abaqus",
    "Comsol",
    "Matlab/Simulink",
    "SolidWorks Simulation",
    "KeyShot",
    "3ds Max/Maya"
  ];

  const experienceOptions = [
    "Automobile",
    "Aéronautique",
    "Agroalimentaire",
    "Energie/Pétrole",
    "Ferroviaire",
    "Naval/Maritime",
    "Médical/Pharmaceutique",
    "Électronique/High-tech",
    "Bâtiment/Construction",
    "Machines spéciales",
    "Métallurgie",
    "Plasturgie",
    "Packaging",
    "Robotique/Automatisme"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear errors when user modifies input
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: 'position' | 'skills' | 'software' | 'experience', value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      return { ...prev, [field]: newArray };
    });
    
    // Clear errors when user modifies input
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file immediately
      const validation = validateFile(file, FILE_VALIDATION_CONFIGS.CV);
      if (!validation.isValid) {
        toast({
          title: "CV invalide",
          description: validation.error,
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }
      
      setFormData((prev) => ({ ...prev, cv: file }));
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
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur lors de l'upload: ${response.status}`);
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
    setValidationErrors({});

    try {
      // Rate limiting check
      const rateLimitId = getRateLimitIdentifier(undefined, formData.email);
      if (!formSubmissionLimiter.isAllowed(rateLimitId)) {
        const remainingTime = Math.ceil(formSubmissionLimiter.getRemainingTime(rateLimitId) / 1000);
        throw new Error(`Trop de tentatives. Réessayez dans ${remainingTime} secondes.`);
      }

      // Convert arrays to strings and combine with "other" fields
      const positionString = formData.position.length > 0 
        ? [...formData.position, ...(formData.positionOther ? [formData.positionOther] : [])].join(', ')
        : formData.positionOther;
      
      const skillsString = formData.skills.length > 0 
        ? [...formData.skills, ...(formData.skillsOther ? [formData.skillsOther] : [])].join(', ')
        : formData.skillsOther;
      
      const softwareString = formData.software.length > 0 
        ? [...formData.software, ...(formData.softwareOther ? [formData.softwareOther] : [])].join(', ')
        : formData.softwareOther;
      
      const experienceString = formData.experience.length > 0 
        ? [...formData.experience, ...(formData.experienceOther ? [formData.experienceOther] : [])].join(', ')
        : formData.experienceOther;

      // Validate all form data
      const validation = validateFormData({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: positionString,
        skills: skillsString,
        software: softwareString,
        experience: experienceString,
        availability: formData.availability,
        message: formData.message
      });

      const errors: Record<string, string[]> = {};
      let hasErrors = false;

      Object.entries(validation).forEach(([field, result]) => {
        if (!result.isValid) {
          errors[field] = result.errors;
          hasErrors = true;
        }
      });

      // Validate required select field
      if (!formData.status) {
        errors.status = ['Ce champ est obligatoire'];
        hasErrors = true;
      }

      // Validate CV file
      if (!formData.cv) {
        errors.cv = ['Le CV est obligatoire'];
        hasErrors = true;
      }

      if (hasErrors) {
        setValidationErrors(errors);
        toast({
          title: "Erreurs de validation",
          description: "Veuillez corriger les erreurs dans le formulaire.",
          variant: "destructive",
        });
        return;
      }
      
      // Uploader le CV
      const uploadResult = await uploadFile(formData.cv!);

      // Données à envoyer à l'API
      const emailData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        position: positionString,
        skills: skillsString,
        software: softwareString,
        experience: experienceString,
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
          position: positionString,
          skills: skillsString,
          software: softwareString,
          experience: experienceString,
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
        position: [] as string[],
        positionOther: "",
        skills: [] as string[],
        skillsOther: "",
        software: [] as string[],
        softwareOther: "",
        experience: [] as string[],
        experienceOther: "",
        availability: "",
        cv: null,
        message: ""
      });
      
      // Clear file input
      const fileInput = document.getElementById('cv') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.fullName && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.fullName[0]}
            </div>
          )}
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.email && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.email[0]}
            </div>
          )}
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.phone && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.phone[0]}
            </div>
          )}
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
            <SelectTrigger className={`w-full ${validationErrors.status ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent className="animate-none">
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="employee">Salarié</SelectItem>
              <SelectItem value="internship">Alternance</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.status && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.status[0]}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Poste à occuper <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md dark:border-gray-700">
          {positionOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`position-${option}`}
                checked={formData.position.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('position', option, checked as boolean)}
              />
              <label
                htmlFor={`position-${option}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="position-other"
              checked={!!formData.positionOther}
              onCheckedChange={(checked) => {
                if (!checked) {
                  setFormData(prev => ({ ...prev, positionOther: "" }));
                }
              }}
            />
            <label htmlFor="position-other" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Autres:
            </label>
          </div>
          {(formData.positionOther !== "" || formData.position.includes("Autres")) && (
            <input
              type="text"
              placeholder="Précisez..."
              value={formData.positionOther}
              onChange={(e) => setFormData(prev => ({ ...prev, positionOther: e.target.value }))}
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          )}
        </div>
        {validationErrors.position && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.position[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Compétences clés <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md dark:border-gray-700">
          {skillsOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`skills-${option}`}
                checked={formData.skills.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('skills', option, checked as boolean)}
              />
              <label
                htmlFor={`skills-${option}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skills-other"
              checked={!!formData.skillsOther}
              onCheckedChange={(checked) => {
                if (!checked) {
                  setFormData(prev => ({ ...prev, skillsOther: "" }));
                }
              }}
            />
            <label htmlFor="skills-other" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Autres:
            </label>
          </div>
          {(formData.skillsOther !== "" || formData.skills.includes("Autres")) && (
            <input
              type="text"
              placeholder="Précisez..."
              value={formData.skillsOther}
              onChange={(e) => setFormData(prev => ({ ...prev, skillsOther: e.target.value }))}
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          )}
        </div>
        {validationErrors.skills && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.skills[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Logiciels maîtrisés <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md dark:border-gray-700">
          {softwareOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`software-${option}`}
                checked={formData.software.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('software', option, checked as boolean)}
              />
              <label
                htmlFor={`software-${option}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="software-other"
              checked={!!formData.softwareOther}
              onCheckedChange={(checked) => {
                if (!checked) {
                  setFormData(prev => ({ ...prev, softwareOther: "" }));
                }
              }}
            />
            <label htmlFor="software-other" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Autres:
            </label>
          </div>
          {(formData.softwareOther !== "" || formData.software.includes("Autres")) && (
            <input
              type="text"
              placeholder="Précisez..."
              value={formData.softwareOther}
              onChange={(e) => setFormData(prev => ({ ...prev, softwareOther: e.target.value }))}
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          )}
        </div>
        {validationErrors.software && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.software[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Secteurs d'expérience <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md dark:border-gray-700">
          {experienceOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`experience-${option}`}
                checked={formData.experience.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange('experience', option, checked as boolean)}
              />
              <label
                htmlFor={`experience-${option}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="experience-other"
              checked={!!formData.experienceOther}
              onCheckedChange={(checked) => {
                if (!checked) {
                  setFormData(prev => ({ ...prev, experienceOther: "" }));
                }
              }}
            />
            <label htmlFor="experience-other" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Autres:
            </label>
          </div>
          {(formData.experienceOther !== "" || formData.experience.includes("Autres")) && (
            <input
              type="text"
              placeholder="Précisez..."
              value={formData.experienceOther}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceOther: e.target.value }))}
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          )}
        </div>
        {validationErrors.experience && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.experience[0]}
          </div>
        )}
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
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            validationErrors.availability ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.availability && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.availability[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="cv" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          CV ou autres documents (format PDF) <span className="text-red-500">*</span>
        </label>
        <div className="space-y-1">
          <input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf"
            required
            onChange={handleFileChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.cv ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-500">
            Format accepté: PDF uniquement (max 10MB)
          </p>
          {validationErrors.cv && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.cv[0]}
            </div>
          )}
        </div>
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
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none ${
            validationErrors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        ></textarea>
        {validationErrors.message && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.message[0]}
          </div>
        )}
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
