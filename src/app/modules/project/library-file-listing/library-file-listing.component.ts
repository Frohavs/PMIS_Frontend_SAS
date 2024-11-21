import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { StandardTreeService } from 'src/app/services/standard-tree.service';

@Component({
  selector: 'app-library-file-listing',
  templateUrl: './library-file-listing.component.html',
  styleUrl: './library-file-listing.component.scss'
})
export class LibraryFileListingComponent implements OnInit {

  projectId!: number;
  treeData: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
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

  toggleNode(node: any): void {
    node.expanded = !node.expanded;
  }
}
