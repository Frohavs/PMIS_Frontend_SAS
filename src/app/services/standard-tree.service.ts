import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandardTreeService {

  API_USERS_URL = `${environment.apiUrl}/Standard`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getByPRojectId(id: number,): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const url = `${this.API_USERS_URL}/Get?projectId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  createNew(body: any) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateStandardAttachment`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
}
