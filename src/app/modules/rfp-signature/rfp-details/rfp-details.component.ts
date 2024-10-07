import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RfpService } from 'src/app/services/rfp.service';
import { Location } from '@angular/common';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-rfp-details',
  templateUrl: './rfp-details.component.html',
  styleUrl: './rfp-details.component.scss'
})
export class RfpDetailsComponent implements OnInit, AfterViewInit {

  rfpId: any;
  rfpDetails: any;
  signatureSubCategories: any;

  currentId: number;
  signatureStage: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _location: Location,
    private elRef: ElementRef,
    private rfpService: RfpService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getBoqId();
  }

  ngAfterViewInit() {
    // this.signaturePad.set('minWidth', 5);
    // this.signaturePad.clear();
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
    this.currentId = rfpSignature?.id;
    this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad();
  }
  signChecker(rfpSignature: any) {
    this.currentId = rfpSignature?.id;
    this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad();
  }
  signReviewer(rfpSignature: any) {
    this.currentId = rfpSignature?.id;
    this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad()
  }
  signApprover(rfpSignature: any) {
    this.currentId = rfpSignature?.id;
    this.signatureStage = rfpSignature?.signatureStageId;
    this.toggleSignaturePad()
  }

  back() {
    this._location.back();
  }


  //////////////////////////////////////////////////////////////

  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  showSignaturePad: boolean = false;

  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 250,
    canvasHeight: 150,
    backgroundColor: 'rgba(0,0,0,0)',  // Ensures transparent background
    penColor: 'black'
  };

  // Method to toggle the signature pad visibility
  toggleSignaturePad() {
    this.showSignaturePad = !this.showSignaturePad;

    // If hiding, clear the signature
    if (!this.showSignaturePad) {
      this.clearSignature();
    }
  }

  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    console.log('Completed drawing', event);
  }

  drawStart(event: MouseEvent | Touch) {
    console.log('Start drawing', event);
  }
  // Method to clear the signature
  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  // Method to save the signature as an image
  saveSignature() {
    const payload = {
      id: this.currentId,
      signatureStage: this.signatureStage,
      signature: this.signaturePad.toDataURL('image/png')
    }
    this.rfpService.updateRFPSignatureSigns(payload).subscribe(res => {
      this.refreshData()
      this.toggleSignaturePad()
    });
  }
}
