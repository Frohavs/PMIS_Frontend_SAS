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
  signatureSubCategories: any;

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
        this.refreshData();
      }
    });
  }

  refreshData() {
    this.rfpService.getRFPSignatureById(this.rfpId).subscribe(res => {
      this.rfpDetails = res.data;
      this.signatureSubCategories = res.data.signatureSubCategories;
      this.cdr.detectChanges()

    });
  }

  signAuthor(rfpSignature: any) {
    const payload = {
      id: rfpSignature?.id,
      signatureStage: rfpSignature?.signatureStageId,
      signature: "test123.pdf"
    }
    this.rfpService.updateRFPSignatureSigns(payload).subscribe(res => {
      debugger
      this.refreshData()
    });
  }
  signChecker(rfpSignature: any) {

    const payload = {
      id: rfpSignature?.id,
      signatureStage: rfpSignature?.signatureStageId,
      signature: "test123.pdf"
    }
    this.rfpService.updateRFPSignatureSigns(payload).subscribe(res => {
      debugger
      this.refreshData()
    });
  }
  signReviewer(rfpSignature: any) {

    const payload = {
      id: rfpSignature?.id,
      signatureStage: rfpSignature?.signatureStageId,
      signature: "test123.pdf"
    }
    this.rfpService.updateRFPSignatureSigns(payload).subscribe(res => {
      debugger
      this.refreshData()
    });
  }
  signApprover(rfpSignature: any) {
    const payload = {
      id: rfpSignature?.id,
      signatureStage: rfpSignature?.signatureStageId,
      signature: "test123.pdf"
    }
    this.rfpService.updateRFPSignatureSigns(payload).subscribe(res => {
      debugger
      this.refreshData()
    });

  }
}
