import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AddonGroup, AddonItem, LocalOptionGroup } from '../models/yami.types';

@Injectable({ providedIn: 'root' })
export class AddonsService {
  private supabase = inject(SupabaseService).supabaseClient;

  async getGroupsByProduct(productId: string): Promise<AddonGroup[]> {
    const { data, error } = await this.supabase
      .from('addon_groups')
      .select('*, items:addon_items(*)')
      .eq('product_id', productId)
      .order('sort_order')
      .order('sort_order', { referencedTable: 'addon_items' });

    if (error) throw error;
    return (data ?? []) as AddonGroup[];
  }

  async createGroup(group: Omit<AddonGroup, 'id' | 'items'>): Promise<AddonGroup> {
    const { data, error } = await this.supabase
      .from('addon_groups')
      .insert(group)
      .select('*, items:addon_items(*)')
      .single();
    if (error) throw error;
    return data as AddonGroup;
  }

  async updateGroup(id: string, data: Partial<Pick<AddonGroup, 'name' | 'required' | 'max_choices' | 'min_choices' | 'price_type'>>): Promise<void> {
    const { error } = await this.supabase.from('addon_groups').update(data).eq('id', id);
    if (error) throw error;
  }

  async deleteGroup(id: string): Promise<void> {
    const { error } = await this.supabase.from('addon_groups').delete().eq('id', id);
    if (error) throw error;
  }

  async createItem(item: Omit<AddonItem, 'id'>): Promise<AddonItem> {
    const { data, error } = await this.supabase
      .from('addon_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data as AddonItem;
  }

  async updateItem(id: string, data: Partial<Pick<AddonItem, 'name' | 'price' | 'is_available'>>): Promise<void> {
    const { error } = await this.supabase.from('addon_items').update(data).eq('id', id);
    if (error) throw error;
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await this.supabase.from('addon_items').delete().eq('id', id);
    if (error) throw error;
  }

  async saveAddonGroupsForProduct(productId: string, storeId: string, localGroups: LocalOptionGroup[]): Promise<void> {
    for (let i = 0; i < localGroups.length; i++) {
      const lg = localGroups[i];
      if (!lg.name.trim() && lg.options.length === 0) continue;

      const { data: groupData, error: groupError } = await this.supabase
        .from('addon_groups')
        .insert({
          product_id: productId,
          store_id: storeId,
          name: lg.name || 'Grupo',
          required: lg.required,
          min_choices: lg.min,
          max_choices: lg.max,
          sort_order: i
        })
        .select('id')
        .single();

      if (groupError) throw groupError;

      const groupId = groupData.id;

      for (let j = 0; j < lg.options.length; j++) {
        const opt = lg.options[j];
        if (!opt.name.trim()) continue;

        const { error: itemError } = await this.supabase
          .from('addon_items')
          .insert({
            group_id: groupId,
            name: opt.name,
            price: opt.price ?? 0,
            is_available: true,
            sort_order: j
          });

        if (itemError) throw itemError;
      }
    }
  }
}

