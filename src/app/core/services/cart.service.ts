import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product, SelectedAddon } from '../models/yami.types';

export type PaymentMethod = 'pix' | 'card' | 'cash';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _deliveryFee = signal<number>(5.99);
  private _paymentMethod = signal<PaymentMethod>('pix');

  readonly items = this._items.asReadonly();
  readonly deliveryFee = this._deliveryFee.asReadonly();
  readonly paymentMethod = this._paymentMethod.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => {
      const addonsTotal = item.addons?.reduce((a, sel) => a + sel.item.price, 0) || 0;
      return sum + (item.price + addonsTotal) * item.quantity;
    }, 0)
  );

  readonly total = computed(() => this.subtotal() + this._deliveryFee());

  // Gera um ID único para o item baseado no produto e nos IDs dos adicionais selecionados
  private generateCartItemId(productId: string, addons: SelectedAddon[] = []): string {
    const addonIds = addons.map(a => a.item.id).sort().join('_');
    return `${productId}${addonIds ? '_' + addonIds : ''}`;
  }

  addItem(product: Product, observations = '', addons: SelectedAddon[] = []): void {
    const cartItemId = this.generateCartItemId(product.id, addons);
    const existing = this._items().find(i => (i as any).cartItemId === cartItemId);
    
    if (existing) {
      this._items.update(items =>
        items.map(i =>
          (i as any).cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1, observations } : i
        )
      );
    } else {
      this._items.update(items => [
        ...items,
        { ...product, quantity: 1, addons, observations, cartItemId } as CartItem
      ]);
    }
  }

  // Se passar um id simples (productId), remove todos. Se passar cartItemId completo, remove especifico.
  removeItem(cartItemId: string): void {
    this._items.update(items => items.filter(i => (i as any).cartItemId !== cartItemId && i.id !== cartItemId));
  }

  increment(cartItemId: string): void {
    this._items.update(items =>
      items.map(i => ((i as any).cartItemId === cartItemId || i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  decrement(cartItemId: string): void {
    const item = this._items().find(i => (i as any).cartItemId === cartItemId || i.id === cartItemId);
    if (!item) return;
    if (item.quantity <= 1) {
      this.removeItem(cartItemId);
    } else {
      this._items.update(items =>
        items.map(i => ((i as any).cartItemId === cartItemId || i.id === cartItemId ? { ...i, quantity: i.quantity - 1 } : i))
      );
    }
  }

  getQuantity(productId: string): number {
    return this._items()
      .filter(i => i.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  setPaymentMethod(method: PaymentMethod): void {
    this._paymentMethod.set(method);
  }

  clear(): void {
    this._items.set([]);
  }

  generateWhatsappLink(storeName: string, pixKey: string = ''): string {
    const items = this._items();
    let message = `*Pedido - ${storeName}*\n\n*Itens:*\n`;
    items.forEach(item => {
      const addonsTotal = item.addons?.reduce((a, sel) => a + sel.item.price, 0) || 0;
      const itemPrice = (item.price + addonsTotal) * item.quantity;
      
      message += `${item.quantity}x ${item.name}`;
      if (item.addons && item.addons.length > 0) {
        message += `\n   ↳ ${item.addons.map(a => `${a.item.name} (+R$ ${a.item.price.toFixed(2).replace('.', ',')})`).join(', ')}`;
      }
      if ((item as any).observations) {
        message += `\n   ↳ Obs: ${(item as any).observations}`;
      }
      message += `\n   R$ ${itemPrice.toFixed(2).replace('.', ',')}\n\n`;
    });
    message += `*Subtotal:* R$ ${this.subtotal().toFixed(2).replace('.', ',')}\n`;
    message += `*Entrega:* R$ ${this._deliveryFee().toFixed(2).replace('.', ',')}\n`;
    message += `*Total:* R$ ${this.total().toFixed(2).replace('.', ',')}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}
