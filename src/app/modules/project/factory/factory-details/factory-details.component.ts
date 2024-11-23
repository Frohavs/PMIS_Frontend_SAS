import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/auth';
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

  userId: any;
  markerPosition: google.maps.LatLngLiteral | null = null;
  options: google.maps.MapOptions = {
    center: { lat: 24.774265, lng: 46.738586 },
    zoom: 11
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false // Enable marker dragging
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private factoryService: FactoryService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.id;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.factoryId = +params['factoryId'];
      if (this.factoryId) {
        this.getFactoryDetails()
      }
    });
  }

  getFactoryDetails() {
    this.factoryService.getById(this.factoryId).subscribe(res => {
      this.factoryDetails = res.data;
      this.markerPosition = { lat: +this.factoryDetails?.latitude, lng: +this.factoryDetails?.longitude };
      this.options.center = { lat: +this.factoryDetails?.latitude, lng: +this.factoryDetails?.longitude };
      this.cdr.detectChanges();
    });
  }

  approve() {
    if(this.factoryDetails.approvals.length === 2) return;
    const payload = {
      status: !this.factoryDetails.approvals ? 1 : 2,
      accepted: true,
      note: "string",
      userId: this.userId,
      factoryId: this.factoryId
    }
    this.factoryService.approveFactory(payload).subscribe(res => {

      this.getFactoryDetails();

    });
  }
}
