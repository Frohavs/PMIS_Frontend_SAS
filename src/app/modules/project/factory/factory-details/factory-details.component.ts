import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FactoryService } from 'src/app/services/factory.service';
import { ProjectsService } from 'src/app/services/projects.service';


@Component({
  selector: 'app-factory-details',
  templateUrl: './factory-details.component.html',
  styleUrl: './factory-details.component.scss'
})
export class FactoryDetailsComponent implements OnInit {


  factoryId: number;
  projectId: number;
  factoryDetails: any;
  isLoading: boolean;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private factoryService: FactoryService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.factoryId = +params['factoryId'];
      if (this.factoryId) {
        this.factoryService.getById(this.factoryId).subscribe(res => {
          this.factoryDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });

  }
}
