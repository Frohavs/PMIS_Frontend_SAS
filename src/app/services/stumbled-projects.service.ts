import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { now } from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StumbledProjectsService {

  API_USERS_URL = `${environment.apiUrl}/StumbledProject`;
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
  getAllCreated(id: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const milestone = {
      "quickSearch": "",
      "month": new Date().getMonth() + 1,
      "year": new Date().getFullYear(),
      "projectId": id,
      "pagedSearch": {
        "pageIndex": 0,
        "pageSize": 0
      }
    }
    const url = `${this.API_USERS_URL}/Get`;
    return this.http.post<any>(url, milestone, {
      headers: httpHeaders
    });
  }
  getByID(id: number | null): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  createStumbledProject(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
}
