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
  mockMenu: any[];
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
    },
    mockMenu: [
      {
        id: 1,
        name: 'Truffle Wagyu Burger',
        price: 24.00,
        description: 'Premium wagyu beef patty, black truffle aioli, aged swiss cheese on a brioche bun.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9ypvTgRzqyJAjIFCNEpSonCO97PctqpvDDo9_0R54n2uaU0Rb1ogJO1LegPLbRNg9kSVitrBvSeHQl8Aihl_zB_dnnG1lgBmGn32DxSh8mHQDFBKhiuhSVQbmVNUBeiDeSlwzs9dIBQrIoxWTA2JDk3EGKDfAHzNCPL-eiHxRlbxth6y7NzO5dkf4sLha6cJNIGL_iO3VsN--n50qN_Hyc-xBQOOPZ9DqpF95WYfbIhhWnld0v8xpo8mxLqpfsmM3jajg9tbkoU',
        category: 'Burgers',
        available: true,
        popular: true
      },
      {
        id: 2,
        name: 'Smash Burger Duplo',
        price: 19.90,
        description: 'Dois smashed patties, cheddar derretido, pickles crocantes e molho especial.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jalOgOYECGemIrPsYTYm5SGGK8JCFp_OWLah30eJE_qSyg5vmEEJ-r0oAfkTym5yX_Loq2gX2rdqyDlGwCqPq55fZ0KsWZ5wRRJjtVgoD_jhIObLwMLx2yihAm0Gt-DrneRmPc_H1z5LdvReAkhLGncSzkt70T0Nk5R4zgOUvup1F1Mb0nEzZjxPcbRaHG1gcxiL343p5myg09CBn9tVgL4p0taqXH8YAqxmWL2YMEUxuuKpHHW8spF2Q4VnmGRjTyi1ej9offg',
        category: 'Burgers',
        available: true,
        popular: false
      },
      {
        id: 3,
        name: 'Bacon Cheddar Melt',
        price: 22.00,
        description: 'Blend bovino 180g, bacon crocante, cheddar inglês e cebola caramelizada.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpzkOILEGHb5b4rjJZKANYBFlQGF_4cPYIVXN_nPlcSdO64G1EO1zghD7p4kLdGsz_BQIgMcQVaXLPJixFc2WTWSpVAsACTqxeaLHk3wnsmzuHPLIrLJBDwTrhAxdRijYXM124LNxwf0pIyjRtyaXpvQKozvFM2smRfPx5ETO9_Os8rK4Og5u0iIyFdSdmcxdfRw2EFAxsZZP8W4FtnWbVDEal8EdX8zNEV9ZOr35dhLsoE75n12t28-YS6eGHyn80WtFeRDdlvbo',
        category: 'Burgers',
        available: false,
        popular: false
      },
      {
        id: 4,
        name: 'Onion Rings',
        price: 14.00,
        description: 'Anéis de cebola empanados crocantes com molho barbecue defumado.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD75Lf8kHBMvXzXFOULDUDA3OXt9VjiBjf-m9xRMmpmn12qIQ3NYmZPYptgLfJEnfufRS4Za4gEyfVAmHcr0BTCMvKqgu-fXkTRWkn34aJWGzlCI1hvwkUKgnZKuNyvzhs4KxD_EzjMa_wEfUVNfSyno4mix9692gtqcoH6dMe_VmqSbncR7DVB8CNFTSQEVefGx7Qndoy6o9yMdqbjJ3JOaAmV8XS0RfVMWwdbAtxZ7B-tEVvHT7rcsamWYXJ74DKmf2y5ZiorQBU',
        category: 'Acompanhamentos',
        available: true,
        popular: false
      },
      {
        id: 5,
        name: 'Milkshake Nutella',
        price: 16.00,
        description: 'Milkshake cremoso de Nutella com chantilly e calda de chocolate belga.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpGYD4HDIMuQXewZiW-a1stycHvb5aq8jA0gpPnOVdsltb49YnN-5lMtCpTMmFRbKLyp8E4Ks365NFeQta6M4Y_dVf3LdP2bOch5nJ7kWzd2I8WfE3qceQvnmSWve-uIUMvMYt3K3lwY8LVi-ASjBxZ3wPG9iYMb8vyCuZzrqe00YszhDjff8KJ37QX7c8erhvu3v-FzEkhOq9__R4BAn2ehROKpREjx4UgURRIUJBbZRb_RN26qncOFCO0UliyWLAR0x6gNQn-Y',
        category: 'Bebidas',
        available: true,
        popular: true
      },
      {
        id: 6,
        name: 'Classic Lemonade',
        price: 10.00,
        description: 'Limonada artesanal com hortelã fresca e gengibre.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN6gSSO__TaJKvyWVWHdPYPKlBQ12eFT9DpES6N5cFr55m6gM_EIMpr6VGVg9yaGYGd8IaebMP86twlF4ruqbSr693ZpJZ3FpvwVMgnZ7sK6geIS8w-vgwrE0Jm6-DNNXodW94qmoEo8kVYcbcxUHxxcg_E9ps-iHQ6WoszivkzzDTSWelUBeZe5HKqt70R-yGJGDRwYejAitdJwMp4_PP_IdE3RzGaS7mNn8_brHjITkT_kVgoccYuBpxO2csdzyDL8S1z4oxkA4',
        category: 'Bebidas',
        available: true,
        popular: false
      }
    ]
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
    },
    mockMenu: [
      {
        id: 1,
        name: 'Combo Sakura (40 peças)',
        price: 89.90,
        description: 'Seleção premium com salmão, atum, camarão e peixe branco. Acompanha shoyu e wasabi.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9ypvTgRzqyJAjIFCNEpSonCO97PctqpvDDo9_0R54n2uaU0Rb1ogJO1LegPLbRNg9kSVitrBvSeHQl8Aihl_zB_dnnG1lgBmGn32DxSh8mHQDFBKhiuhSVQbmVNUBeiDeSlwzs9dIBQrIoxWTA2JDk3EGKDfAHzNCPL-eiHxRlbxth6y7NzO5dkf4sLha6cJNIGL_iO3VsN--n50qN_Hyc-xBQOOPZ9DqpF95WYfbIhhWnld0v8xpo8mxLqpfsmM3jajg9tbkoU',
        category: 'Combos',
        available: true,
        popular: true
      },
      {
        id: 2,
        name: 'Hot Roll (10 unid)',
        price: 32.00,
        description: 'Uramaki empanado e frito com recheio de salmão e cream cheese.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jalOgOYECGemIrPsYTYm5SGGK8JCFp_OWLah30eJE_qSyg5vmEEJ-r0oAfkTym5yX_Loq2gX2rdqyDlGwCqPq55fZ0KsWZ5wRRJjtVgoD_jhIObLwMLx2yihAm0Gt-DrneRmPc_H1z5LdvReAkhLGncSzkt70T0Nk5R4zgOUvup1F1Mb0nEzZjxPcbRaHG1gcxiL343p5myg09CBn9tVgL4p0taqXH8YAqxmWL2YMEUxuuKpHHW8spF2Q4VnmGRjTyi1ej9offg',
        category: 'Hot',
        available: true,
        popular: true
      },
      {
        id: 3,
        name: 'Sashimi de Salmão (15 fatias)',
        price: 45.00,
        description: 'Fatias generosas de salmão fresco importado da Noruega.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpzkOILEGHb5b4rjJZKANYBFlQGF_4cPYIVXN_nPlcSdO64G1EO1zghD7p4kLdGsz_BQIgMcQVaXLPJixFc2WTWSpVAsACTqxeaLHk3wnsmzuHPLIrLJBDwTrhAxdRijYXM124LNxwf0pIyjRtyaXpvQKozvFM2smRfPx5ETO9_Os8rK4Og5u0iIyFdSdmcxdfRw2EFAxsZZP8W4FtnWbVDEal8EdX8zNEV9ZOr35dhLsoE75n12t28-YS6eGHyn80WtFeRDdlvbo',
        category: 'Sashimi',
        available: true,
        popular: false
      },
      {
        id: 4,
        name: 'Temaki de Camarão',
        price: 28.00,
        description: 'Cone de alga nori recheado com camarão empanado, cream cheese e cebolinha.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD75Lf8kHBMvXzXFOULDUDA3OXt9VjiBjf-m9xRMmpmn12qIQ3NYmZPYptgLfJEnfufRS4Za4gEyfVAmHcr0BTCMvKqgu-fXkTRWkn34aJWGzlCI1hvwkUKgnZKuNyvzhs4KxD_EzjMa_wEfUVNfSyno4mix9692gtqcoH6dMe_VmqSbncR7DVB8CNFTSQEVefGx7Qndoy6o9yMdqbjJ3JOaAmV8XS0RfVMWwdbAtxZ7B-tEVvHT7rcsamWYXJ74DKmf2y5ZiorQBU',
        category: 'Temaki',
        available: true,
        popular: false
      },
      {
        id: 5,
        name: 'Gyoza (8 unid)',
        price: 24.00,
        description: 'Pastéis japoneses grelhados recheados com carne suína e legumes.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpGYD4HDIMuQXewZiW-a1stycHvb5aq8jA0gpPnOVdsltb49YnN-5lMtCpTMmFRbKLyp8E4Ks365NFeQta6M4Y_dVf3LdP2bOch5nJ7kWzd2I8WfE3qceQvnmSWve-uIUMvMYt3K3lwY8LVi-ASjBxZ3wPG9iYMb8vyCuZzrqe00YszhDjff8KJ37QX7c8erhvu3v-FzEkhOq9__R4BAn2ehROKpREjx4UgURRIUJBbZRb_RN26qncOFCO0UliyWLAR0x6gNQn-Y',
        category: 'Entradas',
        available: true,
        popular: false
      },
      {
        id: 6,
        name: 'Missoshiru',
        price: 12.00,
        description: 'Sopa tradicional japonesa de pasta de soja com tofu e cebolinha.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN6gSSO__TaJKvyWVWHdPYPKlBQ12eFT9DpES6N5cFr55m6gM_EIMpr6VGVg9yaGYGd8IaebMP86twlF4ruqbSr693ZpJZ3FpvwVMgnZ7sK6geIS8w-vgwrE0Jm6-DNNXodW94qmoEo8kVYcbcxUHxxcg_E9ps-iHQ6WoszivkzzDTSWelUBeZe5HKqt70R-yGJGDRwYejAitdJwMp4_PP_IdE3RzGaS7mNn8_brHjITkT_kVgoccYuBpxO2csdzyDL8S1z4oxkA4',
        category: 'Entradas',
        available: false,
        popular: false
      }
    ]
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
    },
    mockMenu: [
      {
        id: 1,
        name: 'Buddha Bowl',
        price: 28.00,
        description: 'Bowl nutritivo com quinoa, grão-de-bico, abacate, edamame e molho tahini.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9ypvTgRzqyJAjIFCNEpSonCO97PctqpvDDo9_0R54n2uaU0Rb1ogJO1LegPLbRNg9kSVitrBvSeHQl8Aihl_zB_dnnG1lgBmGn32DxSh8mHQDFBKhiuhSVQbmVNUBeiDeSlwzs9dIBQrIoxWTA2JDk3EGKDfAHzNCPL-eiHxRlbxth6y7NzO5dkf4sLha6cJNIGL_iO3VsN--n50qN_Hyc-xBQOOPZ9DqpF95WYfbIhhWnld0v8xpo8mxLqpfsmM3jajg9tbkoU',
        category: 'Bowls',
        available: true,
        popular: true
      },
      {
        id: 2,
        name: 'Burger Plant-Based',
        price: 32.00,
        description: 'Hambúrguer vegetal artesanal com queijo de castanha, alface e tomate orgânico.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jalOgOYECGemIrPsYTYm5SGGK8JCFp_OWLah30eJE_qSyg5vmEEJ-r0oAfkTym5yX_Loq2gX2rdqyDlGwCqPq55fZ0KsWZ5wRRJjtVgoD_jhIObLwMLx2yihAm0Gt-DrneRmPc_H1z5LdvReAkhLGncSzkt70T0Nk5R4zgOUvup1F1Mb0nEzZjxPcbRaHG1gcxiL343p5myg09CBn9tVgL4p0taqXH8YAqxmWL2YMEUxuuKpHHW8spF2Q4VnmGRjTyi1ej9offg',
        category: 'Burgers',
        available: true,
        popular: true
      },
      {
        id: 3,
        name: 'Wrap Mediterrâneo',
        price: 24.00,
        description: 'Wrap integral com falafel, homus, legumes grelhados e molho de hortelã.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpzkOILEGHb5b4rjJZKANYBFlQGF_4cPYIVXN_nPlcSdO64G1EO1zghD7p4kLdGsz_BQIgMcQVaXLPJixFc2WTWSpVAsACTqxeaLHk3wnsmzuHPLIrLJBDwTrhAxdRijYXM124LNxwf0pIyjRtyaXpvQKozvFM2smRfPx5ETO9_Os8rK4Og5u0iIyFdSdmcxdfRw2EFAxsZZP8W4FtnWbVDEal8EdX8zNEV9ZOr35dhLsoE75n12t28-YS6eGHyn80WtFeRDdlvbo',
        category: 'Wraps',
        available: true,
        popular: false
      },
      {
        id: 4,
        name: 'Açaí Bowl Tropical',
        price: 22.00,
        description: 'Açaí batido com banana, granola artesanal, frutas frescas e mel de agave.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD75Lf8kHBMvXzXFOULDUDA3OXt9VjiBjf-m9xRMmpmn12qIQ3NYmZPYptgLfJEnfufRS4Za4gEyfVAmHcr0BTCMvKqgu-fXkTRWkn34aJWGzlCI1hvwkUKgnZKuNyvzhs4KxD_EzjMa_wEfUVNfSyno4mix9692gtqcoH6dMe_VmqSbncR7DVB8CNFTSQEVefGx7Qndoy6o9yMdqbjJ3JOaAmV8XS0RfVMWwdbAtxZ7B-tEVvHT7rcsamWYXJ74DKmf2y5ZiorQBU',
        category: 'Bowls',
        available: true,
        popular: false
      },
      {
        id: 5,
        name: 'Suco Verde Detox',
        price: 14.00,
        description: 'Couve, maçã verde, gengibre, limão e hortelã. Prensado a frio.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpGYD4HDIMuQXewZiW-a1stycHvb5aq8jA0gpPnOVdsltb49YnN-5lMtCpTMmFRbKLyp8E4Ks365NFeQta6M4Y_dVf3LdP2bOch5nJ7kWzd2I8WfE3qceQvnmSWve-uIUMvMYt3K3lwY8LVi-ASjBxZ3wPG9iYMb8vyCuZzrqe00YszhDjff8KJ37QX7c8erhvu3v-FzEkhOq9__R4BAn2ehROKpREjx4UgURRIUJBbZRb_RN26qncOFCO0UliyWLAR0x6gNQn-Y',
        category: 'Bebidas',
        available: true,
        popular: false
      },
      {
        id: 6,
        name: 'Brownie Sem Glúten',
        price: 16.00,
        description: 'Brownie vegano de cacau 70% com nozes, sem glúten e sem lactose.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN6gSSO__TaJKvyWVWHdPYPKlBQ12eFT9DpES6N5cFr55m6gM_EIMpr6VGVg9yaGYGd8IaebMP86twlF4ruqbSr693ZpJZ3FpvwVMgnZ7sK6geIS8w-vgwrE0Jm6-DNNXodW94qmoEo8kVYcbcxUHxxcg_E9ps-iHQ6WoszivkzzDTSWelUBeZe5HKqt70R-yGJGDRwYejAitdJwMp4_PP_IdE3RzGaS7mNn8_brHjITkT_kVgoccYuBpxO2csdzyDL8S1z4oxkA4',
        category: 'Sobremesas',
        available: false,
        popular: false
      }
    ]
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
