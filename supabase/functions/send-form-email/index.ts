import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

// Use proper environment variable for Resend API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const recipientEmail = Deno.env.get("RECIPIENT_EMAIL") || "contact@mecahub.fr";

// Log validation of API keys
console.log(`Resend API key present: ${!!resendApiKey}`);
console.log(`Recipient email present: ${!!recipientEmail}`);

// Vérifier si les clés API sont présentes
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set");
}

// Initialiser Resend uniquement si la clé API est disponible
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Création du client Supabase
const supabaseUrl = "https://jswapqasgatjjwgbrsdc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  requestType: string;
  details: string;
  urgency: string;
  fileData?: {
    fileName: string;
    fileUrl: string;
  };
}

interface JobApplicationData {
  fullName: string;
  email: string;
  phone: string;
  status: string;
  skills: string;
  software: string;
  experience: string;
  availability: string;
  cvData?: {
    fileName: string;
    fileUrl: string;
  };
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Début du traitement de la requête d'envoi d'email");
    
    const { formType, formData } = await req.json();
    
    console.log(`Type de formulaire: ${formType}`);
    console.log("Données du formulaire:", JSON.stringify(formData, null, 2));
    
    if (!formType || !formData) {
      console.error("Données de formulaire invalides");
      return new Response(
        JSON.stringify({ error: "Données de formulaire invalides" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Vérifier si Resend est configuré
    if (!resend) {
      console.error("Resend n'est pas configuré - La clé API Resend est manquante");
      return new Response(
        JSON.stringify({ 
          error: "Configuration d'envoi d'emails manquante", 
          details: "L'administrateur doit configurer la clé API Resend." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    let emailResponse;
    
    // Déterminer quel type de formulaire a été soumis et envoyer l'email approprié
    if (formType === "contact") {
      console.log("Envoi d'un email de contact");
      const contactData = formData as ContactFormData;
      emailResponse = await sendContactEmail(contactData);
    } else if (formType === "job") {
      console.log("Envoi d'un email de candidature");
      const jobData = formData as JobApplicationData;
      emailResponse = await sendJobApplicationEmail(jobData);
    } else {
      console.error("Type de formulaire non reconnu");
      return new Response(
        JSON.stringify({ error: "Type de formulaire non reconnu" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (emailResponse.error) {
      console.error("Erreur lors de l'envoi de l'email:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi de l'email", 
          details: emailResponse.error 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erreur dans la fonction send-form-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendContactEmail(data: ContactFormData) {
  console.log("Préparation de l'email de contact pour:", data.email);
  
  const urgencyMap: Record<string, string> = {
    immediate: "Immédiat",
    oneWeek: "1 semaine",
    notUrgent: "Non urgent",
  };
  
  const requestTypeMap: Record<string, string> = {
    reinforcement: "Renfort technique",
    plans: "Mise en plan",
    study: "Étude",
    other: "Autre",
  };

  const fileAttachment = data.fileData ? 
    `<p><strong>Fichier attaché:</strong> <a href="${data.fileData.fileUrl}">${data.fileData.fileName}</a></p>` : 
    "";

  try {
    if (!resend) {
      return { error: "Service d'envoi d'emails non configuré" };
    }
    
    // Mise à jour pour utiliser le nouvel email vérifié
    const result = await resend.emails.send({
      from: "MecaHUB Pro <contact@mecahub.fr>",
      to: [recipientEmail],
      subject: `Nouvelle demande de contact - ${data.company}`,
      html: `
        <h1>Nouvelle demande de contact</h1>
        <h2>Informations du contact</h2>
        <p><strong>Entreprise:</strong> ${data.company}</p>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        
        <h2>Détails de la demande</h2>
        <p><strong>Type de demande:</strong> ${requestTypeMap[data.requestType] || data.requestType}</p>
        <p><strong>Urgence:</strong> ${urgencyMap[data.urgency] || data.urgency}</p>
        <p><strong>Description:</strong></p>
        <p>${data.details}</p>
        ${fileAttachment}
      `,
    });
    
    console.log("Résultat de l'envoi de l'email de contact:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    return { error };
  }
}

async function sendJobApplicationEmail(data: JobApplicationData) {
  console.log("Préparation de l'email de candidature pour:", data.email);
  
  const statusMap: Record<string, string> = {
    freelance: "Freelance",
    employee: "Salarié",
    internship: "Alternance",
  };

  const cvAttachment = data.cvData ? 
    `<p><strong>CV:</strong> <a href="${data.cvData.fileUrl}">${data.cvData.fileName}</a></p>` : 
    "";

  const messageSection = data.message ? 
    `<h2>Message</h2><p>${data.message}</p>` : 
    "";

  try {
    if (!resend) {
      return { error: "Service d'envoi d'emails non configuré" };
    }
    
    // Mise à jour pour utiliser le nouvel email vérifié
    const result = await resend.emails.send({
      from: "MecaHUB Pro <contact@mecahub.fr>",
      to: [recipientEmail],
      subject: `Nouvelle candidature - ${data.fullName}`,
      html: `
        <h1>Nouvelle candidature</h1>
        <h2>Informations du candidat</h2>
        <p><strong>Nom:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        <p><strong>Statut:</strong> ${statusMap[data.status] || data.status}</p>
        
        <h2>Compétences et expérience</h2>
        <p><strong>Compétences clés:</strong> ${data.skills}</p>
        <p><strong>Logiciels maîtrisés:</strong> ${data.software}</p>
        <p><strong>Secteurs d'expérience:</strong> ${data.experience}</p>
        <p><strong>Disponibilité:</strong> ${data.availability}</p>
        ${cvAttachment}
        ${messageSection}
      `,
    });
    
    console.log("Résultat de l'envoi de l'email de candidature:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de candidature:", error);
    return { error };
  }
}

serve(handler);
