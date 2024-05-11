import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-hobbies',
  standalone: true,
  imports: [TranslateDirective],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.scss'
})
export class HobbiesComponent {

}
