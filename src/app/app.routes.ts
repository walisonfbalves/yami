import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@features/public-menu/public-menu.routes').then(m => m.publicMenuRoutes)
  }
];
