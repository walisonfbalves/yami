import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compressImage } from '../../../../../shared/utils/image-compressor';
import { MenuService } from '../../../../../core/services/menu.service';

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
                                <img *ngIf="productForm.get('image_url')?.value && !imageError" 
                                     [src]="productForm.get('image_url')?.value" 
                                     class="w-full h-full object-cover" 
                                     alt="Preview">
                                <span *ngIf="!productForm.get('image_url')?.value" class="material-symbols-outlined text-stone-700 text-3xl">image</span>
                                
                                <button *ngIf="productForm.get('image_url')?.value" (click)="productForm.patchValue({image_url: ''})" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span class="material-symbols-outlined text-white">delete</span>
                                </button>
                                
                                <div *ngIf="isUploading" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
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
                                    <input type="file" class="hidden" accept="image/*" (change)="onFileSelected($event)" [disabled]="isUploading" />
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
                            <select formControlName="category_id" 
                                    class="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                <option *ngFor="let cat of categoriesList" [value]="cat.id">{{ cat.name }}</option>
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
                        [disabled]="productForm.invalid || isUploading"
                        [class.opacity-50]="productForm.invalid || isUploading"
                        [class.cursor-not-allowed]="productForm.invalid || isUploading"
                        class="px-6 py-2.5 rounded-lg bg-primary text-background-dark font-bold hover:bg-amber-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span *ngIf="!isUploading" class="material-symbols-outlined text-[18px]">save</span>
                    <span *ngIf="isUploading" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    {{ isUploading ? 'Salvando...' : 'Salvar Produto' }}
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
export class ProductFormComponent implements OnChanges, OnInit {
  @Input() product: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private menuService = inject(MenuService);

  productForm: FormGroup;
  categoriesList: any[] = []; // Should be injected or passed as input
  isUploading = false;
  imageError = false;
  isDragging = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      image_url: [''],
      is_available: [true]
    });
  }

  ngOnInit() {
      // Fetch categories for the select dropdown
      // For now, assuming we have a valid storeId available or we pass categories as input
      // Let's rely on parent passing categories ideally, but for quick fix, fetching here:
      const storeId = '639d6759-3315-420a-86c3-16298517220b'; 
      this.menuService.getCategories(storeId).subscribe(cats => {
          this.categoriesList = cats;
          if (cats.length > 0 && !this.productForm.get('category_id')?.value) {
              this.productForm.patchValue({ category_id: cats[0].id });
          }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['product'] && this.product) {
          this.productForm.patchValue({
              ...this.product,
              category_id: this.product.category_id || this.product.category // handle both naming conventions if transitioned
          });
          this.imageError = false;
      }
  }

  get isEditing(): boolean {
      return !!this.product;
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
      this.isUploading = true;
      try {
          // Compress before upload if needed
          const compressedBlob = await compressImage(file);
          const compressedFile = new File([compressedBlob], file.name, { type: file.type });

          const publicUrl = await this.menuService.uploadImage(compressedFile);
          
          this.productForm.patchValue({ image_url: publicUrl });
          
      } catch (error) {
          console.error('Image upload failed', error);
          this.imageError = true;
      } finally {
          this.isUploading = false;
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
