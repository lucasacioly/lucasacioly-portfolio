import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jhi-cv',
  standalone: true,
  imports: [TranslateDirective, ButtonModule],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent {
  downloadPdf(): void {
    window.print();
  }
}
