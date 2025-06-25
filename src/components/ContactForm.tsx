import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
    // Effacer les erreurs lorsque l'utilisateur modifie le formulaire
    setApiError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
      // Effacer les erreurs lorsque l'utilisateur modifie le formulaire
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
        throw new Error(`Erreur lors de l'upload: ${responseData.error || response.status}`);
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

    try {
      // Données à envoyer à l'API
      let emailData: any = {
        company: formData.company,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        requestType: formData.requestType,
        details: formData.details,
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
        
        // FIX: Check if details exists and if it's a string before using includes()
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
        Les données saisies sont utilisées pour établir votre devis et assurer le suivi de votre demande. 
        Vos informations ne seront pas transmises à des tiers.
      </p>
    </form>
  );
}
