
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
  },
  email: {
    required: true,
    maxLength: 254,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  phone: {
    required: true,
    minLength: 10,
    maxLength: 20,
    pattern: /^[\d\s+()-]+$/
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 200
  },
  position: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  skills: {
    required: true,
    minLength: 5,
    maxLength: 500
  },
  software: {
    required: true,
    minLength: 2,
    maxLength: 300
  },
  experience: {
    required: true,
    minLength: 2,
    maxLength: 300
  },
  availability: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  details: {
    required: true,
    minLength: 10,
    maxLength: 2000
  },
  message: {
    required: false,
    maxLength: 1000
  }
};

export function validateInput(value: string, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Required check
  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push('Ce champ est obligatoire');
    return { isValid: false, errors };
  }

  // Skip other validations if not required and empty
  if (!rules.required && (!value || value.trim().length === 0)) {
    return { isValid: true, errors: [] };
  }

  const trimmedValue = value.trim();

  // Length checks
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    errors.push(`Minimum ${rules.minLength} caractères requis`);
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    errors.push(`Maximum ${rules.maxLength} caractères autorisés`);
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    errors.push('Format invalide');
  }

  // Custom validator
  if (rules.customValidator && !rules.customValidator(trimmedValue)) {
    errors.push('Valeur invalide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFormData(formData: Record<string, string>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, value] of Object.entries(formData)) {
    const rules = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES];
    if (rules) {
      results[field] = validateInput(value, rules);
    }
  }

  return results;
}

export function sanitizeInput(input: string): string {
  // Sanitisation moins agressive pour permettre la saisie normale
  return input
    .replace(/[<>]/g, '') // Supprime seulement les balises dangereuses
    .substring(0, 2000); // Limite la longueur
}
