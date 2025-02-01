import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProjectsService } from 'src/app/services/projects.service';
import { VisitFormService } from 'src/app/services/visit-form.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrl: './form-table.component.scss',
})
export class FormTableComponent implements OnInit {
  projectId: number;
  visitId: number;
  projectDetails: any;
  visitDetails: any;
  visitIndices: any[] = [];
  visitRiskLevels: any[] = [];
  visitObjectives: any[] = [];
  visitSchedulePositions: any[] = [];
  visitHealths: any[] = [];
  isLoading: boolean;
  documentType: number = 0;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  changeDocumentForm: FormGroup;
  @ViewChild('documentModal') documentModal: TemplateRef<any>;
  attendanceForm: FormGroup;
  @ViewChild('attendanceModal') attendanceModal: TemplateRef<any>;
  objectivesForm: FormGroup;
  @ViewChild('objectivesModal') objectivesModal: TemplateRef<any>;
  scheduleForm: FormGroup;
  @ViewChild('scheduleModal') scheduleModal: TemplateRef<any>;
  chRequestsForm: FormGroup;
  @ViewChild('chRequestsModal') chRequestsModal: TemplateRef<any>;
  healthForm: FormGroup;
  @ViewChild('healthModal') healthModal: TemplateRef<any>;
  recommendationForm: FormGroup;
  @ViewChild('recommendationModal') recommendationModal: TemplateRef<any>;

  evidenceForm: FormGroup;
  risks: any[] = [];
  selectedFile: any;
  @ViewChild('evidenceModal') evidenceModal: TemplateRef<any>;

  criticalProblemsForm: FormGroup;
  criticalStatus: any[] = [
    {
      name: 'Open',
      id: true,
    },
    {
      name: 'Close',
      id: false,
    },
  ];
  @ViewChild('criticalProblemsModal') criticalProblemsModal: TemplateRef<any>;

  lessonForm: FormGroup;
  lessonClassifications: any[] = [
    {
      name: 'Type 1',
      id: 1,
    },
    {
      name: 'Type 2',
      id: 2,
    },
  ];
  @ViewChild('lessonModal') lessonModal: TemplateRef<any>;

  riskForm: FormGroup;
  expectedImpacts: any[] = [
    {
      name: 'Type 1',
      id: 1,
    },
    {
      name: 'Type 2',
      id: 2,
    },
  ];
  riskOwners: any[] = [
    {
      name: 'Type 1',
      id: 1,
    },
    {
      name: 'Type 2',
      id: 2,
    },
  ];
  typeResponses: any[] = [
    {
      name: 'Type 1',
      id: 1,
    },
    {
      name: 'Type 2',
      id: 2,
    },
  ];
  @ViewChild('riskModal') riskModal: TemplateRef<any>;

