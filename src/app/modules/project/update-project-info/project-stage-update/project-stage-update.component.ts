import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-project-stage-update',
  templateUrl: './project-stage-update.component.html',
  styleUrl: './project-stage-update.component.scss'
})
export class ProjectStageUpdateComponent implements OnInit {

  projectId: number;
  isLoading: boolean;
  UpdateStageForm: FormGroup;

  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  constructor(
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

    this.initUpdateStageForm();
  }

  initUpdateStageForm() {
    this.UpdateStageForm = this.formBuilder.group({
      new_project_stage: ['', Validators.required],
    });
  }

  saveChanges() {

  }
}
