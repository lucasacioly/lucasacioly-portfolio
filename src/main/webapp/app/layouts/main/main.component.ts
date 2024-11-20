import { Component, inject, OnInit, RendererFactory2, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs/esm';

import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { SkillsComponent } from 'app/entities/skills/skills.component';
import { HobbiesComponent } from 'app/entities/hobbies/hobbies.component';
import { ContactComponent } from 'app/entities/contact/contact.component';

@Component({
  selector: 'jhi-main',
  standalone: true,
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, CommonModule, FooterComponent, PageRibbonComponent, SkillsComponent,ContactComponent, HobbiesComponent],
})
export default class MainComponent implements OnInit {

  isRootPage = false;

  private renderer: Renderer2;

  private router = inject(Router);
  private appPageTitleStrategy = inject(AppPageTitleStrategy);
  private translateService = inject(TranslateService);
  private rootRenderer = inject(RendererFactory2);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRootPage = event.url === '/' || event.urlAfterRedirects === '/';
      }
    });

  }

  ngOnInit(): void {

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }
}
