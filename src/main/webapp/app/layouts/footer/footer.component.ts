import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  imports: [PrimengModule, TranslateDirective],
})
export default class FooterComponent {}
