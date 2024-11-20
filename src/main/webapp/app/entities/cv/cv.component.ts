import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-cv',
  standalone: true,
  imports: [TranslateDirective],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss'
})
export class CvComponent {

}
