import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { StandardTreeService } from 'src/app/services/standard-tree.service';

type FolderKind = 'root' | 'standard' | 'category' | 'subCategory' | 'leaf';
type SortField = 'name' | 'date' | 'size';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'list' | 'grid';

interface TreeFolder {
  id: number | null;
  name: string;
  kind: FolderKind;
  parent: TreeFolder | null;
  children: TreeFolder[];
  attachments: any[];
}

interface LibraryRow {
  isFolder: boolean;
  name: string;
  type: string;
  size: number | null;
  uploadedBy: string;
  uploadedDate: string | null;
  extension: string;
  folder?: TreeFolder;
  attachment?: any;
}

@Component({
  selector: 'app-library-file-listing',
  templateUrl: './library-file-listing.component.html',
  styleUrl: './library-file-listing.component.scss'
})
export class LibraryFileListingComponent implements OnInit, OnDestroy {
  projectId!: number;
  projectName = '';

  treeData: any[] = [];
  rootFolder: TreeFolder | null = null;
  currentFolder: TreeFolder | null = null;
  breadcrumbFolders: TreeFolder[] = [];

  allRows: LibraryRow[] = [];
  displayedRows: LibraryRow[] = [];

  searchTerm = '';
  selectedType = 'all';
  selectedUploader = 'all';
  fromDate = '';
  toDate = '';
  sortBy: SortField = 'name';
  sortDir: SortDirection = 'asc';
  viewMode: ViewMode = 'list';

  isLoading = false;
  isUploading = false;
  loadError = false;

  previewTitle = '';
  previewUrl = '';
  previewSafeUrl: SafeResourceUrl | null = null;
  previewType = '';
  selectedFile: LibraryRow | null = null;
  isPreviewLoading = false;

  readonly typeFilters = [
    { value: 'all', labelKey: 'LIBRARY_FILES.ALL_TYPES' },
    { value: 'folder', labelKey: 'LIBRARY_FILES.FOLDER' },
    { value: 'pdf', labelKey: 'LIBRARY_FILES.PDF' },
    { value: 'doc', labelKey: 'LIBRARY_FILES.WORD' },
    { value: 'xls', labelKey: 'LIBRARY_FILES.EXCEL' },
    { value: 'image', labelKey: 'LIBRARY_FILES.IMAGE' },
    { value: 'zip', labelKey: 'LIBRARY_FILES.ZIP' },
    { value: 'other', labelKey: 'LIBRARY_FILES.OTHER' }
  ];

  uploadTargetFolder: TreeFolder | null = null;

  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  @ViewChild('previewModal')
  previewModal!: TemplateRef<any>;

  @ViewChild('toolbarUploadInput')
  toolbarUploadInput!: ElementRef<HTMLInputElement>;

