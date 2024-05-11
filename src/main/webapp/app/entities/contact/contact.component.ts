import { Component, ElementRef, ViewChild, AfterViewInit, Output, inject } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { TranslateService } from '@ngx-translate/core';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';import { EmailService } from '../../core/util/email.service';
import { MessageService } from 'primeng/api';
import { AlertComponent } from 'app/shared/alert/alert.component';
@Component({
  selector: 'jhi-contact',
  standalone: true,
  imports: [AlertComponent, ReactiveFormsModule, PrimengModule, TranslateDirective],
  providers:[MessageService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
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

  constructor(private translateService: TranslateService,  private formBuilder: FormBuilder) {
    // Traduz a chave 'contact.form.send' ao inicializar o componente
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });

  }

 //ngAfterViewInit()  :void{
 //  //const targetRect = this.targetContact.nativeElement.getBoundingClientRect();
 //  //this.targetCoordinates = {
 //  //  top: targetRect.top + window.scrollY,
 //  //  left: targetRect.left + window.scrollX
 //  //};

 //}

  translate(): string {
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });
    return this.enviar;
  }

  onSubmit():void {

    if (this.contactForm.invalid) {
      // Marca todos os campos do formulário como tocados para mostrar os erros
      console.log("form invalid");

      this.contactForm.markAllAsTouched();
      return;
    }

    console.log("form valid");

    const from_name = this.contactForm.value.name;
    const from_email = this.contactForm.value.email;
    const message = this.contactForm.value.message;

    this.emailService.sendEmail(from_name, from_email, message)

    this.contactForm.reset();

  }
}
