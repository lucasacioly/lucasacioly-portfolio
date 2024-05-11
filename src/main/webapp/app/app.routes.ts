import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { errorRoute } from './layouts/error/error.route';

import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
import { ContactComponent } from './entities/contact/contact.component';
import { HobbiesComponent } from './entities/hobbies/hobbies.component';
import { SkillsComponent } from './entities/skills/skills.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'home.title',
  },
  {
    path: '',
    component: NavbarComponent,
    outlet: 'navbar',
  },
  {
    path: '',
    component: ContactComponent,
    outlet: 'contact'
  },
  {
    path: '',
    component: HobbiesComponent,
    outlet: 'hobbies'
  },
  {
    path: '',
    component: SkillsComponent,
    outlet: 'skills'
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  ...errorRoute,
];

export default routes;
