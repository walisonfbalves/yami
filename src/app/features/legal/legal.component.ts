import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-stone-950 text-stone-300 font-display p-6 md:p-12">
        <div class="max-w-3xl mx-auto">
            <!-- Header -->
            <div class="mb-12 text-center">
                <a routerLink="/" class="inline-block mb-6 text-primary hover:text-amber-400 transition-colors">
                    <span class="material-symbols-outlined text-4xl">restaurant_menu</span>
                </a>
                <h1 class="text-3xl md:text-4xl font-heading font-bold text-white mb-2">{{ title }}</h1>
                <p class="text-stone-500">Última atualização: Hoje</p>
            </div>

            <!-- Content -->
            <div class="bg-[#1c1917] rounded-2xl p-8 md:p-12 shadow-xl border border-stone-800 space-y-8">
                
                <ng-container *ngIf="type === 'terms'">
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">1. O Serviço</h2>
                        <p class="leading-relaxed">O Yami é uma plataforma SaaS para gestão de pedidos. Nós fornecemos o software 'como está' (as-is), sem garantias implícitas de adequação a fins específicos.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">2. Responsabilidade</h2>
                        <p class="leading-relaxed">Você é inteiramente responsável pelos produtos cadastrados e pelas entregas realizadas aos seus clientes. O Yami não tem vínculo empregatício com seus entregadores ou funcionários.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">3. Pagamentos</h2>
                        <p class="leading-relaxed">O uso da plataforma está sujeito às taxas e mensalidades vigentes no plano escolhido. O não pagamento pode resultar na suspensão imediata dos serviços.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">4. Cancelamento</h2>
                        <p class="leading-relaxed">Reservamo-nos o direito de suspender contas que violem leis locais, direitos autorais ou utilizem a plataforma para fins ilícitos.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
                        <p class="leading-relaxed">Todo o código-fonte, design, logotipos e marcas do Yami são propriedade intelectual exclusiva da nossa empresa e estão protegidos por leis de direitos autorais.</p>
                    </section>
                </ng-container>

                <ng-container *ngIf="type === 'privacy'">
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">1. Coleta de Dados</h2>
                        <p class="leading-relaxed">Coletamos apenas informações essenciais para o funcionamento do sistema, incluindo: Nome, E-mail, Dados da Loja e Cardápio.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">2. Uso das Informações</h2>
                        <p class="leading-relaxed">Seus dados são usados exclusivamente para processar pedidos, gerar relatórios de desempenho e melhorar sua experiência no app. Não os utilizamos para fins publicitários de terceiros.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">3. Compartilhamento</h2>
                        <p class="leading-relaxed">Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais (ex: Gateways de Pagamento) estritamente para processar transações financeiras.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">4. Segurança</h2>
                        <p class="leading-relaxed">Suas senhas são criptografadas (hash) e armazenamos seus dados em servidores seguros com backups diários e controle de acesso rigoroso.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-4">5. Seus Direitos</h2>
                        <p class="leading-relaxed">Você pode solicitar a exclusão da sua conta e de todos os seus dados a qualquer momento através do nosso suporte. A exclusão é permanente.</p>
                    </section>
                </ng-container>

            </div>

            <!-- Footer -->
            <div class="mt-12 text-center">
                 <a routerLink="/auth/login" class="text-sm font-medium text-stone-500 hover:text-white transition-colors">
                    ← Voltar para Login
                 </a>
            </div>
        </div>
    </div>
  `
})
export class LegalComponent implements OnInit {
  type: 'terms' | 'privacy' = 'terms';
  title: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.type = data['type'] || 'terms';
      this.title = this.type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade';
    });
  }
}
