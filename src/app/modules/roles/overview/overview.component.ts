import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  roles: any[] = [];

  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.roleService.getAll().subscribe(res => {
      this.roles = res.data;
      this.cdr.detectChanges();
    });
  }
}
