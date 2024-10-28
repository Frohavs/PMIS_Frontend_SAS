import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StageGateManagementService {

  API_USERS_URL = `${environment.apiUrl}/GateDeliverable`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
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
  getByID(id?: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  createGateDeliverable(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create/${id}`;
    return this.http.post<any>(url, {}, {
      headers: httpHeaders
    });
  }

  getCommitteeMembersByGateId(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetCommitteMembers/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  createCommitte(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateCommitte`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  createDeliverableChecklist(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateDeliverableChecklist`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  postKickoffSubmitMeeting(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateKickoffMeeting`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }

  getDeliverableAnswers(gateId?: number, stepId?: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${gateId}/${stepId}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  getKickOffPrint(id: any, stepId: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/PrintKickoff/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  submitKickOff(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateKickoffMeetingSubmitNote`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  uploadDeliverableChecklist(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UploadDeliverableChecklist`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  createReviewMeeting(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateReviewMeeting`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  postFinalReview(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateFinalReview`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  getFinalReviewPrint(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/PrintFinalReview/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  createCommitAcknowledgement(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateCommitAcknowledgement/${id}`;
    return this.http.post<any>(url, {}, {
      headers: httpHeaders
    });
  }
  getCommitAcknowledgementCommittees(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetCommitAcknowledgementCommittes/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  postFinalSubmit(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateFinalSubmit`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
}
