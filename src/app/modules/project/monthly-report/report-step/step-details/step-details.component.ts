import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { map } from 'rxjs';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { MonthlyReportsService } from 'src/app/services/monthly-reports.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrl: './step-details.component.scss'
})
export class StepDetailsComponent implements OnInit {
  reportId: number;
  reportDetails: any;

  printCheck: boolean = false;
  isLoading: boolean;
  projectId: number;

  chartOptions: any = {};
  chartOption2: any = {};
  chartSize: number = 150;
  chartLine: number = 15;
  chartRotate: number = 145;
  projectCreationDetails: any;
  projectDetails: any;
  UpdateProgressForm: FormGroup;


  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private monthlyReportsService: MonthlyReportsService,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectDetails();
      }
    });

    this.activatedRoute.queryParams.subscribe((res) => {
      this.printCheck = res['print'];
      this.reportId = +res['reportId'];
      if (this.reportId) {
        this.getReportDetails();
      }
    });


    setTimeout(() => {
      this.initChart(this.chartSize, this.chartLine, this.chartRotate);
      this.initChart2(this.chartSize, this.chartLine, this.chartRotate);
      this.initChart3(this.chartSize, this.chartLine, this.chartRotate);
    }, 10);
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe(res => {
      this.projectCreationDetails = res.data;
      console.log('projectCreationDetails', this.projectCreationDetails);
      this.cdr.detectChanges();
    });
    this.monthlyReportsService.getProjectData(this.projectId).subscribe(res => {
      this.projectDetails = res.data;
      console.log('projectDetails', this.projectDetails);
      this.chartOptions = this.getChartOptions(180);
      this.chartOption2 = this.getChartOptions2(180);
      this.cdr.detectChanges();
    });
  }
  getReportDetails() {
    this.monthlyReportsService.getReportById(this.reportId).subscribe((res) => {
      this.reportDetails = res.data;
      console.log('reportDetails', this.reportDetails);
      setTimeout(() => {
        if (this.printCheck) window.print();
      }, 500);
      this.cdr.detectChanges();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.UpdateProgressForm.patchValue({
        attachment: file
      });
      // You can mark the control as touched or dirty if needed
      this.UpdateProgressForm.get('attachment')?.markAsTouched();
    }
  }

  initDifference() {
    this.UpdateProgressForm.get('actualPercentage')?.valueChanges
      .pipe(
        map((actualProgressValue) => {
          const plannedProgress = Number(this.UpdateProgressForm.get('plannedProgress')?.value || 0);
          const actualProgress = Number(actualProgressValue || 0);

          // Calculate the difference
          return (plannedProgress - actualProgress).toFixed(2);

        })).subscribe((difference) => {
          const differenceControl = this.UpdateProgressForm.get('difference');
          const actualControl: any = this.UpdateProgressForm.get('actualPercentage');
          const statusControl: any = this.UpdateProgressForm.get('status');
          if (differenceControl) {
            differenceControl.setValue(difference, { emitEvent: false });
          }
          // Check the difference and set the status value
          if (+difference < 0) {
            statusControl?.setValue(1, { emitEvent: false });
          } else if (+difference >= 0 && +difference <= 5) {
            statusControl?.setValue(2, { emitEvent: false });
          } else if (+difference >= 5 && +difference <= 25) {
            statusControl?.setValue(3, { emitEvent: false });
          } else if (+difference >= 25) {
            statusControl?.setValue(4, { emitEvent: false });
          }
        });
  }

  getValue(difference: any) {
    let result = 0;
    if (+difference < 0) {
      result = 1
    } else if (+difference >= 0 && +difference <= 5) {
      result = 2
    } else if (+difference >= 5 && +difference <= 25) {
      result = 3
    } else if (+difference >= 25) {
      result = 5
    }

    return result
  }

  saveChanges() {
    if (!this.UpdateProgressForm.valid) {
      this.UpdateProgressForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload: any = {
      ...this.UpdateProgressForm.getRawValue(),
      attachment: "images.png",
      reasons: "string",
      actionRequired: "string",
      difference: +this.UpdateProgressForm.get('difference')?.value,
      actualPercentage: +this.UpdateProgressForm.get('actualPercentage')?.value,
      projectId: this.projectId
    }

    this.projectsService.updateProgressInfo(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert({ icon: 'success', title: 'Success!', text: 'Progress Updated successfully' });
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again' });
        this.isLoading = false;
      }
    });
  }

  getChartOptions(height: number) {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-primary')
    const secondaryColor = getCSSVariableValue('--bs-gray-300')

    return {
      series: [
        {
          name: 'Actual',
          data: this.projectDetails?.scurves.map((item: any) => item.actualValue),
        },
        {
          name: 'Planned',
          data: this.projectDetails?.scurves.map((item: any) => item.plannedValue),
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.projectDetails?.scurves.map((item: any) => item.month),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val: number) {
            return val + ' %';
          },
        },
      },
      colors: [baseColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    };
  }
  getChartOptions2(height: number) {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-success')
    const secondaryColor = getCSSVariableValue('--bs-gray-300')

    return {
      series: [
        {
          name: 'Actual',
          data: this.projectDetails?.resourcePlans.map((item: any) => item.actualLabour),
        },
        {
          name: 'Planned',
          data: this.projectDetails?.resourcePlans.map((item: any) => item.plannedLabour),
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.projectDetails?.resourcePlans.map((item: any) => item.month),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val: number) {
            return val + ' %';
          },
        },
      },
      colors: [baseColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    };
  }

  initChart(
    chartSize: number,
    chartLine: number,
    chartRotate: number
  ) {
    const el = document.getElementById('kt_card_widget_17_chart');

    if (!el) {
      return;
    }

    var options = {
      size: chartSize,
      lineWidth: chartLine,
      rotate: chartRotate,
      //percent:  el.getAttribute('data-kt-percent') ,
    };

    const canvas = document.createElement('canvas');
    const span = document.createElement('span');

    // @ts-ignore
    if (typeof G_vmlCanvasManager !== 'undefined') {
      // @ts-ignore
      G_vmlCanvasManager.initElement(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;

    el.appendChild(span);
    el.appendChild(canvas);

    // @ts-ignore
    ctx.translate(options.size / 2, options.size / 2); // change center
    // @ts-ignore
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
    const radius = (options.size - options.lineWidth) / 2;

    const drawCircle = function (
      color: string,
      lineWidth: number,
      percent: number
    ) {
      percent = Math.min(Math.max(0, percent || 1), 1);
      if (!ctx) {
        return;
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
      ctx.strokeStyle = color;
      ctx.lineCap = 'round'; // butt, round or square
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Init
    drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
    drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, 30 / 100);
  };
  initChart2(
    chartSize: number,
    chartLine: number,
    chartRotate: number
  ) {
    const el = document.getElementById('kt_card_widget_17_chart2');

    if (!el) {
      return;
    }

    var options = {
      size: chartSize,
      lineWidth: chartLine,
      rotate: chartRotate,
      //percent:  el.getAttribute('data-kt-percent') ,
    };

    const canvas = document.createElement('canvas');
    const span = document.createElement('span');

    // @ts-ignore
    if (typeof G_vmlCanvasManager !== 'undefined') {
      // @ts-ignore
      G_vmlCanvasManager.initElement(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;

    el.appendChild(span);
    el.appendChild(canvas);

    // @ts-ignore
    ctx.translate(options.size / 2, options.size / 2); // change center
    // @ts-ignore
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
    const radius = (options.size - options.lineWidth) / 2;

    const drawCircle = function (
      color: string,
      lineWidth: number,
      percent: number
    ) {
      percent = Math.min(Math.max(0, percent || 1), 1);
      if (!ctx) {
        return;
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
      ctx.strokeStyle = color;
      ctx.lineCap = 'round'; // butt, round or square
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Init
    drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
    drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, 50 / 100);
  };
  initChart3(
    chartSize: number,
    chartLine: number,
    chartRotate: number
  ) {
    const el = document.getElementById('kt_card_widget_17_chart3');

    if (!el) {
      return;
    }

    var options = {
      size: chartSize,
      lineWidth: chartLine,
      rotate: chartRotate,
      //percent:  el.getAttribute('data-kt-percent') ,
    };

    const canvas = document.createElement('canvas');
    const span = document.createElement('span');

    // @ts-ignore
    if (typeof G_vmlCanvasManager !== 'undefined') {
      // @ts-ignore
      G_vmlCanvasManager.initElement(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;

    el.appendChild(span);
    el.appendChild(canvas);

    // @ts-ignore
    ctx.translate(options.size / 2, options.size / 2); // change center
    // @ts-ignore
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
    const radius = (options.size - options.lineWidth) / 2;

    const drawCircle = function (
      color: string,
      lineWidth: number,
      percent: number
    ) {
      percent = Math.min(Math.max(0, percent || 1), 1);
      if (!ctx) {
        return;
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
      ctx.strokeStyle = color;
      ctx.lineCap = 'round'; // butt, round or square
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Init
    drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
    drawCircle(getCSSVariableValue('--bs-danger'), options.lineWidth, 10 / 100);
    // drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, 100 / 190);
  };

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
