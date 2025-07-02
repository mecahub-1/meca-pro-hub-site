
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

interface JobFormData {
  fullName: string;
  email: string;
  phone: string;
  status: string;
  position: string;
  skills: string;
  software: string;
  experience: string;
  availability: string;
  message?: string;
  cvData: {
    fileName: string;
    fileUrl: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Received request:', req.method, req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    const { formType, formData } = await req.json();
    console.log('Processing form:', formType);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const recipientEmail = Deno.env.get('RECIPIENT_EMAIL');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration manquante',
          details: "L'administrateur doit configurer la clé API Resend pour l'envoi d'emails."
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    if (!recipientEmail) {
      console.error('RECIPIENT_EMAIL not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration manquante',
          details: "L'administrateur doit configurer l'email de destination pour recevoir les formulaires."
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    const resend = new Resend(resendApiKey);

    let emailSubject = '';
    let emailHtml = '';
    let attachments: any[] = [];

    if (formType === 'contact') {
      const data = formData as ContactFormData;
      emailSubject = `Nouvelle demande de devis - ${data.company}`;
      
      emailHtml = `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Entreprise:</strong> ${data.company}</p>
        <p><strong>Contact:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        <p><strong>Type de demande:</strong> ${data.requestType}</p>
        <p><strong>Urgence:</strong> ${data.urgency}</p>
        <p><strong>Détails:</strong></p>
        <p>${data.details.replace(/\n/g, '<br>')}</p>
        ${data.fileData ? `<p><strong>Fichier joint:</strong> <a href="${data.fileData.fileUrl}">${data.fileData.fileName}</a></p>` : ''}
      `;
    } else if (formType === 'job') {
      const data = formData as JobFormData;
      emailSubject = `Nouvelle candidature - ${data.fullName}`;
      
      emailHtml = `
        <h2>Nouvelle candidature</h2>
        <p><strong>Nom:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        <p><strong>Statut:</strong> ${data.status}</p>
        <p><strong>Poste souhaité:</strong> ${data.position}</p>
        <p><strong>Compétences:</strong> ${data.skills}</p>
        <p><strong>Logiciels:</strong> ${data.software}</p>
        <p><strong>Expérience:</strong> ${data.experience}</p>
        <p><strong>Disponibilité:</strong> ${data.availability}</p>
        ${data.message ? `<p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
        <p><strong>CV:</strong> <a href="${data.cvData.fileUrl}">${data.cvData.fileName}</a></p>
      `;
    } else {
      console.error('Unknown form type:', formType);
      return new Response(
        JSON.stringify({ error: 'Type de formulaire non reconnu' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    console.log('Sending email with subject:', emailSubject);
    
    const emailResult = await resend.emails.send({
      from: 'MecaHUB Pro <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        emailId: emailResult.data?.id 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-form-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
};

serve(handler);
