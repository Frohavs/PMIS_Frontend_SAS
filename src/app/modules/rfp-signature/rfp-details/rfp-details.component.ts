import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RfpService } from 'src/app/services/rfp.service';

@Component({
  selector: 'app-rfp-details',
  templateUrl: './rfp-details.component.html',
  styleUrl: './rfp-details.component.scss'
})
export class RfpDetailsComponent implements OnInit {

  rfpId: any;
  rfpDetails: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private rfpService: RfpService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getBoqId();
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.rfpId = +params['id'];
      if (this.rfpId) {
        this.rfpService.getRFPSignatureById(this.rfpId).subscribe(res => {
          debugger
          this.rfpDetails = res;
        })
      }
    });
  }

  signAuthor() {

  }
}
