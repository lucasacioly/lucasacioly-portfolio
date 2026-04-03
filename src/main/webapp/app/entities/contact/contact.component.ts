import { Component, ElementRef, ViewChild, AfterViewInit, Output, inject } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { TranslateService } from '@ngx-translate/core';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailService, EmailValidationError, EmailValidationCode } from '../../core/util/email.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PrimengModule, TranslateDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [MessageService]

})
export class ContactComponent {

  @ViewChild('contact', { static: true }) targetContact!: ElementRef;

  @Output() targetCoordinates!: { top: number; left: number; };

  enviar!: string;
  isSubmitting = false;

  contactForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/^[a-zA-Z0-9À-ÿ.'\-\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
  });

  private readonly SUBMIT_THROTTLE_MS = 5000;
  private lastSubmitAt = 0;
  private emailService = inject(EmailService);

  constructor(private messageService: MessageService, private translateService: TranslateService,  private formBuilder: FormBuilder) {
    // Traduz a chave 'contact.form.send' ao inicializar o componente
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });

  }

  translate(): string {
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });
    return this.enviar;
  }

  async onSubmit():Promise<void> {
    const now = Date.now();

    if (this.isSubmitting) {
      return;
    }

    if (now - this.lastSubmitAt < this.SUBMIT_THROTTLE_MS) {
      this.messageService.add({severity:'warn', summary:'Please wait', detail:'Try again in a few seconds.'});
      return;
    }

    if (this.contactForm.invalid) {
      // Marca todos os campos do formulário como tocados para mostrar os erros
      this.contactForm.markAllAsTouched();
      this.messageService.add({severity:'warn', summary:'Validation Error', detail:this.getFormValidationMessage()});

      return;
    }

    const fromName = this.contactForm.value.name?.trim();
    const fromEmail = this.contactForm.value.email?.trim();
    const message = this.contactForm.value.message?.trim();
    this.isSubmitting = true;

    try {
      await this.emailService.sendEmail(fromName, fromEmail, message);

      this.messageService.add({severity:'success', summary:'Email Enviado', detail:'Seu email foi enviado com sucesso!'});
      this.lastSubmitAt = Date.now();
      this.contactForm.reset();
    } catch (error) {
      this.messageService.add({severity:'warn', summary:'Validation Error', detail:this.resolveSubmissionErrorMessage(error)});
    } finally {
      this.isSubmitting = false;
    }

  }

  private resolveSubmissionErrorMessage(error: unknown): string {
    if (error instanceof EmailValidationError) {
      return this.getEnglishValidationMessage(error.code);
    }

    if (error instanceof HttpErrorResponse) {
      const details = this.extractFormspreeErrorText(error);

      if (/too short|minimum|at least/i.test(details)) {
        return this.getEnglishValidationMessage('MESSAGE_TOO_SHORT');
      }

      if (/too long|maximum|must be.*less|exceeds/i.test(details)) {
        return this.getEnglishValidationMessage('MESSAGE_TOO_LONG');
      }

      if (/invalid email|email/i.test(details)) {
        return this.getEnglishValidationMessage('EMAIL_INVALID');
      }

      if (error.status === 422 || error.status === 400) {
        return this.getEnglishValidationMessage('SUSPICIOUS_CONTENT');
      }

      return 'We could not send your message right now. Please try again.';
    }

    return 'We could not send your message right now. Please try again.';
  }

  private extractFormspreeErrorText(error: HttpErrorResponse): string {
    const payload = error.error as { errors?: Array<{ message?: string }>; error?: string; message?: string } | null;

    if (!payload) {
      return '';
    }

    const fromErrors = payload.errors?.map(item => item.message ?? '').filter(Boolean).join(' ') ?? '';
    const fromError = payload.error ?? '';
    const fromMessage = payload.message ?? '';

    return `${fromErrors} ${fromError} ${fromMessage}`.trim();
  }

  private getFormValidationMessage(): string {
    const nameControl = this.contactForm.get('name');
    const emailControl = this.contactForm.get('email');
    const messageControl = this.contactForm.get('message');

    if (nameControl?.hasError('required')) {
      return this.getEnglishValidationMessage('NAME_REQUIRED');
    }
    if (nameControl?.hasError('maxlength')) {
      return this.getEnglishValidationMessage('NAME_TOO_LONG');
    }
    if (nameControl?.hasError('pattern')) {
      return this.getEnglishValidationMessage('NAME_INVALID_CHARS');
    }

    const hasEmailRequired = emailControl?.hasError('required') ?? false;
    const hasEmailFormatError = emailControl?.hasError('email') ?? false;
    if (hasEmailRequired || hasEmailFormatError) {
      return this.getEnglishValidationMessage('EMAIL_INVALID');
    }

    if (messageControl?.hasError('required')) {
      return this.getEnglishValidationMessage('MESSAGE_REQUIRED');
    }
    if (messageControl?.hasError('minlength')) {
      return this.getEnglishValidationMessage('MESSAGE_TOO_SHORT');
    }
    if (messageControl?.hasError('maxlength')) {
      return this.getEnglishValidationMessage('MESSAGE_TOO_LONG');
    }

    return 'Invalid input. Please review your message and try again.';
  }

  private getEnglishValidationMessage(code: EmailValidationCode): string {
    switch (code) {
      case 'NAME_REQUIRED':
        return 'Please enter your name.';
      case 'NAME_TOO_LONG':
        return 'Please write a shorter name.';
      case 'NAME_INVALID_CHARS':
        return 'Please use only letters, numbers, spaces, apostrophes, dots, or hyphens in your name.';
      case 'EMAIL_INVALID':
        return 'Please enter a valid email address.';
      case 'MESSAGE_REQUIRED':
        return 'Please enter a message.';
      case 'MESSAGE_TOO_SHORT':
        return 'Please write a longer message.';
      case 'MESSAGE_TOO_LONG':
        return 'Please write a shorter message.';
      case 'SUSPICIOUS_CONTENT':
        return 'Your message could not be processed. Please review your text and try again.';
      default:
        return 'Invalid input. Please review your message and try again.';
    }
  }
}
