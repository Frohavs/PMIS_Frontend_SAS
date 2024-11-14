import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HseService {

  API_USERS_URL = `${environment.apiUrl}/Hse`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getAll(id: number | null, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const milestone = {
      projectId: id,
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/Get`;
    return this.http.post<any>(url, milestone, {
      headers: httpHeaders
    });
  }
  getFileDetails(id: number | null): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addReport(report: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, report, {
      headers: httpHeaders
    });
  }
  updateProjectsFile(user: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, user, {
      headers: httpHeaders
    });
  }
  deleteFinding(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/DeleteFinding/${id}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders
    });
  }
  getFindingsById(id: number | null, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const milestone = {
      hseId: id,
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 10
      }
    }
    const url = `${this.API_USERS_URL}/GetFindings`;
    return this.http.post<any>(url, milestone, {
      headers: httpHeaders
    });
  }
  getFindingById(findingId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFinding/${findingId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getFindingLogsById(findingId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetFindingLogs/${findingId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  createFinding(report: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateFinding`;
    return this.http.post<any>(url, report, {
      headers: httpHeaders
    });
  }
  submitToContractor(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/SubmitToContractor`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  returnedToConsultant(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/ReturnedToConsultant`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  consultantReview(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/ConsultantReview`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  pMOReview(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/PMOReview`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
}
