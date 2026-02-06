import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuData } from '../models/yami.types';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  getRestaurantData(slug: string): Observable<MenuData> {
    // Mock data mimicking a real backend response
    const data: MenuData = {
      restaurant: {
        name: 'Burger Kingo',
        bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop', // Burger banner
        logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop'   // Burger logo placeholder
      },
      categories: [
        { id: '1', name: 'Populares' },
        { id: '2', name: 'Burgers' },
        { id: '3', name: 'Bebidas' },
        { id: '4', name: 'Sobremesas' }
      ],
      products: [
        {
          id: '101',
          categoryId: '1',
          name: 'X-Bacon Supremo',
          description: 'Pão brioche, 2 blends de 150g, muito bacon crocante, queijo cheddar e maionese da casa.',
          price: 32.90,
          imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: '102',
          categoryId: '1',
          name: 'Combo Casal',
          description: '2 X-Salada, 2 Batatas fritas médias e 1 Refrigerante de 2L.',
          price: 54.90,
          imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: '201',
          categoryId: '2',
          name: 'Classic Burger',
          description: 'Pão australiano, blend 180g, queijo prato, alface, tomate e cebola roxa.',
          price: 24.50,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: '202',
          categoryId: '2',
          name: 'Cheddar Melt',
          description: 'Pão brioche, blend 180g, muito cheddar cremoso e cebola caramelizada.',
          price: 28.00,
          imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: '301',
          categoryId: '3',
          name: 'Coca-Cola Lata 350ml',
          description: 'Geladíssima.',
          price: 6.00,
          imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: '302',
          categoryId: '3',
          name: 'Suco de Laranja Natural',
          description: '500ml. Feito na hora.',
          price: 9.00,
          imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&auto=format&fit=crop'
        }
      ]
    };

    return of(data);
  }
}
