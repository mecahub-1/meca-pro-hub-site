
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formType = formData.get("formType") as string;
    
    if (!file || !formType) {
      return new Response(
        JSON.stringify({ error: "Fichier ou type de formulaire manquant" }),
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
      return new Response(
        JSON.stringify({ error: "Type de formulaire invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `${bucketPath}/${fileName}`;
    
    // Convertir le File en ArrayBuffer pour l'upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Uploader le fichier dans le bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("files")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Erreur d'upload:", uploadError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'upload du fichier", details: uploadError }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Obtenir l'URL publique du fichier
    const { data: publicUrlData } = await supabase
      .storage
      .from("files")
      .getPublicUrl(filePath);

    // Enregistrer les métadonnées du fichier dans la table files
    const { data: insertData, error: insertError } = await supabase
      .from("files")
      .insert({
        filename: file.name,
        file_path: filePath,
        content_type: file.type
      });

    if (insertError) {
      console.error("Erreur d'insertion en DB:", insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        fileName: file.name,
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
