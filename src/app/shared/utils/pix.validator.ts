import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pixKeyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Campo vazio é opcional (ou gerido por Validators.required externamente)
    if (!value || typeof value !== 'string') {
      return null;
    }

    const cleanValue = value.trim();
    if (cleanValue === '') {
      return null;
    }

    // Regexes para cada tipo de chave
    
    // 1. E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // 2. CPF (11 dígitos numéricos)
    // 3. CNPJ (14 dígitos numéricos)
    // 4. Celular (10 a 11 dígitos numéricos com ou sem +55)
    const digitsOnly = cleanValue.replace(/\D/g, '');
    let isCpf = false;
    let isCnpj = false;
    let isPhone = false;

    // Se a string só tem números e pontuações válidas (sem letras soltas no meio do CPF)
    const isStrictlyNumeric = /^[\d\.\-\/\(\)\+\s]+$/.test(cleanValue);

    if (isStrictlyNumeric) {
      if (digitsOnly.length === 11) isCpf = true;
      if (digitsOnly.length === 14) isCnpj = true;
      
      // Celulares (considerando com ou sem +55 no inicio)
      if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
         isPhone = true; 
      }
    }
    
    // 5. Chave Aleatória (EVP - UUID)
    const evpRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const isValid = 
      emailRegex.test(cleanValue) || 
      isCpf || 
      isCnpj || 
      isPhone || 
      evpRegex.test(cleanValue);

    return isValid ? null : { invalidPix: true };
  };
}
