import { HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import emailjs from '@emailjs/browser';
import { AlertService, Alert } from 'app/core/util/alert.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private SEND_TEMPLATE : string = "template_ahxjush";
  private REPLY_TEMPLATE: string = "template_60a84vx";
  private SERVICE : string = "service_m5hciz4";
  private PUB_KEY : string = "h2-rBERn9SambgLuX";


  private alertService = inject(AlertService);

  constructor() { }

  async sendEmail(fromName: string|null|undefined, fromEmail: string|null|undefined, mensagem: string|null|undefined): Promise<void> {

    emailjs.init(this.PUB_KEY);

    let response = await emailjs.send(this.SERVICE,this.SEND_TEMPLATE,{
      from_name: fromName,
      message: mensagem,
      from_email: fromEmail,
      });

    if (response.status === HttpStatusCode.Ok) {
      alert("Email enviado com sucesso")
    } else {
      alert("erro ao enviar o email " + response.status + " " + response.text)
    }

    response = await emailjs.send(this.SERVICE,this.REPLY_TEMPLATE,{
      from_name: fromName,
      from_email: fromEmail,
      });
  }

}
