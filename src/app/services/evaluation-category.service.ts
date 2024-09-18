import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationCategoryService {

  API_USERS_URL = `${environment.apiUrl}/EvaluationCategory`;
  API_USERS_URL2 = `${environment.apiUrl}/Evaluation`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getAll(typeId: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      typeId: typeId,
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
  getById(id: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const evaluation = {
      projectId: id,
      quickSearch: search,
      pagedSearch: {
        "pageIndex": pageIndex,
        "pageSize": 12
      }
    }
    const url = `${this.API_USERS_URL2}/Get`;
    return this.http.post<any>(url, evaluation, {
      headers: httpHeaders
    });
  }
  getCategoriesByProjectId(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL2}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  canCreateEvaluation(monthId: number, yearId: number, userId: number, projectId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const evaluation = {
      "monthId": monthId,
      "yearId": yearId,
      "userId": userId,
      "projectId": projectId
    }
    const url = `${this.API_USERS_URL2}/CanCreate`;
    return this.http.post<any>(url, evaluation, {
      headers: httpHeaders
    });
  }
  CreateMonthEvaluation(monthId: number, yearId: number, userId: number, projectId: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const evaluation = {
      "monthId": monthId,
      "yearId": yearId,
      "userId": userId,
      "projectId": projectId
    }
    const url = `${this.API_USERS_URL2}/Create`;
    return this.http.post<any>(url, evaluation, {
      headers: httpHeaders
    });
  }
  CreateEvaluation(payload: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL2}/CreateItems`;
    return this.http.post<any>(url, payload, {
      headers: httpHeaders
    });
  }
  // public methods
  getAllSubCategory(categoryId: number, pageIndex?: number, search?: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const body = {
      categoryId: categoryId,
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
  getEvalCategoryById(id: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }
  addEvalCategory(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Create`;
    return this.http.post<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateEvalCategory(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Update`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
  updateEvalCategoryStatus(invoice: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UpdateSubCategory`;
    return this.http.put<any>(url, invoice, {
      headers: httpHeaders
    });
  }
}
