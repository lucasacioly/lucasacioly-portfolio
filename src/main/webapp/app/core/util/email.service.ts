import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type EmailPayload = {
  name: string;
  email: string;
  message: string;
};

export type EmailValidationCode =
  | 'NAME_REQUIRED'
  | 'NAME_TOO_LONG'
  | 'NAME_INVALID_CHARS'
  | 'EMAIL_INVALID'
  | 'MESSAGE_REQUIRED'
  | 'MESSAGE_TOO_SHORT'
  | 'MESSAGE_TOO_LONG'
  | 'SUSPICIOUS_CONTENT';

export class EmailValidationError extends Error {
  constructor(
    public readonly code: EmailValidationCode,
    message: string,
  ) {
    super(message);
    this.name = 'EmailValidationError';
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  // Formspree endpoint URL (alterar o form_id com o seu projeto no Formspree)
  private FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdaplbgk';
  private readonly NAME_MAX_LENGTH = 80;
  private readonly MESSAGE_MIN_LENGTH = 10;
  private readonly MESSAGE_MAX_LENGTH = 2000;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  private readonly SAFE_NAME_REGEX = /^[a-zA-Z0-9À-ÿ.'\-\s]+$/;
  private readonly SUSPICIOUS_PATTERNS: RegExp[] = [
    /<\s*script\b/i,
    /javascript\s*:/i,
    /\bon\w+\s*=/i,
    /<[^>]+>/, // bloqueia HTML para evitar payload ativo
    /\b(union\s+select|drop\s+table|insert\s+into|delete\s+from|update\s+\w+\s+set)\b/i,
    /--|\/\*|\*\//,
    /\$\{|\{\{|\}\}|<%|%>/,
  ];

  constructor(private http: HttpClient) { }

  async sendEmail(fromName: string|null|undefined, fromEmail: string|null|undefined, mensagem: string|null|undefined): Promise<void> {
    const payload = this.buildSafePayload(fromName, fromEmail, mensagem);

    try {
      await firstValueFrom(
        this.http.post<void>(this.FORMSPREE_ENDPOINT, payload, {
          headers: {
            Accept: 'application/json',
          },
        })
      );
    } catch (error) {
      console.error('Erro ao enviar email via Formspree:', error);
      throw error;
    }

  }

  private buildSafePayload(fromName: string | null | undefined, fromEmail: string | null | undefined, mensagem: string | null | undefined): EmailPayload {
    const name = this.sanitizeInput(fromName, false);
    const email = this.sanitizeInput(fromEmail, false).toLowerCase();
    const message = this.sanitizeInput(mensagem, true);

    this.validateName(name);
    this.validateEmail(email);
    this.validateMessage(message);

    return { name, email, message };
  }

  private sanitizeInput(value: string | null | undefined, preserveNewLines: boolean): string {
    if (!value) {
      return '';
    }

    const normalizedValue = value.normalize('NFKC');
    const cleanedValue = this.removeControlChars(normalizedValue);

    if (preserveNewLines) {
      return cleanedValue.replace(/\r/g, '').trim();
    }

    return cleanedValue.replace(/\s+/g, ' ').trim();
  }

  private removeControlChars(value: string): string {
    return [...value]
      .filter(char => {
        const code = char.charCodeAt(0);
        return !((code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127);
      })
      .join('');
  }

  private validateName(name: string): void {
    if (!name) {
      throw new EmailValidationError('NAME_REQUIRED', 'Name is required.');
    }

    if (name.length > this.NAME_MAX_LENGTH) {
      throw new EmailValidationError('NAME_TOO_LONG', 'Name is too long.');
    }

    if (!this.SAFE_NAME_REGEX.test(name)) {
      throw new EmailValidationError('NAME_INVALID_CHARS', 'Name contains invalid characters.');
    }

    this.assertNotSuspicious(name, 'nome');
  }

  private validateEmail(email: string): void {
    if (!email || !this.EMAIL_REGEX.test(email)) {
      throw new EmailValidationError('EMAIL_INVALID', 'Email is invalid.');
    }
  }

  private validateMessage(message: string): void {
    if (!message) {
      throw new EmailValidationError('MESSAGE_REQUIRED', 'Message is required.');
    }

    if (message.length < this.MESSAGE_MIN_LENGTH) {
      throw new EmailValidationError('MESSAGE_TOO_SHORT', 'Message is too short.');
    }

    if (message.length > this.MESSAGE_MAX_LENGTH) {
      throw new EmailValidationError('MESSAGE_TOO_LONG', 'Message is too long.');
    }

    this.assertNotSuspicious(message, 'mensagem');
  }

  private assertNotSuspicious(value: string, fieldName: string): void {
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(value)) {
        throw new EmailValidationError('SUSPICIOUS_CONTENT', `Suspicious content detected in ${fieldName}.`);
      }
    }
  }

}
