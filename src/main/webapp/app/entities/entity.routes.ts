import { Routes } from '@angular/router';
import { CvComponent } from './cv/cv.component';
import { CertificatesComponent } from './certificates/certificates.component';
const routes: Routes = [
  {
    path: 'cv',
    component: CvComponent,
    //data: { pageTitle: 'lucasaciolyApp.adminAuthority.home.title' },
  },
  {
    path: 'certs',
    component: CertificatesComponent,
    //data: { pageTitle: 'lucasaciolyApp.adminAuthority.home.title' },
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
