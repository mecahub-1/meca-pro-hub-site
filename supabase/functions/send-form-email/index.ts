
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

const resend = new Resend(Deno.env.get("re_Yeu5v9hu_3dLsiUqYvJR4aVSN1oMFB3WA"));
const recipientEmail = Deno.env.get("RECIPIENT_EMAIL");

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
    const { formType, formData } = await req.json();
    
    if (!formType || !formData) {
      return new Response(
        JSON.stringify({ error: "Données de formulaire invalides" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Traitement de la soumission de formulaire: ${formType}`);
    console.log("Données:", JSON.stringify(formData, null, 2));
    
    let emailResponse;
    
    // Déterminer quel type de formulaire a été soumis et envoyer l'email approprié
    if (formType === "contact") {
      const contactData = formData as ContactFormData;
      emailResponse = await sendContactEmail(contactData);
    } else if (formType === "job") {
      const jobData = formData as JobApplicationData;
      emailResponse = await sendJobApplicationEmail(jobData);
    } else {
      return new Response(
        JSON.stringify({ error: "Type de formulaire non reconnu" }),
        {
          status: 400,
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

  return await resend.emails.send({
    from: "MecaHUB Pro <onboarding@resend.dev>",
    to: [recipientEmail as string],
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
}

async function sendJobApplicationEmail(data: JobApplicationData) {
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

  return await resend.emails.send({
    from: "MecaHUB Pro <onboarding@resend.dev>",
    to: [recipientEmail as string],
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
}

serve(handler);
