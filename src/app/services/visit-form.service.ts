import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitFormService {

  API_USERS_URL = `${environment.apiUrl}/VisitForm`;
  API_USERS_URL_Attendee = `${environment.apiUrl}/VisitFormAttendee`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getAll(id: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      projectId: id,
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
  getVisitDetailsById(id: number | null): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetDetails/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getVisitById(id: number | null): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addVisit(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateVisitForm`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  editVisit(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, payload, {
      headers: httpHeaders
    });
  }
  addComment(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateVisitFormComment`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  updateSite(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, payload, {
      headers: httpHeaders
    });
  }
  deleteSite(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Delete/${id}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders
    });
  }
  updateDocumentFields(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UpdateFields`;
    return this.http.put<any>(url, payload, {
      headers: httpHeaders
    });
  }
  addAttendee(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL_Attendee}/Upsert`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  upsertVisitFormStep(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UpsertVisitFormStep`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  getStatusDocuments(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStatusDocuments/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getSchedulePositions(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetSchedulePositions/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getVisitFormHealth(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetVisitFormHealth/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getQualityGuarantors(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetQualityGuarantors/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getPeriodicReports(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetPeriodicReports/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getProjectPlans(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetProjectPlans/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

}
