import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SCurveService {

  API_USERS_URL = `${environment.apiUrl}/Scurve`;
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

  downloadScurve(id: number | null): Observable<any> {
    const url = `${this.API_USERS_URL}/DownloadScurve?projectId=${id}`;
    return this.http.post<any>(url, {});
  }

  uploadSCurveFile(id: number, file: any) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create?projectId=${id}`;
    return this.http.post<any>(url, file, {
      headers: httpHeaders
    });
  }
}
