
export interface FileValidationOptions {
  maxSizeBytes: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const FILE_VALIDATION_CONFIGS = {
  CV: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf']
  },
  CONTACT_FILE: {
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

export function sanitizeFilename(filename: string): string {
  // Remove dangerous characters and limit length
  const sanitized = filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .substring(0, 100); // Limit to 100 characters
  
  return sanitized;
}

export function validateFile(file: File, options: FileValidationOptions): FileValidationResult {
  // Check file size
  if (file.size > options.maxSizeBytes) {
    const maxSizeMB = Math.round(options.maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      error: `Le fichier est trop volumineux. Taille maximum autorisée: ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${options.allowedTypes.join(', ')}`
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!options.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Extension de fichier non autorisée. Extensions acceptées: ${options.allowedExtensions.join(', ')}`
    };
  }

  // Check filename length
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: 'Le nom du fichier est trop long (maximum 255 caractères)'
    };
  }

  return { isValid: true };
}

export function validateFileContent(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      
      // Check for PDF signature
      if (file.type === 'application/pdf') {
        const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
        const isValidPDF = pdfSignature.every((byte, index) => bytes[index] === byte);
        
        if (!isValidPDF) {
          resolve({
            isValid: false,
            error: 'Le fichier ne semble pas être un PDF valide'
          });
          return;
        }
      }
      
      // Check for malicious patterns (basic check)
      const maliciousPatterns = [
        [0x4D, 0x5A], // PE executable
        [0x7F, 0x45, 0x4C, 0x46], // ELF executable
      ];
      
      for (const pattern of maliciousPatterns) {
        const hasPattern = pattern.every((byte, index) => bytes[index] === byte);
        if (hasPattern) {
          resolve({
            isValid: false,
            error: 'Le fichier contient du contenu potentiellement dangereux'
          });
          return;
        }
      }
      
      resolve({ isValid: true });
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Erreur lors de la lecture du fichier'
      });
    };
    
    // Read first 1KB for signature checking
    reader.readAsArrayBuffer(file.slice(0, 1024));
  });
}
