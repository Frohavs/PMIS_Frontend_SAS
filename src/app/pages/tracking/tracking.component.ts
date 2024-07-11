import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {

  Add_text: string;
  Search_text: string;
  dataColumns: any[] = []
  dataList: any[] = [
    {
      name: 'أحمد مطاوع',
      txt2: '/project_list/125	',
      txt3: 'user visited this url.	',
      txt4: '2023-02-28 12:39:53',
    },
    {
      name: 'أبراهيم مجدي',
      txt2: '/project_list/126',
      txt3: 'user visited this url.	',
      txt4: '2023-02-28 12:39:53',
    },
    {
      name: 'تركي العيسى	',
      txt2: '/project_list/127',
      txt3: 'user visited this url.	',
      txt4: '2023-02-28 12:39:53',
    },
    {
      name: 'مؤيد العيسى	',
      txt2: '/project_list/128',
      txt3: 'user visited this url.	',
      txt4: '2023-02-28 12:39:53',
    },
    {
      name: 'اسلام الخشاب',
      txt2: '/project_list/129',
      txt3: 'user visited this url.	',
      txt4: '2023-02-28 12:39:53',
    },

  ]

  constructor(
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.Add_text = '',
      this.Search_text = this.translate.instant('TRACKING.Search'),
      this.dataColumns = [
        { title: this.translate.instant('TRACKING.ID'), className: 'rounded-start min-w-150px px-4' },
        { title: this.translate.instant('TRACKING.full_name'), className: 'min-w-150px p-3' },
        { title: this.translate.instant('TRACKING.url'), className: 'ps-4 min-w-200px' },
        { title: this.translate.instant('TRACKING.message'), className: 'min-w-150px' },
        { title: this.translate.instant('TRACKING.date'), className: 'min-w-200px rounded-end' },
      ]
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
