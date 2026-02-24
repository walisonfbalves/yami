import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  logo: string;
  theme: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
  };
}

const TENANTS: TenantConfig[] = [
  {
    id: 't1',
    name: 'Yami Burgers',
    slug: 'yami-burgers',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7XJMdn_mnAxv30f3dNr2l2sbVV24vnt2NRN7w8xSJrxmphDDMlzwBYPEB8dY4lwRcRRXiR1xQqnLkon5_tGEzfYds3ruizqla0WMZhlwf8nVJja2lKF3ROLXd4oHZZA0S4zL_Lu94OmpwxCSOqudE72k2Wk2t-k0YLAoX0g5WSrqp3p8YVX2ggb48Q3zrfszrQD3kuV3McZt_VZK-Ie22T7iSJ_nHH6xsjOon-_60i8XrmH387aEgD96Ibj63W4qeuBsC0DfqP28',
    theme: {
      primary: '#f59f0a',
      primaryHover: '#d97706',
      primaryLight: 'rgba(245, 159, 10, 0.15)'
    }
  },
  {
    id: 't2',
    name: 'Sakura Sushi',
    slug: 'sakura-sushi',
    logo: '',
    theme: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      primaryLight: 'rgba(236, 72, 153, 0.15)'
    }
  },
  {
    id: 't3',
    name: 'Verde Vegan',
    slug: 'verde-vegan',
    logo: '',
    theme: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: 'rgba(16, 185, 129, 0.15)'
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenant = new BehaviorSubject<TenantConfig>(TENANTS[0]);
  tenant$ = this.currentTenant.asObservable();

  readonly availableTenants = TENANTS;

  constructor() {
    this.applyTheme(TENANTS[0]);
  }

  setTenant(slug: string) {
    const tenant = TENANTS.find(t => t.slug === slug);
    if (tenant) {
      this.currentTenant.next(tenant);
      this.applyTheme(tenant);
    }
  }

  private applyTheme(tenant: TenantConfig) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', tenant.theme.primary);
    root.style.setProperty('--color-primary-hover', tenant.theme.primaryHover);
    root.style.setProperty('--color-primary-light', tenant.theme.primaryLight);
  }
}
