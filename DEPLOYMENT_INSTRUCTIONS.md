# Instructions de déploiement pour Hostinger

## Étapes à suivre :

1. **Construire le projet localement :**
   ```bash
   npm install
   npm run build
   ```

2. **Uploader les fichiers :**
   - Uploadez UNIQUEMENT le contenu du dossier `dist/` (pas le dossier dist lui-même)
   - Uploadez également le fichier `.htaccess` à la racine

3. **Structure sur Hostinger :**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── autres fichiers...
   └── lovable-uploads/
       └── vos images...
   ```

4. **Si vous avez encore une page blanche :**
   - Vérifiez que le fichier `index.html` est bien à la racine de `public_html/`
   - Vérifiez les logs d'erreur dans la console du navigateur (F12)
   - Assurez-vous que le fichier `.htaccess` est présent

## Configuration Supabase pour production :

Dans le dashboard Supabase, ajoutez votre domaine Hostinger dans :
- **Site URL** : `https://votre-domaine.com`
- **Redirect URLs** : `https://votre-domaine.com/**`

## Important :
- N'uploadez JAMAIS les fichiers sources (src/, node_modules/, etc.)
- Uploadez uniquement le contenu du dossier `dist/` après build
- Le fichier `.htaccess` est crucial pour le fonctionnement des routes React