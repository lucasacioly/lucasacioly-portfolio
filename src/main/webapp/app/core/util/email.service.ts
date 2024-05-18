import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private SEND_TEMPLATE : string = "template_ahxjush";
  private REPLY_TEMPLATE: string = "template_60a84vx";
  private SERVICE : string = "service_m5hciz4";
  private PUB_KEY : string = "h2-rBERn9SambgLuX";

  constructor() { }

  async sendEmail(fromName: string|null|undefined, fromEmail: string|null|undefined, mensagem: string|null|undefined): Promise<any> {

    emailjs.init(this.PUB_KEY);

    const response = await emailjs.send(this.SERVICE, this.SEND_TEMPLATE, {
      from_name: fromName,
      message: mensagem,
      from_email: fromEmail,
    });
    return response;

  }

  async sendConfirmationEmail(fromName: string|null|undefined, fromEmail: string|null|undefined): Promise<any> {

    emailjs.init(this.PUB_KEY);
    const response = await emailjs.send(this.SERVICE,this.REPLY_TEMPLATE,{
      from_name: fromName,
      from_email: fromEmail,
      });
      return response;

  }

}
