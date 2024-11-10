import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  API_USERS_URL = `${environment.apiUrl}/Attachment`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  uploadAttachment(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Upload`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  downloadAttachment(fileName: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/DownLoad?fileName=${fileName}`;
    return this.http.post<any>(url, {}, {
      headers: httpHeaders
    });
  }

  downloadBoqAttachment(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/DownLoad?fileName=Boq_Template.xlsx`;
    return this.http.post<any>(url, {}, {
      headers: httpHeaders
    });
  }
  downloadSCurveAttachment(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/DownLoad?fileName=Boq_Template.xlsx`;
    return this.http.post<any>(url, {}, {
      headers: httpHeaders
    });
  }
}
