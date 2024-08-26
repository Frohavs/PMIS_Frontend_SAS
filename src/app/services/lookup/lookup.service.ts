import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  API_USERS_URL = `${environment.apiUrl}/Lookup`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  getManagerUsers(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUserType?role=1`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  allUsers(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUserType`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getUnits() {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetUnits`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getVats() {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetVats`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getVendorType(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetCompanyVendors?vendorTypeId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getCashFlowYears(projectId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetYears?projectId=${projectId}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getStackHolders(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetStakeHolders`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  getSubContractors(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/GetSubContractors`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

}