  correctivePlanForm: FormGroup;
  correctivePlanClassifications: any[] = [
    {
      name: 'Type 1',
      id: 1,
    },
    {
      name: 'Type 2',
      id: 2,
    },
  ];
  visitCommitments: any[] = [];
  visitConditions: any[] = [];
  @ViewChild('correctivePlanModal') correctivePlanModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private attachmentService: AttachmentService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private visitFormService: VisitFormService
  ) {}

  ngOnInit(): void {
    this.getLookups();
    this.initChangeDocumentForm();
    this.initAttendanceForm();
    this.initObjectivesForm();
    this.initScheduleForm();
    this.initHealthForm();
    this.initChRequestsForm();
    this.initRecommendationForm();
    this.initEvidenceForm();
    this.initCriticalProblems();
    this.initLesson();
    this.initRisk();
    this.initCorrectivePlan();

    this.activatedRoute.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectDetails();
      }
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.visitId = +params['visitId'];
      if (this.visitId) {
        this.getVisitDetails();
      }
    });
  }

  getProjectDetails() {
    this.projectsService.getByID(this.projectId).subscribe((res) => {
      this.projectDetails = res.data;
      this.cdr.detectChanges();
    });
  }
  getVisitDetails() {
    this.visitFormService.getVisitById(this.visitId).subscribe((res) => {
      this.visitDetails = res.data;
      this.getVisitFormHealth();
      this.cdr.detectChanges();
    });
  }
  getLookups() {
    this.lookupService.getVisitFormIndices().subscribe((res) => {
      this.visitIndices = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getVisitFormRiskLevel().subscribe((res) => {
      this.visitRiskLevels = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getVisitFormConditions().subscribe((res) => {
      this.visitConditions = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getCommitmentTypes().subscribe((res) => {
      this.visitCommitments = res.data;
      this.cdr.detectChanges();
    });
    this.getObjectivesLookup();
    this.getSchedulePositions();
  }

  getObjectivesLookup() {
    this.lookupService.getVisitObjectives().subscribe((res) => {
      this.visitObjectives = res.data;
      this.cdr.detectChanges();
    });
  }

  getSchedulePositions() {
    this.lookupService.getSchedulePositions().subscribe((res) => {
      this.visitSchedulePositions = res.data;
      this.cdr.detectChanges();
    });
  }
  getVisitFormHealth() {
    this.lookupService.getVisitFormHealth().subscribe((res) => {
      this.visitHealths = res.data;
  
      const transformedData = this.visitHealths.map((item: any) => {
        const matched = this.visitDetails?.visitFormHealth?.find(
          (v: any) => v.healthAndSecurityTitle === item.name
        );
  
        return {
          id: item.id,
          name: item.name,
          fullyCommitted: matched?.commitment === 'Fully Committed' || false,
          partiallyCommitted: matched?.commitment === 'Partially Committed' || false,
          notCommitted: matched?.commitment === 'Not Committed' || false,
          na: matched?.commitment === 'NA' || false,
          note: matched?.note || '',
        };
      });
  
      this.visitHealths = transformedData;
      this.cdr.detectChanges();
    });
  }

  changeDocumentNo(type: number) {
    this.documentType = type;
    this.modalService.open(this.documentModal, this.modalConfig);
  }
  openAttendance(attendance?: any) {
    this.attendanceForm.reset();
    if (attendance) {
      this.attendanceForm.patchValue({
        id: attendance.id,
        name: attendance.name,
        side: attendance.side,
        job: attendance.job,
        email: attendance.email,
      });
    }
    this.modalService.open(this.attendanceModal, this.modalConfig);
  }
  openObjectives(objective?: any) {
    this.objectivesForm.reset();
    if (objective) {
      this.objectivesForm.patchValue({
        id: objective.id,
        name: objective.name,
      });
    }
    this.modalService.open(this.objectivesModal, this.modalConfig);
  }
  openRecommendation(recommend?: any) {
    this.recommendationForm.reset();
    if (recommend) {
      this.recommendationForm.patchValue({
        id: recommend.id,
        name: recommend.name,
      });
    }
    this.modalService.open(this.recommendationModal, this.modalConfig);
  }
  openCommunication(recommend?: any) {
    this.recommendationForm.reset();
    if (recommend) {
      this.recommendationForm.patchValue({
        id: recommend.id,
        name: recommend.name,
      });
    }
    this.modalService.open(this.recommendationModal, this.modalConfig);
  }

  openSchedule(schedule?: any) {
    this.scheduleForm.reset();
    if (schedule) {
      // this.scheduleForm.patchValue({
      //   // commitment: schedule.commitment,
      //   // schedulePositionId: schedule.schedulePositionId,
      //   // date: schedule.date.slice(0, 10),
      //   // status: schedule.status,
      //   // note: schedule.note,
      // });
    }
    this.modalService.open(this.scheduleModal, this.modalConfig);
  }
  openChRequests(request?: any) {
    this.chRequestsForm.reset();
    if (request) {
      this.chRequestsForm.patchValue({
        id: request.id,
        description: request.description,
        referenceNumber: request.referenceNumber,
        dateAccreditation: request.dateAccreditation.slice(0, 10),
        condition: request.condition,
        influence: request.influence,
        cause: request.cause,
        check: request.check,
      });
    }
    this.modalService.open(this.chRequestsModal, this.modalConfig);
  }
  openVisitHealth(request?: any) {
    this.healthForm.reset();
    if (request) {
      this.healthForm.patchValue({
        healthAndSecurityId: request.id,
        commitment: request.commitment,
        note: request.note,
      });
    }
    this.modalService.open(this.healthModal, this.modalConfig);
  }

  openEvidence(evidence?: any) {
    this.evidenceForm.reset();
    if (evidence) {
      this.evidenceForm.patchValue({
        id: evidence.id,
        picture: evidence.attachment,
        notes: evidence.note,
        riskId: evidence.riskLevelId,
      });
    }
    this.modalService.open(this.evidenceModal, this.modalConfig);
  }
  openCriticalProblems(problem?: any) {
    this.criticalProblemsForm.reset();
    if (problem) {
      this.criticalProblemsForm.patchValue({
        id: problem.id,
        description: problem.description,
        actionTaken: problem.actionTaken,
        startDate: problem.startDate?.slice(0, 10),
        anotherDateProcedure: problem?.anotherDate.slice(0, 10),
        status: problem.status === true ? 1 : 2,
        notes: problem.notes,
      });
    }
    this.modalService.open(this.criticalProblemsModal, this.modalConfig);
  }

  openLesson(lesson?: any) {
    this.lessonForm.reset();
    if (lesson) {
      this.lessonForm.patchValue({
        id: lesson.id,
        learned: lesson.learned,
        classification: 1,
        impact: lesson.impact,
        notes: lesson.notes,
      });
    }
    this.modalService.open(this.lessonModal, this.modalConfig);
  }

  openRisk(risk?: any) {
    this.riskForm.reset();
    if (risk) {
      this.riskForm.patchValue({
        id: risk.id,
        learned: risk.learned,
        classification: 1,
        impact: risk.impact,
        notes: risk.notes,
      });
    }
    this.modalService.open(this.riskModal, this.modalConfig);
  }
  openCorrectivePlan(plan?: any) {
    this.correctivePlanForm.reset();
    if (plan) {
      this.correctivePlanForm.patchValue({
        id: plan.id,
        works: plan.works,
        classification: plan.classification,
        notes: plan.notes,
        expectedDate: plan.expectedDate.slice(0, 10),
        condition: plan.condition,
        assigned: plan.assigned,
      });
    }
    this.modalService.open(this.correctivePlanModal, this.modalConfig);
  }

  initChangeDocumentForm() {
    this.changeDocumentForm = this.fb.group({
      documentNo: ['', Validators.required],
    });
  }
  initAttendanceForm() {
    this.attendanceForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      side: ['', Validators.required],
      job: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
  initObjectivesForm() {
    this.objectivesForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
    });
  }
  initScheduleForm() {
    this.scheduleForm = this.fb.group({
      schedulePositionId: [0],
      commitment: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      note: ['', Validators.required],
    });
  }
  initHealthForm() {
    this.healthForm = this.fb.group({
      healthAndSecurityId: [0],
      commitment: ['', Validators.required],
      note: ['', Validators.required],
    });
  }
  initChRequestsForm() {
    this.chRequestsForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      dateAccreditation: ['', Validators.required],
      condition: ['', Validators.required],
      influence: ['', Validators.required],
      cause: ['', Validators.required],
      check: [true],
    });
  }
  initRecommendationForm() {
    this.recommendationForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
    });
  }
  initEvidenceForm() {
    this.evidenceForm = this.fb.group({
      id: [0],
      picture: ['', Validators.required],
      notes: ['', Validators.required],
      riskId: ['', Validators.required],
    });
  }
  initCriticalProblems() {
    this.criticalProblemsForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      actionTaken: ['', Validators.required],
      startDate: ['', Validators.required],
      anotherDateProcedure: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }
  initLesson() {
    this.lessonForm = this.fb.group({
      id: [0],
      learned: ['', Validators.required],
      classification: ['', Validators.required],
      impact: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }
  initRisk() {
    this.riskForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      expectedImpactId: ['', Validators.required],
      riskOwnerId: ['', Validators.required],
      typeResponseId: ['', Validators.required],
      responseplan: ['', Validators.required],
    });
  }
  initCorrectivePlan() {
    this.correctivePlanForm = this.fb.group({
      id: [0],
      works: ['', Validators.required],
      classification: ['', Validators.required],
      notes: ['', Validators.required],
      expectedDate: ['', Validators.required],
      condition: ['', Validators.required],
      assigned: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    const fd = new FormData();
    fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    this.attachmentService.uploadAttachment(fd).subscribe(
      (res) => {
        this.evidenceForm.patchValue({
          picture: res.data,
        });
      },
      (error) => {
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try upload again',
        });
      }
    );
  }

  onChangeDocumentNo() {
    // const val = this.updateForm.value
    if (this.changeDocumentForm.invalid) {
      this.changeDocumentForm.markAllAsTouched();
      return;
    }
    const payload = {
      id: this.visitId,
      updateType: this.documentType,
      documentNo: this.changeDocumentForm.value.documentNo,
      generalRecommendations: this.changeDocumentForm.value.documentNo,
      communicationAndCoordination: this.changeDocumentForm.value.documentNo,
      safetyRecommendations: this.changeDocumentForm.value.documentNo,
      totalCommitmentPercentage: this.changeDocumentForm.value.documentNo,
    };

    this.visitFormService.updateDocumentFields(payload).subscribe(
      (res) => {
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.changeDocumentForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Updated successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddAttendance() {
    if (this.attendanceForm.invalid) {
      this.attendanceForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 1,
      body: {
        visitFormId: this.visitId,
        name: this.attendanceForm.value.name,
        side: this.attendanceForm.value.side,
        job: this.attendanceForm.value.job,
        email: this.attendanceForm.value.email,
      },
    };
    if (
      this.attendanceForm.value.id !== 0 &&
      this.attendanceForm.value.id !== null
    ) {
      payload.body['id'] = this.attendanceForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.attendanceForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text: 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onSchedulePosition() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 14,
      body: {
        commitment: +this.scheduleForm.value.commitment,
        status: +this.scheduleForm.value.status,
        date: this.scheduleForm.value.date,
        note: this.scheduleForm.value.note,
        visitFormId: this.visitId,
      },
    };

    if (
      this.scheduleForm.value.schedulePositionId !== 0 &&
      this.scheduleForm.value.schedulePositionId !== null
    ) {
      payload.body['schedulePositionId'] =
        this.scheduleForm.value.schedulePositionId;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.scheduleForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.objectivesForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onVisitHealth() {
    if (this.healthForm.invalid) {
      this.healthForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 10,
      body: {
        commitment: +this.healthForm.value.commitment,
        note: this.healthForm.value.note,
        visitFormId: this.visitId,
      },
    };

    if (
      this.healthForm.value.healthAndSecurityId !== 0 &&
      this.healthForm.value.healthAndSecurityId !== null
    ) {
      payload.body['healthAndSecurityId'] =
        this.healthForm.value.healthAndSecurityId;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.healthForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.objectivesForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onChRequests() {
    if (this.chRequestsForm.invalid) {
      this.chRequestsForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 2,
      body: {
        id: 1,
        description: this.chRequestsForm.value.description,
        referenceNumber: +this.chRequestsForm.value.referenceNumber,
        dateAccreditation: this.chRequestsForm.value.dateAccreditation,
        condition: +this.chRequestsForm.value.condition,
        influence: this.chRequestsForm.value.influence,
        cause: this.chRequestsForm.value.cause,
        check: true,
        visitFormId: this.visitId,
      },
    };

    if (
      this.chRequestsForm.value.id !== 0 &&
      this.chRequestsForm.value.id !== null
    ) {
      payload.body['id'] = this.chRequestsForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.chRequestsForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.objectivesForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddObjective() {
    if (this.objectivesForm.invalid) {
      this.objectivesForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 15,
      body: {
        visitFormId: this.visitId,
        name: this.objectivesForm.value.name,
        nameAr: this.objectivesForm.value.name,
      },
    };
    if (
      this.objectivesForm.value.id !== 0 &&
      this.objectivesForm.value.id !== null
    ) {
      payload.body['id'] = this.objectivesForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getObjectivesLookup();
        this.modalService.dismissAll();
        this.objectivesForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.objectivesForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }

  onAddEvidence() {
    if (this.evidenceForm.invalid) {
      this.evidenceForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 3,
      body: {
        attachment: this.evidenceForm.value.picture,
        note: this.evidenceForm.value.notes,
        riskLevel: +this.evidenceForm.value.riskId,
        visitFormId: this.visitId,
      },
    };
    if (
      this.evidenceForm.value.id !== 0 &&
      this.evidenceForm.value.id !== null
    ) {
      payload.body['id'] = this.evidenceForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.evidenceForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.evidenceForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddCriticalProblem() {
    if (this.criticalProblemsForm.invalid) {
      this.criticalProblemsForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 4,
      body: {
        description: this.criticalProblemsForm.value.description,
        actionTaken: this.criticalProblemsForm.value.actionTaken,
        startDate: this.criticalProblemsForm.value.startDate,
        anotherDateProcedure:
          this.criticalProblemsForm.value.anotherDateProcedure,
        status:
          this.criticalProblemsForm.value.status === 'true' ? true : false,
        notes: this.criticalProblemsForm.value.notes,
        visitFormId: this.visitId,
      },
    };
    if (
      this.criticalProblemsForm.value.id !== 0 &&
      this.criticalProblemsForm.value.id !== null
    ) {
      payload.body['id'] = this.criticalProblemsForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.criticalProblemsForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.criticalProblemsForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddLesson() {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 5,
      body: {
        learned: this.lessonForm.value.learned,
        classification: this.lessonForm.value.classification,
        impact: this.lessonForm.value.impact,
        notes: this.lessonForm.value.notes,
        visitFormId: this.visitId,
      },
    };
    if (this.lessonForm.value.id !== 0 && this.lessonForm.value.id !== null) {
      payload.body['id'] = this.lessonForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.lessonForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.lessonForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddRisk() {
    if (this.riskForm.invalid) {
      this.riskForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 6,
      body: {
        id: 1,
        description: this.riskForm.value.description,
        responseplan: this.riskForm.value.responseplan,
        expectedImpactId: +this.riskForm.value.expectedImpactId,
        riskOwnerId: +this.riskForm.value.riskOwnerId,
        typeResponseId: +this.riskForm.value.typeResponseId,
        visitFormId: this.visitId,
      },
    };
    if (this.riskForm.value.id !== 0 && this.riskForm.value.id !== null) {
      payload.body['id'] = this.riskForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.riskForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.riskForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }
  onAddCorrectivePlan() {
    if (this.correctivePlanForm.invalid) {
      this.correctivePlanForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let payload: any = {
      step: 16,
      body: {
        works: this.correctivePlanForm.value.works,
        classification: this.correctivePlanForm.value.classification,
        notes: this.correctivePlanForm.value.notes,
        expectedDate: this.correctivePlanForm.value.expectedDate,
        condition: +this.correctivePlanForm.value.condition,
        assigned: this.correctivePlanForm.value.assigned,
        visitFormId: this.visitId,
      },
    };
    if (
      this.correctivePlanForm.value.id !== 0 &&
      this.correctivePlanForm.value.id !== null
    ) {
      payload.body['id'] = this.correctivePlanForm.value.id;
    }

    this.visitFormService.upsertVisitFormStep(payload).subscribe(
      (res) => {
        this.isLoading = false;
        this.getVisitDetails();
        this.modalService.dismissAll();
        this.correctivePlanForm.reset();
        this.showAlert({
          icon: 'success',
          title: 'Success!',
          text:
            this.riskForm.value.id !== 0
              ? 'Updated successfully!'
              : 'Added successfully!',
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.showAlert({
          icon: 'error',
          title: 'Error!',
          text: 'Please try again',
        });
      }
    );
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  back() {
    this._location.back();
  }

  numbersOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && charCode != 43 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getImage(id: string) {
    this.attachmentService.downloadAttachment(id).subscribe((res) => {
      window.open(res.data, '_blank');
    });
  }
}