  @ViewChild('inlineUploadInput')
  inlineUploadInput!: ElementRef<HTMLInputElement>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered modal-xl',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private attachmentService: AttachmentService,
    private standardTreeService: StandardTreeService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
        this.searchTerm = value;
        this.applyFiltersAndSort();
      })
    );

    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.projectId = +params['id'];
        this.projectName = `#${this.projectId}`;
        if (this.projectId) {
          this.fetchList();
        }
      })
    );
  }

  fetchList() {
    this.isLoading = true;
    this.loadError = false;

    this.subscriptions.add(
      this.standardTreeService.getByPRojectId(this.projectId).subscribe({
        next: res => {
          this.treeData = res?.data || [];
          this.buildFolderTree();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.loadError = true;
          this.cdr.detectChanges();
        }
      })
    );
  }

  buildFolderTree(): void {
    const root: TreeFolder = {
      id: null,
      name: 'Project Files',
      kind: 'root',
      parent: null,
      children: [],
      attachments: []
    };

    root.children = (this.treeData || []).map((node: any) => this.mapStandard(node, root));

    this.rootFolder = root;
    this.goToFolder(root);
  }

  mapStandard(node: any, parent: TreeFolder): TreeFolder {
    const folder: TreeFolder = {
      id: node.id,
      name: node.name,
      kind: 'standard',
      parent,
      children: [],
      attachments: node.attachments || []
    };

    folder.children = (node.categories || []).map((category: any) => this.mapCategory(category, folder));
    return folder;
  }

  mapCategory(category: any, parent: TreeFolder): TreeFolder {
    const folder: TreeFolder = {
      id: category.id,
      name: category.name,
      kind: 'category',
      parent,
      children: [],
      attachments: category.attachments || []
    };

    folder.children = (category.subCategories || []).map((subCategory: any) => this.mapSubCategory(subCategory, folder));
    return folder;
  }

  mapSubCategory(subCategory: any, parent: TreeFolder): TreeFolder {
    const folder: TreeFolder = {
      id: subCategory.id,
      name: subCategory.name,
      kind: 'subCategory',
      parent,
      children: [],
      attachments: subCategory.attachments || []
    };

    folder.children = (subCategory.leaves || []).map((leaf: any) => ({
      id: leaf.id,
      name: leaf.name,
      kind: 'leaf',
      parent: folder,
      children: [],
      attachments: leaf.attachments || []
    }));

    return folder;
  }

  goToFolder(folder: TreeFolder): void {
    this.currentFolder = folder;
    this.uploadTargetFolder = folder;

    const breadcrumbs: TreeFolder[] = [];
    let current: TreeFolder | null = folder;
    while (current) {
      breadcrumbs.unshift(current);
      current = current.parent;
    }
    this.breadcrumbFolders = breadcrumbs;

    this.buildRowsForCurrentFolder();
  }

  goToBreadcrumb(index: number): void {
    const target = this.breadcrumbFolders[index];
    if (target) {
      this.goToFolder(target);
    }
  }

  goBackToParent(): void {
    if (this.currentFolder?.parent) {
      this.goToFolder(this.currentFolder.parent);
    }
  }

  buildRowsForCurrentFolder(): void {
    if (!this.currentFolder) {
      this.allRows = [];
      this.displayedRows = [];
      return;
    }

    const folderRows: LibraryRow[] = this.currentFolder.children.map(folder => ({
      isFolder: true,
      name: folder.name,
      type: 'Folder',
      size: null,
      uploadedBy: '-',
      uploadedDate: null,
      extension: 'folder',
      folder
    }));

    const fileRows: LibraryRow[] = (this.currentFolder.attachments || []).map(file => {
      const fileName = file?.attachment || '';
      return {
        isFolder: false,
        name: fileName,
        type: this.getTypeLabel(fileName),
        size: this.parseSize(file),
        uploadedBy: file?.createdBy || '-',
        uploadedDate: file?.createdOn || file?.createdDate || file?.createdAt || null,
        extension: this.getFileGroup(fileName),
        attachment: file,
      };
    });

    this.allRows = [...folderRows, ...fileRows];
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    const search = this.searchTerm.trim().toLowerCase();

    let rows = [...this.allRows].filter(row => {
      const matchesSearch = !search || row.name.toLowerCase().includes(search);
      const matchesType = this.selectedType === 'all' || (this.selectedType === 'folder' ? row.isFolder : row.extension === this.selectedType);
      const matchesUploader = this.selectedUploader === 'all' || row.uploadedBy === this.selectedUploader;
      const matchesFromDate = !this.fromDate || !row.uploadedDate || new Date(row.uploadedDate) >= new Date(this.fromDate);
      const matchesToDate = !this.toDate || !row.uploadedDate || new Date(row.uploadedDate) <= new Date(this.toDate + 'T23:59:59');
      return matchesSearch && matchesType && matchesUploader && matchesFromDate && matchesToDate;
    });

    rows.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      let compare = 0;
      if (this.sortBy === 'name') {
        compare = a.name.localeCompare(b.name);
      } else if (this.sortBy === 'date') {
        const aDate = a.uploadedDate ? new Date(a.uploadedDate).getTime() : 0;
        const bDate = b.uploadedDate ? new Date(b.uploadedDate).getTime() : 0;
        compare = aDate - bDate;
      } else {
        const aSize = a.size ?? 0;
        const bSize = b.size ?? 0;
        compare = aSize - bSize;
      }

      return this.sortDir === 'asc' ? compare : -compare;
    });

    this.displayedRows = rows;
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value || '');
  }

  toggleSort(field: SortField): void {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.applyFiltersAndSort();
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.selectedUploader = 'all';
    this.fromDate = '';
    this.toDate = '';
    this.applyFiltersAndSort();
  }

  openRow(row: LibraryRow): void {
    if (row.isFolder && row.folder) {
      this.goToFolder(row.folder);
      return;
    }

    this.previewFile(row);
  }

  canUploadHere(folder: TreeFolder | null): boolean {
    return !!folder && ['standard', 'category', 'subCategory'].includes(folder.kind);
  }

  triggerToolbarUpload(): void {
    if (!this.canUploadHere(this.currentFolder)) {
      return;
    }

    this.uploadTargetFolder = this.currentFolder;
    this.toolbarUploadInput?.nativeElement?.click();
  }

  triggerInlineUpload(): void {
    if (!this.canUploadHere(this.currentFolder)) {
      return;
    }

    this.uploadTargetFolder = this.currentFolder;
    this.inlineUploadInput?.nativeElement?.click();
  }

  onToolbarFileSelected(event: Event): void {
    this.uploadToFolder(event, this.uploadTargetFolder);
    if (this.toolbarUploadInput?.nativeElement) {
      this.toolbarUploadInput.nativeElement.value = '';
    }
  }

  onInlineFileSelected(event: Event): void {
    this.uploadToFolder(event, this.uploadTargetFolder);
    if (this.inlineUploadInput?.nativeElement) {
      this.inlineUploadInput.nativeElement.value = '';
    }
  }

  uploadToFolder(event: Event, folder: TreeFolder | null): void {
    if (!folder || !this.canUploadHere(folder)) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.isUploading = true;

    const fd = new FormData();
    fd.append('Attachment', file, file.name);

    this.subscriptions.add(
      this.attachmentService.uploadAttachment(fd).subscribe({
        next: uploadRes => {
          const body = {
            attachment: uploadRes.data,
            projectId: this.projectId,
            categoryId: folder.kind === 'category' ? folder.id : null,
            standardId: folder.kind === 'standard' ? folder.id : null,
            subCategoryId: folder.kind === 'subCategory' ? folder.id : null,
            leafId: null
          };

          this.subscriptions.add(
            this.standardTreeService.createNew(body).subscribe({
              next: () => {
                const newAttachment = {
                  attachment: uploadRes.data,
                  createdBy: 'You',
                  createdOn: new Date().toISOString()
                };

                folder.attachments = [...(folder.attachments || []), newAttachment];

                if (this.currentFolder?.id === folder.id && this.currentFolder.kind === folder.kind) {
                  this.currentFolder.attachments = folder.attachments;
                  this.buildRowsForCurrentFolder();
                }

                this.isUploading = false;
                this.cdr.detectChanges();
              },
              error: () => {
                this.isUploading = false;
                alert(this.translate.instant('LIBRARY_FILES.UPLOAD_FAILED'));
              }
            })
          );
        },
        error: () => {
          this.isUploading = false;
          alert(this.translate.instant('LIBRARY_FILES.UPLOAD_FAILED'));
        }
      })
    );
  }

  previewFile(row: LibraryRow): void {
    if (row.isFolder || !row.attachment?.attachment) {
      return;
    }

    this.selectedFile = row;
    this.previewTitle = row.name;
    this.previewType = row.extension;
    this.previewUrl = '';
    this.previewSafeUrl = null;
    this.isPreviewLoading = true;

    this.modalService.open(this.previewModal, this.modalConfig);

    this.subscriptions.add(
      this.attachmentService.downloadAttachment(row.attachment.attachment).subscribe({
        next: res => {
          this.previewUrl = res?.data || '';
          if (this.previewType === 'pdf' && this.previewUrl) {
            this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
          } else {
            this.previewSafeUrl = null;
          }
          this.isPreviewLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.previewUrl = '';
          this.isPreviewLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  downloadRow(row: LibraryRow): void {
    if (row.isFolder || !row.attachment?.attachment) {
      return;
    }

    this.attachmentService.downloadAttachment(row.attachment.attachment).subscribe(res => {
      window.open(res?.data, '_blank');
    });
  }

  copyRowLink(row: LibraryRow): void {
    if (row.isFolder || !row.attachment?.attachment) {
      return;
    }

    this.attachmentService.downloadAttachment(row.attachment.attachment).subscribe(res => {
      const link = res?.data || '';
      if (!link) {
        return;
      }

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(link);
      }
    });
  }

  isPreviewSupported(row: LibraryRow | null): boolean {
    if (!row) {
      return false;
    }

    return ['pdf', 'image'].includes(row.extension);
  }

  getUploaderOptions(): string[] {
    const names = this.allRows
      .filter(row => !row.isFolder && row.uploadedBy && row.uploadedBy !== '-')
      .map(row => row.uploadedBy);

    return Array.from(new Set(names));
  }

  getSortIcon(field: SortField): string {
    if (this.sortBy !== field) {
      return 'SORT';
    }

    return this.sortDir === 'asc' ? 'ASC' : 'DESC';
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm.trim() ||
      this.selectedType !== 'all' ||
      this.selectedUploader !== 'all' ||
      this.fromDate ||
      this.toDate
    );
  }

  get folderCount(): number {
    return this.allRows.filter(row => row.isFolder).length;
  }

  get fileCount(): number {
    return this.allRows.filter(row => !row.isFolder).length;
  }

  getTypeFilterLabelKey(value: string): string {
    const map: Record<string, string> = {
      folder: 'LIBRARY_FILES.FOLDER',
      pdf: 'LIBRARY_FILES.PDF',
      doc: 'LIBRARY_FILES.WORD',
      xls: 'LIBRARY_FILES.EXCEL',
      image: 'LIBRARY_FILES.IMAGE',
      zip: 'LIBRARY_FILES.ZIP',
      other: 'LIBRARY_FILES.OTHER',
    };

    return map[value] || 'LIBRARY_FILES.ALL_TYPES';
  }

  getRowTypeLabelKey(row: LibraryRow): string {
    if (row.isFolder) {
      return 'LIBRARY_FILES.FOLDER';
    }

    return this.getTypeFilterLabelKey(row.extension);
  }

  getFileIcon(row: LibraryRow): string {
    if (row.isFolder) {
      return 'folder';
    }

    if (row.extension === 'pdf') {
      return 'file-text';
    }

    if (row.extension === 'doc') {
      return 'file-added';
    }

    if (row.extension === 'xls') {
      return 'file-up';
    }

    if (row.extension === 'image') {
      return 'picture';
    }

    if (row.extension === 'zip') {
      return 'element-plus';
    }

    return 'document';
  }

  getTypeLabel(fileName: string): string {
    const group = this.getFileGroup(fileName);

    if (group === 'pdf') return 'PDF';
    if (group === 'doc') return 'Word';
    if (group === 'xls') return 'Excel';
    if (group === 'image') return 'Image';
    if (group === 'zip') return 'ZIP';

    return 'File';
  }

  getFileGroup(fileName: string): string {
    const extension = (fileName.split('.').pop() || '').toLowerCase();

    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'xls';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
    if (['zip', 'rar', '7z'].includes(extension)) return 'zip';
    return 'other';
  }

  parseSize(file: any): number | null {
    const size = file?.size || file?.fileSize || null;
    const parsed = Number(size);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  formatSize(size: number | null): string {
    if (!size || size <= 0) {
      return '-';
    }

    if (size < 1024) {
      return `${size} B`;
    }

    const kb = size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

