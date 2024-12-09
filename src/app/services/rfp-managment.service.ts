import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RfpManagementService {

  API_USERS_URL = `${environment.apiUrl}`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // RfpClassification methods
  getAllClassification(pageIndex?: number, search?: string): Observable<any> {
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
    const url = `${this.API_USERS_URL}/RfpClassification/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPClassificationById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPClassification(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateClassification(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpClassification/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }

  // RfpDepartment methods
  getAllDepartment(pageIndex?: number, search?: string): Observable<any> {
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
    const url = `${this.API_USERS_URL}/RfpDepartment/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPDepartmentById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPDepartment(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateDepartment(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpDepartment/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpPostion methods
  getAllPosition(pageIndex?: number, search?: string): Observable<any> {
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
    const url = `${this.API_USERS_URL}/RfpPostion/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRFPPositionById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPPosition(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updatePosition(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpPostion/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  // RfpSection methods
  getAllRfpSections(pageIndex?: number, search?: string): Observable<any> {
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
    const url = `${this.API_USERS_URL}/RfpSection/Get`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getRfpSectionById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRfpSection(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateRfpSection(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/RfpSection/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
}
