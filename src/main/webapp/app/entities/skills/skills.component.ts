import { Component } from '@angular/core';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-skills',
  standalone: true,
  imports: [PrimengModule,TranslateDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

}
