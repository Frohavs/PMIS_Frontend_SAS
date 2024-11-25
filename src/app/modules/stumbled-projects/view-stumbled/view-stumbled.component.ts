import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StumbledProjectsService } from 'src/app/services/stumbled-projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

@Component({
  selector: 'app-view-stumbled',
  templateUrl: './view-stumbled.component.html',
  styleUrl: './view-stumbled.component.scss'
})
export class ViewStumbledComponent implements OnInit {

  projectId: number;
  stumbledId: number;
  stumbledDetails: any;

  constructor(
    private router: Router,
    private _location: Location,
    private attachmentService: AttachmentService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private stumbledProjectsService: StumbledProjectsService,
  ) { }

  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(params => {
      this.stumbledId = +params['stumbledId'];
      if (this.stumbledId) {
        this.stumbledProjectsService.getByID(this.stumbledId).subscribe(res => {
          this.stumbledDetails = res.data;
          this.cdr.detectChanges();
        });
      }
    });
  }

  downloadFile(attachment: string) {
    debugger
    this.attachmentService.downloadAttachment(attachment).subscribe(res => {
      window.open(res.data, '_blank');
    });
  }
}
