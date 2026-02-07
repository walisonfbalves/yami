import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compressImage } from '../../../../../shared/utils/image-compressor';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-stone-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[90vh] animate-scale-in">
            <div class="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-900/50">
                <h3 class="text-xl font-heading font-bold text-white uppercase tracking-wide">
                    {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
                </h3>
                <button (click)="onCancel()" class="text-stone-500 hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <form [formGroup]="productForm" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Imagem do Produto</label>
                        <div class="flex items-center gap-6">
                            <div class="w-24 h-24 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                                <img *ngIf="imageUrl?.value && !imageError" 
                                     [src]="imageUrl?.value" 
                                     class="w-full h-full object-cover" 
                                     alt="Preview">
                                <span *ngIf="!imageUrl?.value" class="material-symbols-outlined text-stone-700 text-3xl">image</span>
                                
                                <button *ngIf="imageUrl?.value" (click)="productForm.patchValue({image: ''})" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span class="material-symbols-outlined text-white">delete</span>
                                </button>
                            </div>

                            <div class="flex-1">
                                <label 
                                    (dragover)="onDragOver($event)"
                                    (dragleave)="onDragLeave($event)"
                                    (drop)="onDrop($event)"
                                    [class.border-primary]="isDragging"
                                    [class.bg-stone-800]="isDragging"
                                    class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors group"
                                    [ngClass]="isDragging ? 'border-primary bg-stone-800' : 'border-stone-800 bg-stone-900/50 hover:bg-stone-800/50'">
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span class="material-symbols-outlined text-stone-500 mb-1 group-hover:text-primary transition-colors">cloud_upload</span>
                                        <p class="mb-1 text-xs text-stone-500"><span class="font-bold text-stone-400 group-hover:text-white transition-colors">Clique para upload</span> ou arraste</p>
                                        <p class="text-[10px] text-stone-600">SVG, PNG, JPG or GIF (MAX. 800x800px)</p>
                                    </div>
                                    <input type="file" class="hidden" accept="image/*" (change)="onFileSelected($event)" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Nome do Produto <span class="text-red-500">*</span></label>
                        <input formControlName="name" 
                               type="text" 
                               class="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-stone-600" 
                               placeholder="Ex: Truffle Wagyu Burger">
                        <p *ngIf="productForm.get('name')?.touched && productForm.get('name')?.errors?.['required']" class="text-red-500 text-xs">O nome é obrigatório.</p>
                        <p *ngIf="productForm.get('name')?.touched && productForm.get('name')?.errors?.['minlength']" class="text-red-500 text-xs">Mínimo de 3 caracteres.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                         <div class="space-y-2">
                            <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Preço <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">R$</span>
                                <input formControlName="price" 
                                       type="number" 
                                       step="0.01" 
                                       min="0"
                                       class="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-stone-600">
                            </div>
                            <p *ngIf="productForm.get('price')?.touched && productForm.get('price')?.errors?.['required']" class="text-red-500 text-xs">Preço obrigatório.</p>
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Categoria</label>
                            <select formControlName="category" 
                                    class="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Descrição</label>
                        <textarea formControlName="description" 
                                  rows="3" 
                                  class="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-stone-600 resize-none" 
                                  placeholder="Descrição detalhada do prato..."></textarea>
                    </div>

                </form>
            </div>

            <div class="p-6 border-t border-stone-800 bg-stone-900/50 flex justify-end gap-3">
                <button (click)="onCancel()" class="px-6 py-2.5 rounded-lg border border-stone-700 font-bold text-stone-400 hover:bg-stone-800 hover:text-white transition-all">Cancelar</button>
                <button (click)="onSave()" 
                        [disabled]="productForm.invalid"
                        [class.opacity-50]="productForm.invalid"
                        [class.cursor-not-allowed]="productForm.invalid"
                        class="px-6 py-2.5 rounded-lg bg-primary text-background-dark font-bold hover:bg-amber-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">save</span>
                    Salvar Produto
                </button>
            </div>
        </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class ProductFormComponent implements OnChanges {
  @Input() product: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;
  categories = ['Burgers', 'Bebidas', 'Sobremesas', 'Pratos Principais', 'Entradas'];
  productImage: string | null = null;
  imageError = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['Burgers', Validators.required],
      image: [''],
      available: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['product'] && this.product) {
          this.productForm.patchValue(this.product);
          this.imageError = false;
      }
  }

  isDragging = false;

  get isEditing(): boolean {
      return !!this.product;
  }

  get imageUrl() {
      return this.productForm.get('image');
  }

  onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;
  }

  onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragging = false;
      
      const file = event.dataTransfer?.files[0];
      if (file) {
          this.processFile(file);
      }
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          this.processFile(file);
      }
  }

  async processFile(file: File) {
      this.imageError = false;
      // Show optimizing state (optional UI feedback logic could be added here)
      try {
          console.log('Optimizing image...');
          const compressedBlob = await compressImage(file);
          const previewUrl = URL.createObjectURL(compressedBlob);
          
          this.productForm.patchValue({ image: previewUrl });
          this.productImage = previewUrl; 
          
      } catch (error) {
          console.error('Image compression failed', error);
          this.imageError = true;
      }
  }

  onSave() {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    } else {
        this.productForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
