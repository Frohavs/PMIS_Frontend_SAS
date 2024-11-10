import { Component, Input } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

@Component({
  selector: 'app-tree-node',
  templateUrl: './project-files-tree.component.html',
  styleUrl: './project-files-tree.component.scss'
})
export class ProjectFilesTreeComponent {
  @Input() node: any;
  isExpanded: boolean = false;

  constructor(
    private attachmentService: AttachmentService
  ) {}

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  getFileName(name: string) {
    const file = name.split('\\').pop()?.split('/').pop()?.split('?')[0];
    return file;
  }
  openFile(name: string) {
    // const file: any = name.split('\\').pop()?.split('/').pop()?.split('?')[0];
    this.attachmentService.downloadAttachment(name).subscribe(res => {
      window.open(res.data, '_blank');
    });
  }



}
