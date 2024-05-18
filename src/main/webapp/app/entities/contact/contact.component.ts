import { Component, ElementRef, ViewChild, AfterViewInit, Output, inject } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { TranslateService } from '@ngx-translate/core';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../core/util/email.service';
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

  contactForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

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

    if (this.contactForm.invalid) {
      // Marca todos os campos do formulário como tocados para mostrar os erros
      this.contactForm.markAllAsTouched();
      return;
    }

    const fromName = this.contactForm.value.name;
    const fromEmail = this.contactForm.value.email;
    const message = this.contactForm.value.message;

    try {
      const response = await this.emailService.sendEmail(fromName, fromEmail, message);

      if (response.status === 200) {

        this.messageService.add({severity:'success', summary:'Email Enviado', detail:'Seu email foi enviado com sucesso!'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro ao Enviar', detail:'Ocorreu um erro ao enviar o email. Por favor, tente novamente.'});
    }

    try {
      const response = await this.emailService.sendConfirmationEmail(fromName, fromEmail);

      if (response.status === 200) {

        this.messageService.add({severity:'success', summary:'Confirmação enviada', detail:'Você receberá um email de confirmação no email fornecido!'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro ao Enviar', detail:'Ocorreu um erro ao enviar o email de confirmação.'});
    }

    this.contactForm.reset();

  }
}
