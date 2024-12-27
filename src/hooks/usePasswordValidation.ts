import { useState, useEffect } from 'react';
import { checkPasswordStrength, StrengthResult } from '../utils/passwordStrength';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function usePasswordValidation(password: string) {
  const [strength, setStrength] = useState<StrengthResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: [] });
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (password) {
      const strengthResult = checkPasswordStrength(password);
      setStrength(strengthResult);

      const errors: string[] = [];
      if (password.length < 12) errors.push('Password must be at least 12 characters long');
      if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
      if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
      if (!/\d/.test(password)) errors.push('Password must contain at least one number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
      if (history.includes(password)) errors.push('Password has been used recently');

      setValidation({
        isValid: errors.length === 0 && strengthResult.score >= 3,
        errors
      });
    } else {
      setStrength(null);
      setValidation({ isValid: false, errors: [] });
    }
  }, [password, history]);

  const addToHistory = (newPassword: string) => {
    setHistory(prev => [...prev.slice(-4), newPassword]);
  };

  return { strength, validation, addToHistory };
}

