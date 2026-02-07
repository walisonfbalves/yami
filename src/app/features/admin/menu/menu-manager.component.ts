import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './menu-manager.component.html'
})
export class MenuManagerComponent {
  // Mock data based on Stitch design
  products = [
      {
          id: 1,
          name: 'Truffle Wagyu Burger',
          price: 24.00,
          description: 'Premium wagyu beef patty, black truffle aioli, aged swiss cheese on a brioche bun.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK9ypvTgRzqyJAjIFCNEpSonCO97PctqpvDDo9_0R54n2uaU0Rb1ogJO1LegPLbRNg9kSVitrBvSeHQl8Aihl_zB_dnnG1lgBmGn32DxSh8mHQDFBKhiuhSVQbmVNUBeiDeSlwzs9dIBQrIoxWTA2JDk3EGKDfAHzNCPL-eiHxRlbxth6y7NzO5dkf4sLha6cJNIGL_iO3VsN--n50qN_Hyc-xBQOOPZ9DqpF95WYfbIhhWnld0v8xpo8mxLqpfsmM3jajg9tbkoU',
          category: 'Main Course',
          available: true,
          popular: true
      },
      {
          id: 2,
          name: 'Spicy Miso Ramen',
          price: 18.50,
          description: 'Rich pork broth, spicy miso paste, wood ear mushrooms, and soft-boiled egg.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jalOgOYECGemIrPsYTYm5SGGK8JCFp_OWLah30eJE_qSyg5vmEEJ-r0oAfkTym5yX_Loq2gX2rdqyDlGwCqPq55fZ0KsWZ5wRRJjtVgoD_jhIObLwMLx2yihAm0Gt-DrneRmPc_H1z5LdvReAkhLGncSzkt70T0Nk5R4zgOUvup1F1Mb0nEzZjxPcbRaHG1gcxiL343p5myg09CBn9tVgL4p0taqXH8YAqxmWL2YMEUxuuKpHHW8spF2Q4VnmGRjTyi1ej9offg',
          category: 'Main Course',
          available: true,
          popular: false
      },
       {
          id: 3,
          name: 'Honey Glazed Salmon',
          price: 29.00,
          description: 'Wild-caught Atlantic salmon with organic honey glaze and grilled asparagus.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpzkOILEGHb5b4rjJZKANYBFlQGF_4cPYIVXN_nPlcSdO64G1EO1zghD7p4kLdGsz_BQIgMcQVaXLPJixFc2WTWSpVAsACTqxeaLHk3wnsmzuHPLIrLJBDwTrhAxdRijYXM124LNxwf0pIyjRtyaXpvQKozvFM2smRfPx5ETO9_Os8rK4Og5u0iIyFdSdmcxdfRw2EFAxsZZP8W4FtnWbVDEal8EdX8zNEV9ZOr35dhLsoE75n12t28-YS6eGHyn80WtFeRDdlvbo',
          category: 'Main Course',
          available: false,
          popular: false
      },
       {
          id: 4,
          name: 'Quinoa Power Bowl',
          price: 16.00,
          description: 'Tri-color quinoa, roasted chickpeas, cucumber, feta cheese, and lemon vinaigrette.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD75Lf8kHBMvXzXFOULDUDA3OXt9VjiBjf-m9xRMmpmn12qIQ3NYmZPYptgLfJEnfufRS4Za4gEyfVAmHcr0BTCMvKqgu-fXkTRWkn34aJWGzlCI1hvwkUKgnZKuNyvzhs4KxD_EzjMa_wEfUVNfSyno4mix9692gtqcoH6dMe_VmqSbncR7DVB8CNFTSQEVefGx7Qndoy6o9yMdqbjJ3JOaAmV8XS0RfVMWwdbAtxZ7B-tEVvHT7rcsamWYXJ74DKmf2y5ZiorQBU',
          category: 'Main Course',
          available: true,
          popular: false
      },
      {
          id: 5,
          name: 'Mushroom Risotto',
          price: 22.00,
          description: 'Arborio rice with forest mushrooms, parmesan Reggiano, and white truffle oil drizzle.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpGYD4HDIMuQXewZiW-a1stycHvb5aq8jA0gpPnOVdsltb49YnN-5lMtCpTMmFRbKLyp8E4Ks365NFeQta6M4Y_dVf3LdP2bOch5nJ7kWzd2I8WfE3qceQvnmSWve-uIUMvMYt3K3lwY8LVi-ASjBxZ3wPG9iYMb8vyCuZzrqe00YszhDjff8KJ37QX7c8erhvu3v-FzEkhOq9__R4BAn2ehROKpREjx4UgURRIUJBbZRb_RN26qncOFCO0UliyWLAR0x6gNQn-Y',
          category: 'Main Course',
          available: true,
          popular: false
      },
      {
          id: 6,
          name: 'Garlic Butter Shrimp',
          price: 26.00,
          description: 'Large tiger prawns sautéed in roasted garlic, butter, and white wine reduction.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN6gSSO__TaJKvyWVWHdPYPKlBQ12eFT9DpES6N5cFr55m6gM_EIMpr6VGVg9yaGYGd8IaebMP86twlF4ruqbSr693ZpJZ3FpvwVMgnZ7sK6geIS8w-vgwrE0Jm6-DNNXodW94qmoEo8kVYcbcxUHxxcg_E9ps-iHQ6WoszivkzzDTSWelUBeZe5HKqt70R-yGJGDRwYejAitdJwMp4_PP_IdE3RzGaS7mNn8_brHjITkT_kVgoccYuBpxO2csdzyDL8S1z4oxkA4',
          category: 'Main Course',
          available: true,
          popular: false
      }
  ];

  selectedCategory = 'All Items';
  categories = ['All Items', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  showForm = false;
  productForm: FormGroup;
  editingProduct: any = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['Main Course', Validators.required],
      image: ['', Validators.required],
      available: [true]
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  toggleAvailability(product: any) {
    product.available = !product.available;
  }

  openForm(product: any = null) {
    this.showForm = true;
    this.editingProduct = product;
    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset({
        category: 'Main Course',
        available: true,
        price: 0
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.editingProduct) {
        console.log('Updating Product:', { ...this.editingProduct, ...productData });
        // Update local mock data
        const index = this.products.findIndex(p => p.id === this.editingProduct.id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
        }

      } else {
        console.log('Creating Product:', productData);
        // Add to local mock data
        this.products.push({
            id: this.products.length + 1,
            ...productData,
            popular: false 
        });
      }
      this.closeForm();
    } else {
        this.productForm.markAllAsTouched();
    }
  }
  
  deleteProduct(id: number) {
      if(confirm('Tem certeza que deseja excluir este produto?')) {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Deleted product', id);
      }
  }
}
