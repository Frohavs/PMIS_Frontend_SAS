import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  API_USERS_URL = `${environment.apiUrl}/Project`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getAllProjects(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 100
      }
    }
    const url = `${this.API_USERS_URL}/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getAll(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getByID(id?: number, etimadNumber?: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get`;
    let params;
    if(id) {
      params = new HttpParams().set('id', id);
    }
    if(etimadNumber) {
      params = new HttpParams().set('etimadNumber', etimadNumber);
    }
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params
    });
  }
  addProject(project: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, project, {
      headers: httpHeaders
    });
  }
  updateProject(project: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, project, {
      headers: httpHeaders
    });
  }
  deleteProject(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Delete/${id}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders
    });
  }

  updateProjectStaff(staff: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateProjectStaff`;
    return this.http.put<any>(url, staff, {
      headers: httpHeaders
    });
  }

  updateEot(eot: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateEOT`;
    return this.http.post<any>(url, eot, {
      headers: httpHeaders
    });
  }

  updateVariation(variation: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateVo`;
    return this.http.post<any>(url, variation, {
      headers: httpHeaders
    });
  }

  GetProgressInfo(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetProgressInfo?projectId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getProjectReportStatusReport(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetProjectReportStatusReport/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  updateProgressInfo(progress: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateProgressInfo`;
    return this.http.post<any>(url, progress, {
      headers: httpHeaders
    });
  }
  getStumbledProjects(pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/GetStumbledProjects`;
    return this.http.post<any>(url,body, {
      headers: httpHeaders
    });
  }
  getFinalValue(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFinalValue/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  updateProjectStage(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UpdateProjectStage`;
    return this.http.put<any>(url, payload, {
      headers: httpHeaders
    });
  }

}
