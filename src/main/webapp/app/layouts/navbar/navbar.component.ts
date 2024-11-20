import { Component, inject, signal, OnInit, Input, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import SharedModule from 'app/shared/shared.module';
import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import ActiveMenuDirective from './active-menu.directive';
import NavbarItem from './navbar-item.model';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { FindKeyFromLanguagePipe } from 'app/shared/language';
import { TranslateDirective } from 'app/shared/language';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [TranslateDirective, PrimengModule, RouterModule, SharedModule, ActiveMenuDirective],
})
export default class NavbarComponent implements OnInit {

  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  languages = LANGUAGES;
  selectedLanguage: { name: string } | undefined;
  openAPIEnabled?: boolean;
  version = '';
  entitiesNavbarItems: NavbarItem[] = [];

  private translateService = inject(TranslateService);
  private stateStorageService = inject(StateStorageService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private findKeyFromLanguagePipe: FindKeyFromLanguagePipe;

  constructor() {
    this.findKeyFromLanguagePipe = new FindKeyFromLanguagePipe();
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  navigateToContact(): void {
    const contactElement = document.querySelector('#contact');

    if (contactElement) {
      const yOffset = contactElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  }

  navigateToCv(): void {
    this.router.navigate(['/cv'], { replaceUrl: true });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { replaceUrl: true });
  }


  findKeyFromLanguage(lang: string): string {
    return this.findKeyFromLanguagePipe.transform(lang);
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
  }

  changeLanguage(languageKey: string): void {
    this.stateStorageService.storeLocale(languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }
}
