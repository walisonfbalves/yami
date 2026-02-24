import { Directive, HostListener, ElementRef, Optional, Self, OnInit, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[currencyMask]',
  standalone: true
})
export class CurrencyMaskDirective implements OnInit {
  @Input('currencyMask') isCurrency: boolean | string = false;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  get enabled(): boolean {
    return this.isCurrency === true || this.isCurrency === 'true' || this.isCurrency === '';
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.enabled && this.ngControl && this.ngControl.value) {
        this.el.nativeElement.value = this.formatCurrency(this.ngControl.value.toString().replace('.', ''));
      }
    });

    if (this.ngControl && this.ngControl.valueChanges) {
        this.ngControl.valueChanges.subscribe(val => {
            if (!this.enabled) return;

            if (val !== null && val !== undefined) {
                const unmasked = this.unmask(this.el.nativeElement.value);
                const valNumber = parseFloat(val);
                if (valNumber !== unmasked && !isNaN(valNumber)) {
                    const asString = valNumber.toFixed(2).replace('.', '');
                    this.el.nativeElement.value = this.formatCurrency(asString);
                }
            } else {
                this.el.nativeElement.value = '';
            }
        });
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (!this.enabled) return;

    const value = event.target ? event.target.value : '';

    if (!value) {
      if (this.ngControl && this.ngControl.control) {
        this.ngControl.control.setValue(null, { emitEvent: false });
      }
      return;
    }

    const unmaskedNumber = this.unmask(value);
    const cleanStr = value.replace(/\D/g, '');
    const masked = this.formatCurrency(cleanStr);
    
    this.el.nativeElement.value = masked;

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(unmaskedNumber, { emitEvent: false });
    }
  }

  private unmask(value: string): number {
    if (!value) return 0;
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue === '') return 0;
    return parseFloat(cleanValue) / 100;
  }

  private formatCurrency(cleanValue: string): string {
    if (!cleanValue) return '';
    const numberValue = parseFloat(cleanValue) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue);
  }
}
