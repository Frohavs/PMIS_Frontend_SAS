import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {

  API_USERS_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_USERS_URL}/Login`, {
      email,
      password,
    });
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_USERS_URL}/ForgetPassword`, {
      email,
    });
  }

  // getUserByToken(token: string): Observable<any> {
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(`${API_USERS_URL}/me`, {
  //     headers: httpHeaders,
  //   });
  // }
}
