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
        this.fetchList();
      }
    })
  }

  fetchList() {
    this.standardTreeService.getByPRojectId(this.projectId).subscribe(res => {
      this.treeData = res.data;
      this.cdr.detectChanges();
    });
  }

  uploadNodeTemplate(event: Event, node: any) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);

      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addNode(node, res.data);
      });
    }
  }
  uploadCategoryTemplate(event: Event, category: any) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);

      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addCategory(category, res.data);
      });
    }
  }
  uploadSubCategoryTemplate(event: Event, subCategory: any) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fd = new FormData();
      fd.append('Attachment', file, file.name);

      this.attachmentService.uploadAttachment(fd).subscribe(res => {
        this.addSubCategory(subCategory, res.data);
      });
    }
  }

  openNodePopup(node: any) {
    if(!node.attachments?.length) return;
    this.nodeModelData = node;
    this.modalService.open(this.nodeModal, this.modalConfig);
  }

  addNode(node: any, fileName: any) {
    console.log(node);
    const body = {
      "attachment": fileName,
      "projectId": this.projectId,
      "categoryId": null,
      "standardId": node.id,
      "subCategoryId": null,
      "leafId": null
    };
    this.standardTreeService.createNew(body).subscribe(res => {
      this.fetchList();
    },() => {
      alert('error');
    });
  }
  addCategory(category: any, fileName: any) {
    console.log(category);
    const body = {
      "attachment": fileName,
      "projectId": this.projectId,
      "categoryId": category.id,
      "standardId": null,
      "subCategoryId": null,
      "leafId": null
    };
    this.standardTreeService.createNew(body).subscribe(res => {
      this.fetchList();
    },() => {
      alert('error');
    });
  }
  addSubCategory(subCategory: any, fileName: any) {
    console.log(subCategory);
    const body = {
      "attachment": fileName,
      "projectId": this.projectId,
      "categoryId": null,
      "standardId": null,
      "subCategoryId": subCategory.id,
      "leafId": null
    };
    this.standardTreeService.createNew(body).subscribe(res => {
      this.fetchList();
    },() => {
      alert('error');
    });
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
