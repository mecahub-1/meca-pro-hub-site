import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, AlertTriangle } from "lucide-react";
import { validateFile, sanitizeFilename, FILE_VALIDATION_CONFIGS } from "@/utils/fileValidation";
import { validateFormData, sanitizeInput, VALIDATION_RULES } from "@/utils/inputValidation";
import { formSubmissionLimiter, getRateLimitIdentifier } from "@/utils/rateLimiting";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Applique une sanitisation légère seulement pour les champs de texte court
    const sanitizedValue = name === 'details' ? value : sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear errors when user modifies input
    setApiError(null);
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
    setApiError(null);
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file immediately
      const validation = validateFile(file, FILE_VALIDATION_CONFIGS.CONTACT_FILE);
      if (!validation.isValid) {
        toast({
          title: "Fichier invalide",
          description: validation.error,
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }
      
      setFormData((prev) => ({ ...prev, file }));
      setApiError(null);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("formType", "contact");

      console.log("Uploading file:", file.name);
      
      const response = await fetch(
        "https://jswapqasgatjjwgbrsdc.supabase.co/functions/v1/upload-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Upload response not OK:", responseData);
        throw new Error(responseData.error || `Erreur lors de l'upload: ${response.status}`);
      }

      console.log("File upload successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Erreur d'upload:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setValidationErrors({});

    try {
      // Rate limiting check
      const rateLimitId = getRateLimitIdentifier(undefined, formData.email);
      if (!formSubmissionLimiter.isAllowed(rateLimitId)) {
        const remainingTime = Math.ceil(formSubmissionLimiter.getRemainingTime(rateLimitId) / 1000);
        throw new Error(`Trop de tentatives. Réessayez dans ${remainingTime} secondes.`);
      }

      // Validate all form data - sanitise seulement au moment de la soumission
      const validation = validateFormData({
        company: sanitizeInput(formData.company),
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        details: sanitizeInput(formData.details)
      });

      const errors: Record<string, string[]> = {};
      let hasErrors = false;

      Object.entries(validation).forEach(([field, result]) => {
        if (!result.isValid) {
          errors[field] = result.errors;
          hasErrors = true;
        }
      });

      // Validate required select fields
      if (!formData.requestType) {
        errors.requestType = ['Ce champ est obligatoire'];
        hasErrors = true;
      }
      if (!formData.urgency) {
        errors.urgency = ['Ce champ est obligatoire'];
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

      // Données à envoyer à l'API - sanitise au moment de l'envoi
      let emailData: any = {
        company: sanitizeInput(formData.company),
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        requestType: formData.requestType,
        details: sanitizeInput(formData.details),
        urgency: formData.urgency,
      };

      // Uploader le fichier si présent
      if (formData.file) {
        try {
          console.log("Starting file upload");
          const uploadResult = await uploadFile(formData.file);
          console.log("Upload complete:", uploadResult);
          
          if (uploadResult && uploadResult.fileUrl) {
            emailData.fileData = {
              fileName: uploadResult.fileName,
              fileUrl: uploadResult.fileUrl
            };
          } else {
            console.error("Missing file URL in upload result");
            toast({
              title: "Erreur lors de l'upload du fichier",
              description: "Format de réponse incorrect de l'API d'upload.",
              variant: "destructive",
            });
          }
        } catch (uploadError) {
          console.error("Erreur lors de l'upload:", uploadError);
          toast({
            title: "Erreur lors de l'upload du fichier",
            description: "Votre demande sera envoyée sans la pièce jointe.",
            variant: "destructive",
          });
        }
      }

      // Enregistrer la demande dans la base de données
      console.log("Saving contact request to database");
      const { data: contactData, error: contactError } = await supabase
        .from("contact_requests")
        .insert({
          company: formData.company,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          request_type: formData.requestType,
          details: formData.details,
          urgency: formData.urgency,
          file_path: emailData.fileData?.fileUrl || null
        });

      if (contactError) {
        console.error("Erreur d'enregistrement en base:", contactError);
        // Continue anyway to try sending the email
      } else {
        console.log("Contact request saved to database");
      }

      // Envoyer l'email
      console.log("Sending email with data:", emailData);
      const response = await fetch(
        "https://jswapqasgatjjwgbrsdc.supabase.co/functions/v1/send-form-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formType: "contact",
            formData: emailData,
          }),
        }
      );

      const emailResponseData = await response.json();
      console.log("Email API response:", emailResponseData);

      if (!response.ok) {
        console.error("Email sending failed:", emailResponseData);
        
        if (emailResponseData.details && 
            typeof emailResponseData.details === 'string' && 
            emailResponseData.details.includes("L'administrateur doit configurer")) {
          setApiError("La configuration d'envoi d'emails n'est pas complète. Votre demande a été enregistrée et nous la traiterons dès que possible.");
        } else {
          throw new Error(emailResponseData.error || emailResponseData.details || "Erreur lors de l'envoi du formulaire");
        }
      }

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
      
      // Clear file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons dans les plus brefs délais.",
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
      {apiError && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
      
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.company ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.company && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.company[0]}
            </div>
          )}
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.name && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {validationErrors.name[0]}
            </div>
          )}
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
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Objet de la demande <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.requestType}
          onValueChange={(value) => handleSelectChange("requestType", value)}
          required
        >
          <SelectTrigger className={`w-full ${validationErrors.requestType ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Sélectionnez une option" />
          </SelectTrigger>
          <SelectContent className="animate-none">
            <SelectItem value="reinforcement">Renfort technique</SelectItem>
            <SelectItem value="plans">Mise en plan</SelectItem>
            <SelectItem value="study">Étude</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
        {validationErrors.requestType && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.requestType[0]}
          </div>
        )}
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
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none ${
            validationErrors.details ? 'border-red-500' : 'border-gray-300'
          }`}
        ></textarea>
        {validationErrors.details && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.details[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Urgence <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.urgency}
          onValueChange={(value) => handleSelectChange("urgency", value)}
          required
        >
          <SelectTrigger className={`w-full ${validationErrors.urgency ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Sélectionnez une option" />
          </SelectTrigger>
          <SelectContent className="animate-none">
            <SelectItem value="immediate">Immédiat</SelectItem>
            <SelectItem value="oneWeek">1 semaine</SelectItem>
            <SelectItem value="notUrgent">Non urgent</SelectItem>
          </SelectContent>
        </Select>
        {validationErrors.urgency && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {validationErrors.urgency[0]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload fichier (optionnel)
        </label>
        <div className="space-y-1">
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mecahub-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-500">
            Formats acceptés: PDF, DOC, DOCX, JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Les données saisies sont utilisées pour établir votre devis et assurer le suivi de votre demande. 
        Vos informations ne seront pas transmises à des tiers.
      </p>
    </form>
  );
}
