import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RfpCategoryService {

  API_USERS_URL = `${environment.apiUrl}/RfpSignatureCategory`;
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
  getAllSub(pageIndex?: number, search?: string): Observable<any> {
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
    const url = `${this.API_USERS_URL}/GetSubCategories`;
    return this.http.post<any>(url, body, {
      headers: httpHeaders
    });
  }
  getCategoryById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addRFPSignatureCategory(rfp: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, rfp, {
      headers: httpHeaders
    });
  }
  addRFPSignatureSubCategory(rfp: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/CreateSubCategories`;
    return this.http.post<any>(url, rfp, {
      headers: httpHeaders
    });
  }
  UpdateRFPSignatureCategory(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
}
