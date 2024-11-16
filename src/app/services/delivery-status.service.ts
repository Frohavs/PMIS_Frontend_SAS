import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStatusService {




  API_USERS_URL = `${environment.apiUrl}/InitiallyDelivery`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }
  // public methods
  getDeliveryStatusById(projectId: number | null, typeId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetDeliveryStatus/${projectId}/${typeId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  createDeliveryStatus(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateDeliveryStatus`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  createDeliveryStatusItems(path: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateDeliveryStatusItems`;
    return this.http.put<any>(url, path, {
      headers: httpHeaders
    });
  }
}
