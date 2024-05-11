import { Component, ElementRef, ViewChild, AfterViewInit, Output } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { TranslateService } from '@ngx-translate/core';
import { PrimengModule } from 'app/shared/primeng/primeng.module';

@Component({
  selector: 'jhi-contact',
  standalone: true,
  imports: [PrimengModule, TranslateDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements AfterViewInit{

  @ViewChild('contact', { static: true }) targetContact!: ElementRef;

  @Output() targetCoordinates!: { top: number; left: number; };

  enviar!: string;

  constructor(private translateService: TranslateService) {
    // Traduz a chave 'contact.form.send' ao inicializar o componente
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });
  }


  ngAfterViewInit()  :void{
    const targetRect = this.targetContact.nativeElement.getBoundingClientRect();
    this.targetCoordinates = {
      top: targetRect.top + window.scrollY,
      left: targetRect.left + window.scrollX
    };

  }

  translate(): string {
    this.translateService.get('contact.form.send').subscribe((res: string) => {
      this.enviar = res;
    });
    return this.enviar;
  }
}
