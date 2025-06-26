
-- Activer la Row Level Security sur la table job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Activer la Row Level Security sur la table contact_requests  
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion dans job_applications (accès public pour les candidatures)
CREATE POLICY "Allow public insert on job_applications" 
ON public.job_applications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Créer une politique pour permettre l'insertion dans contact_requests (accès public pour les demandes de contact)
CREATE POLICY "Allow public insert on contact_requests" 
ON public.contact_requests 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Créer une politique pour permettre la lecture aux utilisateurs authentifiés seulement (pour l'administration)
CREATE POLICY "Allow authenticated read on job_applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated 
USING (true);

-- Créer une politique pour permettre la lecture aux utilisateurs authentifiés seulement (pour l'administration)
CREATE POLICY "Allow authenticated read on contact_requests" 
ON public.contact_requests 
FOR SELECT 
TO authenticated 
USING (true);
