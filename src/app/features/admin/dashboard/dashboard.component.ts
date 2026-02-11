import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MetricCardComponent,
    ButtonComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Logic for charts and tables would go here
}
