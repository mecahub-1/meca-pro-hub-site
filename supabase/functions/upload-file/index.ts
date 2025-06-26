
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

// Création du client Supabase
const supabaseUrl = "https://jswapqasgatjjwgbrsdc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// File validation configs
const FILE_CONFIGS = {
  job: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf']
  },
  contact: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
  }
};

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded || realIp || 'unknown';
}

function checkRateLimit(key: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxUploads = 10;

  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true };
  }

  if (entry.count >= maxUploads) {
    return { 
      allowed: false, 
      remainingTime: Math.ceil((entry.resetTime - now) / 1000)
    };
  }

  entry.count++;
  return { allowed: true };
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

function validateFile(file: File, formType: string): { isValid: boolean; error?: string } {
  const config = FILE_CONFIGS[formType as keyof typeof FILE_CONFIGS];
  if (!config) {
    return { isValid: false, error: "Type de formulaire invalide" };
  }

  // Check file size
  if (file.size > config.maxSizeBytes) {
    const maxSizeMB = Math.round(config.maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      error: `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB`
    };
  }

  // Check MIME type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé: ${file.type}`
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!config.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Extension non autorisée: ${fileExtension}`
    };
  }

  // Check filename length
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: 'Nom de fichier trop long (max 255 caractères)'
    };
  }

  return { isValid: true };
}

async function validateFileContent(file: File): Promise<{ isValid: boolean; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Check for PDF signature if it's a PDF
    if (file.type === 'application/pdf') {
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
      const isValidPDF = pdfSignature.every((byte, index) => bytes[index] === byte);
      
      if (!isValidPDF) {
        return {
          isValid: false,
          error: 'Le fichier ne semble pas être un PDF valide'
        };
      }
    }
    
    // Check for executable signatures (basic malware detection)
    const maliciousPatterns = [
      [0x4D, 0x5A], // PE executable
      [0x7F, 0x45, 0x4C, 0x46], // ELF executable
    ];
    
    for (const pattern of maliciousPatterns) {
      const hasPattern = pattern.every((byte, index) => bytes[index] === byte);
      if (hasPattern) {
        return {
          isValid: false,
          error: 'Fichier potentiellement dangereux détecté'
        };
      }
    }
    
    return { isValid: true };
  } catch (error) {
    console.error("Erreur validation contenu:", error);
    return {
      isValid: false,
      error: 'Erreur lors de la validation du fichier'
    };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Début du traitement de la requête d'upload de fichier");
    
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    const rateLimitResult = checkRateLimit(rateLimitKey);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Trop de tentatives d'upload", 
          details: `Réessayez dans ${rateLimitResult.remainingTime} secondes` 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formType = formData.get("formType") as string;
    
    console.log(`Type de formulaire: ${formType}`);
    console.log(`Nom du fichier: ${file?.name}`);
    
    if (!file || !formType) {
      console.error("Fichier ou type de formulaire manquant");
      return new Response(
        JSON.stringify({ error: "Fichier ou type de formulaire manquant" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate file
    const fileValidation = validateFile(file, formType);
    if (!fileValidation.isValid) {
      console.error("Validation fichier échouée:", fileValidation.error);
      return new Response(
        JSON.stringify({ error: fileValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate file content
    const contentValidation = await validateFileContent(file);
    if (!contentValidation.isValid) {
      console.error("Validation contenu échouée:", contentValidation.error);
      return new Response(
        JSON.stringify({ error: contentValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Déterminer le bucket et le chemin en fonction du type de formulaire
    let bucketPath;
    if (formType === "contact") {
      bucketPath = "contact_uploads";
    } else if (formType === "job") {
      bucketPath = "cv_uploads";
    } else {
      console.error("Type de formulaire invalide");
      return new Response(
        JSON.stringify({ error: "Type de formulaire invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Générer un nom de fichier unique et sécurisé
    const timestamp = new Date().getTime();
    const sanitizedName = sanitizeFilename(file.name);
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = `${bucketPath}/${fileName}`;
    
    console.log(`Chemin de fichier: ${filePath}`);
    
    // Convertir le File en ArrayBuffer pour l'upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Uploader le fichier dans le bucket avec des métadonnées de sécurité
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("files")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false, // Prevent overwriting existing files
      });

    if (uploadError) {
      console.error("Erreur d'upload:", uploadError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'upload du fichier", details: uploadError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Fichier uploadé avec succès");

    // Obtenir l'URL publique du fichier
    const { data: publicUrlData } = await supabase
      .storage
      .from("files")
      .getPublicUrl(filePath);

    console.log(`URL publique: ${publicUrlData.publicUrl}`);

    // Enregistrer les métadonnées du fichier dans la table files avec des informations de sécurité
    const { data: insertData, error: insertError } = await supabase
      .from("files")
      .insert({
        filename: sanitizedName,
        file_path: filePath,
        content_type: file.type
      });

    if (insertError) {
      console.error("Erreur d'insertion en DB:", insertError);
      // Don't fail the entire request if metadata insertion fails
    } else {
      console.log("Métadonnées de fichier enregistrées en base");
    }

    return new Response(
      JSON.stringify({
        success: true,
        fileName: sanitizedName,
        fileUrl: publicUrlData.publicUrl,
        filePath: filePath
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erreur dans la fonction upload-file:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      {
      status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
