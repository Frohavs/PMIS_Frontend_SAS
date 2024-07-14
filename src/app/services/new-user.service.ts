import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../modules/auth';

export interface IUserModel {

  id: string,
  userName: string,
  email: string,
  departmentId: number,
  lastActivity: string,
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  API_USERS_URL = `${environment.apiUrl}/User`;
  token: string;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private http: HttpClient) {
    const lsValue = localStorage.getItem(this.authLocalStorageToken);
    this.token = JSON.parse(lsValue as any)?.token;
  }

  // public methods
  getAll(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get`;
    return this.http.get<any>(url, {
      headers: httpHeaders
    });
  }

  getUser(id: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Get/${id}`;
    return this.http.get<IUserModel>(url, {
      headers: httpHeaders
    });
  }

  registerUser(user: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Register`;
    return this.http.post<any>(url, user, {
      headers: httpHeaders
    });
  }
  updateUser(user: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/UpdateUser`;
    return this.http.put<any>(url, user, {
      headers: httpHeaders
    });
  }
  deleteUser(id: number): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const url = `${this.API_USERS_URL}/Delete/${id}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders
    });
  }
}
