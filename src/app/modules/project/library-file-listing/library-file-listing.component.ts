import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from 'express';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { StandardTreeService } from 'src/app/services/standard-tree.service';

@Component({
  selector: 'app-library-file-listing',
  templateUrl: './library-file-listing.component.html',
  styleUrl: './library-file-listing.component.scss'
})
export class LibraryFileListingComponent implements OnInit {

  projectId!: number;
  treeData: any[] = [];

  @ViewChild('nodeModal')
  nodeModal: TemplateRef<any>;

  nodeModelData: any;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private attachmentService: AttachmentService,
    private standardTreeService: StandardTreeService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.standardTreeService.getByPRojectId(this.projectId).subscribe(res => {
          this.treeData = res.data;
          this.cdr.detectChanges();
        });
      }
    })
  }

  openNodePopup(node: any) {
    this.nodeModelData = node;
    debugger
    this.modalService.open(this.nodeModal, this.modalConfig);
  }

  addNode(node: any) {
    console.log(node);

  }

  toggleNode(node: any): void {
    console.log(node);
    node.expanded = !node.expanded;
  }

  downloadFile(attachment: string) {
    this.attachmentService.downloadAttachment(attachment).subscribe(res => {
      window.open(res.data, '_blank');
    });
  }
}
