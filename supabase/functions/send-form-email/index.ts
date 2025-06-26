
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded || realIp || 'unknown';
}

function checkRateLimit(key: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxEmails = 3;

  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true };
  }

  if (entry.count >= maxEmails) {
    return { 
      allowed: false, 
      remainingTime: Math.ceil((entry.resetTime - now) / 1000)
    };
  }

  entry.count++;
  return { allowed: true };
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .substring(0, 2000); // Limit length
}

function validateEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email) && email.length <= 254;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Début du traitement de la requête d'envoi d'email");
    
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    const rateLimitResult = checkRateLimit(rateLimitKey);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Trop de tentatives d'envoi d'email", 
          details: `Réessayez dans ${rateLimitResult.remainingTime} secondes` 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { formType, formData } = await req.json();

    if (!formType || !formData) {
      return new Response(
        JSON.stringify({ error: "Données manquantes" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email address
    if (!validateEmail(formData.email)) {
      return new Response(
        JSON.stringify({ error: "Adresse email invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize all text inputs
    const sanitizedFormData = { ...formData };
    for (const [key, value] of Object.entries(sanitizedFormData)) {
      if (typeof value === 'string') {
        sanitizedFormData[key] = sanitizeInput(value);
      }
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("RECIPIENT_EMAIL");

    if (!resendApiKey || !recipientEmail) {
      console.error("Configuration manquante: RESEND_API_KEY ou RECIPIENT_EMAIL");
      return new Response(
        JSON.stringify({
          error: "Configuration d'envoi d'emails incomplète",
          details: "L'administrateur doit configurer les paramètres d'envoi d'emails."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let subject, htmlContent;

    if (formType === "contact") {
      subject = `[MecaHUB Pro] Nouvelle demande de contact - ${sanitizedFormData.company}`;
      htmlContent = `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Entreprise:</strong> ${sanitizedFormData.company}</p>
        <p><strong>Contact:</strong> ${sanitizedFormData.name}</p>
        <p><strong>Email:</strong> ${sanitizedFormData.email}</p>
        <p><strong>Téléphone:</strong> ${sanitizedFormData.phone}</p>
        <p><strong>Type de demande:</strong> ${sanitizedFormData.requestType}</p>
        <p><strong>Urgence:</strong> ${sanitizedFormData.urgency}</p>
        <p><strong>Détails:</strong></p>
        <p>${sanitizedFormData.details.replace(/\n/g, '<br>')}</p>
        ${sanitizedFormData.fileData ? `<p><strong>Fichier joint:</strong> <a href="${sanitizedFormData.fileData.fileUrl}">${sanitizedFormData.fileData.fileName}</a></p>` : ''}
      `;
    } else if (formType === "job") {
      subject = `[MecaHUB Pro] Nouvelle candidature - ${sanitizedFormData.position}`;
      htmlContent = `
        <h2>Nouvelle candidature</h2>
        <p><strong>Nom:</strong> ${sanitizedFormData.fullName}</p>
        <p><strong>Email:</strong> ${sanitizedFormData.email}</p>
        <p><strong>Téléphone:</strong> ${sanitizedFormData.phone}</p>
        <p><strong>Statut:</strong> ${sanitizedFormData.status}</p>
        <p><strong>Poste souhaité:</strong> ${sanitizedFormData.position}</p>
        <p><strong>Compétences:</strong> ${sanitizedFormData.skills}</p>
        <p><strong>Logiciels:</strong> ${sanitizedFormData.software}</p>
        <p><strong>Expérience:</strong> ${sanitizedFormData.experience}</p>
        <p><strong>Disponibilité:</strong> ${sanitizedFormData.availability}</p>
        ${sanitizedFormData.message ? `<p><strong>Message:</strong></p><p>${sanitizedFormData.message.replace(/\n/g, '<br>')}</p>` : ''}
        <p><strong>CV:</strong> <a href="${sanitizedFormData.cvData.fileUrl}">${sanitizedFormData.cvData.fileName}</a></p>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Type de formulaire invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Envoi de l'email via Resend");

    const emailPayload = {
      from: "MecaHUB Pro <noreply@mecahubpro.com>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
      reply_to: sanitizedFormData.email,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur Resend:", errorData);
      throw new Error(`Erreur Resend: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email envoyé avec succès:", result);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erreur dans send-form-email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de l'envoi de l'email",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
