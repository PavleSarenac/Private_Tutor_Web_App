import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js/auto"
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-histogram-chart-classes-per-day',
  templateUrl: './histogram-chart-classes-per-day.component.html',
  styleUrls: ['./histogram-chart-classes-per-day.component.css']
})
export class HistogramChartClassesPerDayComponent implements OnInit {
  chart: any
  yAxisValues: number[] = []

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getAverageClassesPerDay().subscribe(
      (daysObject: any) => {
        this.setYAxisValues(daysObject)
        this.createHistogramChart()
      }
    )
  }

  setYAxisValues(daysObject: any) {
    this.yAxisValues[0] = daysObject.Monday / 52
    this.yAxisValues[1] = daysObject.Tuesday / 52
    this.yAxisValues[2] = daysObject.Wednesday / 52
    this.yAxisValues[3] = daysObject.Thursday / 52
    this.yAxisValues[4] = daysObject.Friday / 52
    this.yAxisValues[5] = daysObject.Saturday / 52
    this.yAxisValues[6] = daysObject.Sunday / 52
  }

  createHistogramChart() {
    this.chart = new Chart(
      "histogram-chart-classes-per-day",
      {
        type: "bar",
        data: {
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          datasets: [
            {
              label: "Average number of classes per day (2023)",
              data: this.yAxisValues,
              backgroundColor: "blue"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1
        }
      }
    )
  }
}
