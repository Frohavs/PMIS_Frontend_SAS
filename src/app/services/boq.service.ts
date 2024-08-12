import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoqService {

  API_USERS_URL = `${environment.apiUrl}/Boq`;
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
    const url = `${this.API_USERS_URL}/Get?projectId=${id}`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getBoq(id: number | null): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addBoq(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  updateBoq(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, payload, {
      headers: httpHeaders
    });
  }
  deleteBoq(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Delete/${id}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders
    });
  }

  uploadBoqFile(id: number, file: any) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateRange?projectId=${id}`;
    return this.http.post<any>(url, file, {
      headers: httpHeaders
    });
  }
}
