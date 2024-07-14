import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from 'express';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  roles: any[] = []

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.roleService.getAll().subscribe(res => {
      this.roles = res.data;
      this.cdr.detectChanges();
    });
  }

  create() {

  }
}
