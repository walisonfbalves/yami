import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';
import { AnalyticsService, AnalyticsData } from './analytics.service';

Chart.register(...registerables);
import { Observable } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  
  analyticsData: AnalyticsData | null = null;
  isLoading = true;
  selectedPeriod: '7d' | '30d' | 'month' | 'all' = '30d';

  // Bar Chart Config
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
        bodyColor: '#fbbf24',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { color: '#292524', display: false },
        title: { display: false },
        ticks: { color: '#a8a29e' },
        border: { display: false }
      },
      y: {
        grid: { color: '#292524' },
        ticks: { color: '#a8a29e', callback: (value) => `R$ ${value}` },
        border: { display: false }
      }
    },
    elements: {
      bar: {
        backgroundColor: '#f59e0b',
        borderRadius: 4,
        hoverBackgroundColor: '#fbbf24'
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadData('30d');
  }

  loadData(period: '7d' | '30d' | 'month' | 'all') {
    this.isLoading = true;
    this.selectedPeriod = period;
    
    this.analyticsService.getAnalyticsData(period).subscribe(data => {
      this.analyticsData = data;
      this.updateChart(data);
      this.isLoading = false;
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
  }
}
