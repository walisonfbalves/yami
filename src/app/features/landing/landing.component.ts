import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  revenue = 2000;

  get planName(): string {
    if (this.revenue <= 1000) return 'Start';
    if (this.revenue <= 5000) return 'Crescimento';
    if (this.revenue <= 15000) return 'Pro';
    return 'Master';
  }

  get planPrice(): number {
    if (this.revenue <= 1000) return 0;
    if (this.revenue <= 5000) return 49.90;
    if (this.revenue <= 15000) return 99.90;
    return 189.90;
  }

  get formattedRevenue(): string {
    return this.revenue.toLocaleString('pt-BR');
  }

  get formattedPrice(): string {
    if (this.planPrice === 0) return 'Grátis';
    return this.planPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  get isFree(): boolean {
    return this.planPrice === 0;
  }

  faqItems = [
    {
      question: 'É verdade que posso começar de graça?',
      answer: 'Sim! O plano Start é 100% gratuito para quem fatura até R$ 1.000,00 por mês pelo sistema. Você usa todas as ferramentas sem pagar mensalidade. Cresceu? O plano se ajusta automaticamente.'
    },
    {
      question: 'O dinheiro das vendas cai na minha conta?',
      answer: 'Com certeza. O Yami não segura seu dinheiro. Se você vender via Pix ou Cartão na entrega, o dinheiro é todo seu na hora. Nós somos o sistema de gestão, não o banco.'
    },
    {
      question: 'Preciso de computador ou funciona no celular?',
      answer: 'Funciona onde você estiver. O Yami foi desenhado para rodar leve no celular do dono, no tablet da cozinha ou no computador do caixa.'
    },
    {
      question: 'Se eu não vender nada no mês, eu pago?',
      answer: 'Não. Nosso modelo é justo: se você não usar ou não vender acima do limite gratuito, sua fatura é Zero. Nós só crescemos quando você cresce.'
    },
    {
      question: 'Tem contrato de fidelidade?',
      answer: 'Nenhum. Você é livre para cancelar quando quiser, sem multas e sem letras miúdas. Acreditamos que você vai ficar porque o sistema é bom, não porque está preso.'
    }
  ];
}
