
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function sanitizeFilename(filename: string): string {
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
  return sanitized;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Upload request received:', req.method);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  if (req.method !== 'POST') {
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const formType = formData.get('formType') as string;

    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file size (10MB for CV, 5MB for others)
    const maxSize = formType === 'job' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return new Response(
        JSON.stringify({ error: `Fichier trop volumineux. Taille maximum: ${maxSizeMB}MB` }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Validate file type
    const allowedTypes = formType === 'job' 
      ? ['application/pdf']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Type de fichier non autorisé' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Sanitize filename and create unique name
    const sanitizedName = sanitizeFilename(file.name);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueFilename = `${timestamp}_${sanitizedName}`;
    const filePath = `${formType}/${uniqueFilename}`;

    console.log('Uploading to path:', filePath);

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('form_files')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'upload',
          details: uploadError.message 
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

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('form_files')
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('files')
      .insert({
        filename: sanitizedName,
        file_path: filePath,
        content_type: file.type
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway, the file is uploaded
    }

    const fileUrl = urlData.publicUrl;
    console.log('File accessible at:', fileUrl);

    return new Response(
      JSON.stringify({
        success: true,
        fileName: sanitizedName,
        fileUrl: fileUrl,
        filePath: filePath
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
    console.error('Error in upload-file function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors du traitement du fichier',
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
