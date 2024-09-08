import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffEvaluationService {


  API_USERS_URL = `${environment.apiUrl}/StaffEvaluation`;
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
  getQuestion(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetQuestion`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addEvaluation(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  getEvaluationDetails(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetEvaluationItem/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  canCreate(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CanCreate`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
}
