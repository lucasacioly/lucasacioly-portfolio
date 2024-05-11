import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findKeyFromLanguage',
  pure: true
})
export default class FindKeyFromLanguagePipe implements PipeTransform {
  private languages: { [key: string]: { name: string; rtl?: boolean } } = {
    'pt-br': { name: 'Português (Brasil)' },
    en: { name: 'English' },
    es: { name: 'Español' },
    // Add more languages as needed
  };

  transform(language: string): string {
    const langKey = Object.keys(this.languages).find(key => this.languages[key].name === language);
    return langKey ?? "";
  }
}



