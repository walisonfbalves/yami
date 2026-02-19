import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';
import { AnalyticsService, AnalyticsData } from './analytics.service';
import { ExcelService } from '../../../core/services/excel.service';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule, 
    NgChartsModule,
    CardComponent,
    ButtonComponent,
    MetricCardComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  
  analyticsData: AnalyticsData | null = null;
  isLoading = true;
  error: string | null = null;
  selectedPeriod: '7d' | '30d' | 'month' | 'all' = '30d';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Receita (R$)' }]
  };
  
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1917',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Receita: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.raw as number)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#292524', display: false },
        ticks: { color: '#9ca3af', font: { size: 10, weight: 'bold' } },
        border: { display: false }
      },
      y: {
        grid: { color: '#292524' },
        ticks: { 
          color: '#6b7280', 
          font: { size: 10, weight: 'bold' },
          callback: (value) => `R$ ${value}` 
        },
        border: { display: false }
      }
    },
    elements: {
      bar: {
        backgroundColor: '#f59f0a',
        borderRadius: 4,
        hoverBackgroundColor: '#fbbf24'
      }
    }
  };

  public hourlyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public hourlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1917',
        titleColor: '#fff',
        bodyColor: '#d97706',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#78716c', font: { size: 10 } },
        border: { display: false }
      },
      y: {
        display: false,
        grid: { display: false }
      }
    },
    elements: {
      bar: {
        backgroundColor: '#d97706',
        borderRadius: 4,
        hoverBackgroundColor: '#f59e0b'
      }
    }
  };

  public categoryChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  public categoryChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', 
    plugins: {
      legend: { 
        display: true, 
        position: 'right',
        labels: { color: '#a8a29e', usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: '#1c1917',
        bodyColor: '#fff',
        callbacks: {
           label: (context) => ` ${context.label}: ${context.raw}%`
        }
      }
    }
  };

  constructor(
    private analyticsService: AnalyticsService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.loadData('30d');
  }

  loadData(period: '7d' | '30d' | 'month' | 'all') {
    this.isLoading = true;
    this.selectedPeriod = period;
    
    this.analyticsService.getAnalyticsData(period).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.updateChart(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados. Verifique se o script SQL foi executado.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateChart(data: AnalyticsData) {
    this.barChartData = {
      labels: data.revenueChart.labels,
      datasets: [
        { 
          data: data.revenueChart.data, 
          label: 'Receita',
          backgroundColor: '#f59e0b',
          hoverBackgroundColor: '#fbbf24'
        }
      ]
    };

    this.hourlyChartData = {
      labels: data.hourlyVolume.hours,
      datasets: [
        {
          data: data.hourlyVolume.values,
          label: 'Pedidos',
          backgroundColor: '#d97706',
          hoverBackgroundColor: '#f59e0b',
          barThickness: 12
        }
      ]
    };

    this.categoryChartData = {
      labels: data.popularCategories.labels,
      datasets: [
        {
          data: data.popularCategories.values,
          backgroundColor: ['#f59e0b', '#d97706', '#92400e'], 
          hoverBackgroundColor: ['#fbbf24', '#f59e0b', '#b45309'],
          borderWidth: 0
        }
      ]
    };
  }

  downloadExcel() {
    if (this.analyticsData) {
      this.excelService.generateAnalyticsReport(this.analyticsData);
    }
  }
}
